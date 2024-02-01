from django.db import models
from django.conf import settings
from property.models import Property

# Create your models here.


# class Property (models.Model):
#     host = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="props",
#                              on_delete=models.CASCADE)
#     price = models.IntegerField()
#     rating = models.DecimalField(
#         default=None, blank=True, null=True, max_digits=3, decimal_places=2)
#     rating_num = models.PositiveIntegerField(default=0, null=False)


class Rev(models.Model):
    #    host = models.ForeignKey(User, related_name="revs", on_delete=models.CASCADE)
    guest = models.ForeignKey(settings.AUTH_USER_MODEL,
                              related_name="revs", on_delete=models.CASCADE)
    property = models.ForeignKey(
        Property, related_name="revs", on_delete=models.CASCADE)
    status = models.CharField(max_length=40, default='pending')
    # price = models.PositiveIntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    last_statusUpdate_date = models.DateTimeField()
    host_commented = models.BooleanField(
        default=False, blank=False, null=False)
    guest_commented = models.BooleanField(
        default=False, blank=False, null=False)

    def __str__(self):
        return f"Rev: id:{self.pk}, host: {self.property.host.email}, guest: {self.guest.email}, property: {self.property.pk}"


class Ntf(models.Model):
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="ntfs", on_delete=models.CASCADE)
    rev = models.ForeignKey(Rev, related_name="ntfs",
                            on_delete=models.SET_NULL, null=True)
    summary = models.CharField(max_length=200)
    if_read = models.BooleanField(default=False)
    create_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ntf: id:{self.pk}, recipient:{self.recipient}, rev_id:{self.rev.pk}, summary:{self.summary}, if_read:{self.if_read}"
