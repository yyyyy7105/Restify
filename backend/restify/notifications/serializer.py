from rest_framework.serializers import ModelSerializer, CharField, IntegerField, ValidationError

from revs.models import Ntf


class NtfListSerializer(ModelSerializer):
    rev_id = IntegerField(read_only=True, source='rev.id')
    recipient_email = CharField(read_only=True, source='recipient.email')
    guest_email = CharField(read_only=True, source='rev.guest.email')
    host_email = CharField(read_only=True, source='rev.property.host.email')

    class Meta:
        model = Ntf
        fields = ['pk', 'rev_id', 'recipient_email', 'summary',
                  'if_read', 'create_date', 'guest_email', 'host_email']



