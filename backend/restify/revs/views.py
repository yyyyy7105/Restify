from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, DestroyAPIView, \
    CreateAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination

from revs.models import Ntf, Rev
from property.models import Property
from revs.serializer import RevListSerializer, RevSerializer, RevUpdateSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
# from rest_framework import filters
from rest_framework.exceptions import PermissionDenied, NotAuthenticated, NotFound, ParseError
from django.db.models import Q


class RevCreate(CreateAPIView):
    serializer_class = RevSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, property_id):
        # Check if the current user is authenticated
        if not request.user.is_authenticated:
            return Response({'error': 'Cannot create reservation request, please login first.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if the Property with property_id exists
        # property = get_object_or_404(Property, id=property_id, message=f'property with id:{property_id} does not exists')
        try:
            property = Property.objects.get(pk=property_id)
        except Property.DoesNotExist:
            return Response({'error': f'property with id: {property_id} does not exists'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(data=request.data,
                                           context={'guest': self.request.user, 'property': property})
        # check potential guest is not host 
        if request.user == property.host:
            return Response({'error':'cannot book own property'}, status=status.HTTP_400_BAD_REQUEST)
        
        # check req data valid: required & start_date < end_date
        req_start_date = request.POST.get('start_date')
        req_end_date = request.POST.get('end_date')
        if (not req_end_date) or (not req_start_date) or (req_start_date >= req_end_date):
            return Response({'error': 'Please provide valid values for start_date and end_date'}, status=status.HTTP_400_BAD_REQUEST)
        
        # check book window non-overlap
        active_revs = Rev.objects.filter(Q(status='pending') | Q(status='approved')| Q(status='pending(cancel request)')).filter(property__id=property_id)
        revs = active_revs.filter(Q(start_date__lte=req_end_date) & Q(end_date__gte=req_end_date))
        revs2 = active_revs.filter(Q(start_date__lte=req_start_date) & Q(end_date__gte=req_start_date))
        revs3 = active_revs.filter(Q(start_date__gte=req_start_date) & Q(end_date__lte=req_end_date))
        if revs.exists() or revs2.exists() or revs3.exists():
            return Response({'error':'request reservation time not availalbe'}, status=status.HTTP_400_BAD_REQUEST)
        
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        


class Transition:
    def __init__(self, action, source, target, user_type, notification_recipient_user_type, notification_msg):
        self.action = action
        self.source = source
        self.target = target
        self.user_type = user_type
        self.notification_recipient_user_type = notification_recipient_user_type
        self.notification_msg = notification_msg


class RevUpdate(UpdateAPIView):
    serializer_class = RevUpdateSerializer
    permission_classes = [IsAuthenticated]
    # renderer_classes = [JSONRenderer]
    # lookup_field = 'reservation_id'  # add this line to specify the lookup field

    transitions = [
        Transition('deny_reservation_request', 'pending', 'denied',
                   'host', 'guest', 'Your reservation request is denied by host.'),
        Transition('approve_reservation_request', 'pending', 'approved',
                   'host', 'guest', 'Your reservation request is approved by host.'),
        Transition('request_cancel_reservation', 'approved',
                   'pending(cancel request)', 'guest', 'host', 'You got cancel request from guest.'),
        Transition('deny_cancel_request', 'pending(cancel request)', 'approved',
                   'host', 'guest', 'Your cancel request is denied by host.'),
        Transition('approve_cancel_request', 'pending(cancel request)', 'canceled',
                   'host', 'guest', 'Your cancel request is approved by host.'),
        Transition('terminate', 'approved', 'terminated', 'host',
                   'guest', 'Your reservation is terminated by host.'),
    ]

    def get_queryset(self):
        rid = int(self.kwargs['pk'])
        if not Rev.objects.filter(id=rid).exists():
            return Response({'error': f'reservation with id: {rid} does not exists'}, status=status.HTTP_404_NOT_FOUND)
        return Rev.objects.filter(id=rid)

    def handle_exception(self, exc):
        if isinstance(exc, PermissionDenied):
            return Response({"detail": exc.detail}, status=403)
        if isinstance(exc, NotFound):
            return Response({"detail": exc.detail}, status=404)
        if isinstance(exc, ParseError):
            return Response({"detail": exc.detail}, status=400)
        return super().handle_exception(exc)

    def perform_update(self, serializer):
        rid = int(self.kwargs['pk'])
        action = self.kwargs['action']
        # check reservation exists
        if not Rev.objects.filter(id=rid).exists():
            raise NotFound(f'reservation with id: {rid} does not exists')

        reservation = get_object_or_404(Rev, id=rid)
        host = reservation.property.host
        guest = reservation.guest
        current_user = self.request.user

        # check user type permission, 403
        if current_user != host and current_user != guest:
            raise PermissionDenied(
                'user is neither guest nor host of this reservation')

        # Check action valid: is defined 400
        try:
            transition = next(
                transition for transition in self.transitions if transition.action == action)
        except StopIteration:
            raise ParseError(
                f'Invalid action: {action} not match action of any transtions defined')

        # check action valid: current user_type can perform
        if current_user == guest:
            current_user_type = 'guest'
        else:
            current_user_type = 'host'
        if current_user_type != transition.user_type:
            raise PermissionDenied(
                f'Forbidden: current user type is {current_user_type}, user does not have correct user_role to perform the action: {action}')

        # Check action valid: current status matches the transition source, 400
        if reservation.status != transition.source:
            raise ParseError(
                f'Cannot perform action : {action} when current status : {reservation.status}.')

        # Update reservation status and save
        serializer.save(status=transition.target)

        # Create notification
        recipient = reservation.guest if transition.notification_recipient_user_type == 'guest' else reservation.property.host

        Ntf.objects.create(recipient=recipient, rev=reservation,
                           summary=transition.notification_msg)

        return Response({'success': f'Reservation status transits from {transition.source} to {transition.target}'}, status=status.HTTP_200_OK)


class RevList(ListAPIView):
    serializer_class = RevListSerializer
    permission_classes = [IsAuthenticated]

    def handle_exception(self, exc):
        if isinstance(exc, PermissionDenied):
            return Response({"detail": exc.detail}, status=403)
        if isinstance(exc, NotFound):
            return Response({"detail": exc.detail}, status=404)
        return super().handle_exception(exc)

    def get_queryset(self):
        user_id = int(self.kwargs.get('user_id'))

        user_type = self.request.query_params.get('user_type', None)
        status_filter = self.request.query_params.get('status', None)

        if user_id != self.request.user.id:
            raise PermissionDenied(
                'cannot review reservations of another user')

        queryset = Rev.objects.filter(
            Q(property__host__pk=user_id) | Q(guest__pk=user_id))

        if user_type and user_type not in ('host', 'guest'):
            raise NotFound(
                'Invalid url param, user_type can only be host or guest')

        if status_filter and status_filter not in ('pending', 'denied', 'approved', 'canceled', 'terminated', 'completed', 'pending(cancel request)', 'expired'):
            raise NotFound(
                'Invalid url param, user_type can only be host or guest')

        if user_type == 'host':
            queryset = queryset.filter(property__host=user_id)
        elif user_type == 'guest':
            queryset = queryset.filter(guest=user_id)
        else:
            queryset = queryset

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset


class RevDetail(ListAPIView):
    serializer_class = RevListSerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        user_id = int(self.kwargs.get('user_id'))
        rev_id = int(self.kwargs.get('pk'))
        if user_id != self.request.user.id:
            raise PermissionDenied(
                f'Forbidden: cannot review reservations of another user')
        try:
            rev = Ntf.objects.get(pk=rev_id)
        except Ntf.DoesNotExist:
            raise NotFound(
                f'Cannot find notification with notification_id: {rev_id} ')

        queryset = Rev.objects.filter(pk=rev_id)
        return queryset
