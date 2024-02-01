from revs.models import Ntf, Rev
from property.models import Property
from django.utils import timezone
from django.db.models import Q
from datetime import datetime, timedelta


def setRevComplete():
    revs = Rev.objects.filter(status='approved').filter(
        end_date__gt=timezone.now())
    if revs.exists():
        revs.update(status='completed')


def setRevExpired(**kwrags):
    window = kwrags.get('window')
    # now - l = 3, l = now-3,
    revs = Rev.objects.filter(Q(status='pending') | Q(status='pending(cancel request)')).filter(
        last_statusUpdate_date__lt=datetime.now() - timedelta(window))
    if revs.exists():
        revs.update(status='expired')
