from django.contrib import admin
from .models import Property, Availability, Preview

# Register your models here.
admin.site.register(Property)
admin.site.register(Availability)
admin.site.register(Preview)