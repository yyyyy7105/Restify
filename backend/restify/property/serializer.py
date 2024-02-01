from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    DateField,
    IntegerField,
    DecimalField,
    SerializerMethodField,
    MultipleChoiceField,
    ListField,
    FileField,
    ImageField,
    ValidationError,
)
from django.db.models import Q
from .models import Property, Availability, Preview


class PreviewSerializer(ModelSerializer):
    class Meta:
        model = Preview
        fields = '__all__'
        read_only_fields = ['prop']


class AvailabilitySerializer(ModelSerializer):
    class Meta:
        model = Availability
        fields = '__all__'
        read_only_fields = ['prop']
        extra_kwargs = {
            'price': {'required': False},
        }

    def validate(self, data):
        if data.get('start_date') > data.get('end_date'):
            raise ValidationError(
                {'start_date': 'end_date must be greater than start_date'})

        kwd = self.context.get('view').kwargs
        if 'prop_pk' in kwd:
            prop = Property.objects.get(id=kwd['prop_pk'])
        elif 'pk' in kwd:
            prop = Availability.objects.get(id=kwd['pk']).prop

        # check if the start and end dates overlap some availability
        # in property
        availabilities = prop.availability
        if 'pk' in kwd:
            availabilities = availabilities.filter(~Q(id=kwd['pk']))
        # print(availabilities, kwd['pk'])
        overlaps = availabilities.filter(end_date__gte=data['start_date'],
                                         start_date__lte=data['end_date'])

        if overlaps:
            error_string = 'Overlap with following dates: '
            for qs in overlaps:
                error_string += f'({qs.start_date} - {qs.end_date}), '
            raise ValidationError({'end_dates': error_string})
        elif not data.get('price'):
            data['price'] = prop.price

        return data


class PropertySerializer(ModelSerializer):
    availability = SerializerMethodField(read_only=True)
    host_firstname = CharField(source='host.first_name', read_only=True)
    host_lastname = CharField(source='host.last_name', read_only=True)
    host_avatar = ImageField(source='host.avatar', read_only=True)
    preview = SerializerMethodField(read_only=True)
    previews = ListField(child=ImageField(), write_only=True,
                         allow_empty=True, required=False)

    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ['host', 'rating', 'rating_num']
        extra_kwargs = {
            'email': {'required': False},
            'phone_number': {'required': False},
        }

    def get_availability(self, obj):
        return AvailabilitySerializer(obj.availability, many=True).data

    def get_preview(self, obj):
        return PreviewSerializer(obj.preview_images, many=True).data

    def create(self, data):
        try:
            uploaded_data = data.pop('previews')
            new_prop = Property.objects.create(**data)
            for uploaded_item in uploaded_data:
                new_prop_preview = Preview.objects.create(
                    prop=new_prop, image=uploaded_item)
            return new_prop

        except KeyError:
            return Property.objects.create(**data)


class AddPreviewSerializer(ModelSerializer):
    preview = SerializerMethodField(read_only=True)
    previews = ListField(child=ImageField(), write_only=True,
                         allow_empty=True, required=True)

    class Meta:
        model = Property
        fields = ['id', 'preview', 'previews']
        read_only_fields = ['id', 'preview']

    def get_preview(self, obj):
        return PreviewSerializer(obj.preview_images, many=True).data

# testing only
class PropertyAvailabilitySerializer(ModelSerializer):
    class Meta:
        model = Availability
        fields = '__all__'
