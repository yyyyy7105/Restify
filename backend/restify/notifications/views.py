from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, DestroyAPIView, \
    CreateAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination
from notifications.serializer import NtfListSerializer
from revs.models import Ntf, Rev
from revs.serializer import RevListSerializer, RevSerializer, RevUpdateSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, NotAuthenticated, NotFound, ParseError


class NtfList(ListAPIView):
    serializer_class = NtfListSerializer
    permission_classes = [IsAuthenticated]

    def handle_exception(self, exc):
        if isinstance(exc, PermissionDenied):
            return Response({"detail": exc.detail}, status=403)
        if isinstance(exc, NotFound):
            return Response({"detail": exc.detail}, status=404)
        return super().handle_exception(exc)

    def get_queryset(self):
        user_id = int(self.kwargs.get('user_id'))
        # if_read = self.request.query_params.get('if_read', None)
        showNotReadOnly = self.request.query_params.get(
            'showNotReadOnly', None)
        if user_id != self.request.user.id:
            raise PermissionDenied(
                'Forbidden: cannot review reservations of another user')
            return Response({'error': 'Forbidden: cannot review reservations of another user'}, status=status.HTTP_403_FORBIDDEN)

        queryset = Ntf.objects.filter(recipient__id=user_id)
        if showNotReadOnly == 'true':
            queryset = queryset.filter(if_read=False)
        return queryset


class NtfDetail(ListAPIView):
    serializer_class = NtfListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = int(self.kwargs.get('user_id'))
        notification_id = int(self.kwargs.get('pk'))
        if user_id != self.request.user.id:
            raise PermissionDenied(
                f'Forbidden: cannot review reservations of another user')
        try:
            notification = Ntf.objects.get(pk=notification_id)
        except Ntf.DoesNotExist:
            raise NotFound(
                f'Cannot find notification with notification_id: {notification_id} ')

        queryset = Ntf.objects.filter(pk=notification_id)
        notification = queryset.first()
        notification.if_read = True
        notification.save()
        return queryset
