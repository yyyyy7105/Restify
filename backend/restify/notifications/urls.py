from django.urls import path
from . import views

app_name="notifications"
urlpatterns = [ 
    path('<user_id>/list/', views.NtfList.as_view(), name='list'),
    path('<user_id>/<pk>/details/', views.NtfDetail.as_view(),name='list'),
]
