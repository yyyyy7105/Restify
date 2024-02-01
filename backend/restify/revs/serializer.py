from django.utils import timezone
from rest_framework.serializers import ModelSerializer, CharField, IntegerField, ValidationError
from revs.models import Ntf, Rev
from django.db.models import Q


class RevSerializer(ModelSerializer):
    # property_id = IntegerField(read_only=True, source='property.id')
    host = CharField(read_only=True, source='property.host')
    price = IntegerField(read_only=True, source='property.price')

    class Meta:

        # 'guest','property','status','price','start_date','end_date'
        model = Rev
        fields = ['pk','host', 'guest', 'property', 'price', 'start_date',
                  'end_date', 'status', 'last_statusUpdate_date']
        read_only_fields = ['host', 'guest', 'property',
                            'status', 'last_statusUpdate_date', 'price']

        extra_kwargs = {
            'start_date': {'required': True},
            'end_date': {'required': True}
        }

    
    def create(self, validated_data):
        guest = self.context.get('guest')
        property = self.context.get('property')
        rev = Rev.objects.create(guest=guest, property=property,
                                 last_statusUpdate_date=timezone.now(), **validated_data)
        Ntf.objects.create(recipient=rev.property.host, rev=rev,
                           summary="New Pending Reservation Request")
        return rev


class RevUpdateSerializer(ModelSerializer):
    class Meta:
        model = Rev
        fields = ['status', 'last_statusUpdate_date']
        read_only_fields = ['status', 'last_statusUpdate_date']


class RevListSerializer(ModelSerializer):
    property_id = IntegerField(read_only=True, source='property.id')
    host_email = CharField(read_only=True, source='property.host.email')
    guest_email = CharField(read_only=True, source='guest.email')
    price = IntegerField(read_only=True, source='property.price')
    host_id = CharField(read_only=True, source='property.host.id')

    class Meta:
        model = Rev
        fields = ['pk','property_id', 'host_email', 'guest_email', 'status',
                  'price', 'start_date', 'end_date', 'last_statusUpdate_date', 'host_id']
