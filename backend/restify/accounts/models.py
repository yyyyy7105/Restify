from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from .managers import MyUserManager
from django.contrib.contenttypes.fields import GenericRelation
from django.core.validators import RegexValidator
from comment.models import Comment


class MyUser(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    phone_number = models.CharField(_("phone number"), unique=True, null=True, validators=[
                                    RegexValidator(r'^\d{3}-\d{3}-\d{4}$')], max_length=20)
    avatar = models.ImageField(
        upload_to="statics/avatar/", null=True, blank=True)
    self_intro = models.CharField(
        blank=True, null=True, max_length=150, default="This guy doesn't write anything")
    rating = models.DecimalField(
        default=None, blank=True, null=True, max_digits=3, decimal_places=2)
    rating_num = models.PositiveIntegerField(default=0, null=False)
    comments = GenericRelation(Comment)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = MyUserManager()

    def __str__(self):
        return self.email
