from decimal import Decimal
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator, MinValueValidator
from comment.models import Comment
from django.contrib.contenttypes.fields import GenericRelation


# Create your models here.
class Property(models.Model):
    name = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    province = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    apt_number = models.CharField(max_length=20, blank=True, null=True)
    street_number = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=10)

    email = models.EmailField()
    phone_number = models.CharField(_("phone number"), validators=[
                                    RegexValidator(r'^\d{3}-\d{3}-\d{4}$')], max_length=20)

    price = models.DecimalField(
        _(u'Price'), decimal_places=2, max_digits=12,
        validators=[MinValueValidator(Decimal('0.01'))])
    rating = models.DecimalField(
        default=None, blank=True, null=True, max_digits=3, decimal_places=2)
    rating_num = models.PositiveIntegerField(
        default=0, null=False, validators=[MinValueValidator(0)])
    amenity = models.CharField(max_length=255, blank=True, default="")

    num_bedroom = models.PositiveIntegerField(
        blank=True, default=0, validators=[MinValueValidator(0)])
    num_bathroom = models.PositiveIntegerField(
        blank=True, default=0, validators=[MinValueValidator(0)])
    capacity = models.PositiveIntegerField(validators=[MinValueValidator(0)])

    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                             related_name='properties')
    comments = GenericRelation(Comment)

    def __str__(self):
        return f'Property {self.id}: {self.name} at {self.country} owned by {self.host}'


class Availability(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.DecimalField(
        _(u'Price'), decimal_places=2, max_digits=12,
        validators=[MinValueValidator(Decimal('0.01'))])
    prop = models.ForeignKey(Property, on_delete=models.CASCADE,
                             related_name='availability')

    def __str__(self):
        return f'{self.start_date} to {self.end_date} at Property{self.prop.id}'


class Preview(models.Model):
    image = models.ImageField(upload_to='property/')
    prop = models.ForeignKey(Property, on_delete=models.CASCADE,
                             related_name='preview_images')

    # def __init__(self):
    #     super().__init__()
    #     image = models.ImageField(upload_to=f'property/{self.prop.id}/')

    def __str__(self):
        return f'{self.image} of Property{self.prop.id}'
