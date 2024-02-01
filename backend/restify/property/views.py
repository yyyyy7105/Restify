from django.shortcuts import render, get_object_or_404
from django.http import Http404
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView, 
    CreateAPIView, 
    RetrieveAPIView,
    UpdateAPIView,
    DestroyAPIView,
    GenericAPIView,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.conf import settings
from django.db.models import Q
from .models import Property, Availability
from .serializer import *
from .pagination import IndexPagination

# Create your views here.
class CreatePropertyView(CreateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)
        super().perform_create(serializer)
        save_fields = {}
        if not serializer.validated_data.get('email'):
            save_fields['email'] = self.request.user.email
        if not serializer.validated_data.get('phone_number'):
            save_fields['phone_number'] = self.request.user.phone_number
        
        serializer.save(**save_fields)


class UpdatePropertyView(UpdateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Property.objects.filter(id=self.kwargs['pk'])
        return queryset

    def put(self, request, *args, **kwargs):
        try:
            if Property.objects.get(id=kwargs['pk']).host != self.request.user:
                return Response('403 FORBIDDEN: You cannot edit another user\'s property!', status=403)
        except Property.DoesNotExist:
            return Response('404 NOT FOUND: Property does not exist!', status=404)

        return super().put(request, *args, **kwargs)

    def perform_update(self, serializer):
        super().perform_update(serializer)
        
        uploaded_data = serializer.context.get('view').request.FILES.getlist("previews")
        prop = Property.objects.get(id=self.kwargs['pk'])
        for uploaded_item in uploaded_data:
            new_prop_preview = Preview.objects.create(prop=prop, image=uploaded_item)

        save_fields = {}
        if not serializer.validated_data.get('email'):
            save_fields['email'] = self.request.user.email
        if not serializer.validated_data.get('phone_number'):
            save_fields['phone_number'] = self.request.user.phone_number
        
        serializer.save(**save_fields)


class DeletePropertyView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Property.objects.filter(id=self.kwargs['pk'])
        return queryset

    def delete(self, request, *args, **kwargs):
        try:
            if Property.objects.get(id=kwargs['pk']).host != self.request.user:
                return Response('403 FORBIDDEN: You cannot delete another user\'s property!', status=403)
        except Property.DoesNotExist:
            return Response('404 NOT FOUND', status=404)

        return super().delete(request, *args, **kwargs)


class DeletePreviewView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Preview.objects.filter(id=self.kwargs['pk'])
        return queryset

    def delete(self, request, *args, **kwargs):
        try:
            if Preview.objects.get(id=kwargs['pk']).prop.host != self.request.user:
                return Response('403 FORBIDDEN', status=403)
        except Preview.DoesNotExist:
            return Response('404 NOT FOUND: Property does not exist!', status=404)

        return super().delete(request, *args, **kwargs)


class CreateAvailabilityView(CreateAPIView):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            if Property.objects.get(id=kwargs['prop_pk']).host != self.request.user:
                return Response('403 FORBIDDEN: You cannot create availability under another user\'s property!', status=403)
        except Property.DoesNotExist:
            return Response('404 NOT FOUND: Property does not exist!', status=404)
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        property_ = Property.objects.get(id=self.kwargs['prop_pk'])
        serializer.save(prop=property_)
        super().perform_create(serializer)


class UpdateAvailabilityView(UpdateAPIView):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        try:                    
            if Availability.objects.get(id=kwargs['pk']).prop.host != self.request.user:
                return Response('403 FORBIDDEN: You cannot edit another user\'s availability!', status=403)
        except Availability.DoesNotExist:
            return Response('404 NOT FOUND: Availability does not exist!', status=404)

        return super().put(request, *args, **kwargs)


class DeleteAvailabilityView(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Availability.objects.filter(id=self.kwargs['pk'])
        return queryset

    def delete(self, request, *args, **kwargs):
        try:                    
            if Availability.objects.get(id=kwargs['pk']).prop.host != self.request.user:
                return Response('403 FORBIDDEN: You cannot delete another user\'s availability!', status=403)
        except Availability.DoesNotExist:
            return Response('404 NOT FOUND: Availability does not exist!', status=404)
        
        return super().delete(request, *args, **kwargs)


class PropertyIndexView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropertySerializer
    pagination_class = IndexPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['country', 'province', 'city']
    ordering_fields = ['rating', 'rating_num']

    def get_queryset(self):
        qs = Property.objects.all()

        if 'num_guest' in self.request.GET:
            qs = qs.filter(capacity__gte=self.request.GET['num_guest'])

        available_date = Availability.objects.all()
        nothing_entered = True
        if 'start_date' in self.request.GET:
            nothing_entered = False
            available_date = available_date.filter(start_date__lte=self.request.GET['start_date'], end_date__gte=self.request.GET['start_date'])
        if 'end_date' in self.request.GET:
            nothing_entered = False
            available_date = available_date.filter(end_date__gte=self.request.GET['end_date'], start_date__lte=self.request.GET['end_date'])
        if not nothing_entered:
            available_prop = available_date.values_list('prop', flat=True)
            qs = qs.filter(id__in=list(available_prop))

        if 'max_price' in self.request.GET:
            qs = qs.filter(price__lte=self.request.GET['max_price'])

        if 'amenity' in self.request.GET:
            amenity_lst = self.request.GET['amenity'].split(',')
            for i in amenity_lst:
                qs = qs.filter(amenity__icontains=i.strip())

        return qs


class MyPropertyIndexView(PropertyIndexView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().filter(host=self.kwargs['pk'])
    

class PropertyDetailView(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = PropertySerializer

    def get_object(self):
        return get_object_or_404(Property, id=self.kwargs['pk'])


class AddPreviewView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddPreviewSerializer

    def get_queryset(self):
        queryset = Property.objects.filter(id=self.kwargs['pk'])
        return queryset
    
    def put(self, request, *args, **kwargs):
        try:
            if Property.objects.get(id=kwargs['pk']).host != self.request.user:
                return Response('403 FORBIDDEN: You cannot add previews another user\'s property!', status=403)
        except Property.DoesNotExist:
            return Response('404 NOT FOUND: Property does not exist!', status=404)

        return super().put(request, *args, **kwargs)
    
    def perform_update(self, serializer):
        super().perform_update(serializer)
        
        uploaded_data = serializer.context.get('view').request.FILES.getlist("previews")
        prop = Property.objects.get(id=self.kwargs['pk'])
        for uploaded_item in uploaded_data:
            new_prop_preview = Preview.objects.create(prop=prop, image=uploaded_item)


# testing only
class PropertyAvailabilityView(ListAPIView):
    serializer_class = PropertyAvailabilitySerializer

    def get(self, request, *args, **kwargs):
        p = Property.objects.filter(id=self.kwargs['pk'])
        if p:
            return super().get(request, *args, **kwargs)
        return Response('404 NOT FOUND', status=404)  
        
    def get_queryset(self):
        p = Property.objects.get(id=self.kwargs['pk'])
        return Availability.objects.all().filter(prop=p)
    
