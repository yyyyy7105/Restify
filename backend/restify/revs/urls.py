from django.urls import path
from . import views

app_name="revs"
urlpatterns = [ 
    path('create/<property_id>/', views.RevCreate.as_view(), name='create'),
    path('action/<pk>/<action>/', views.RevUpdate.as_view(), name='action'),
    path('list/<user_id>/', views.RevList.as_view(),name='list'),
    path('detail/<user_id>/<pk>/', views.RevDetail.as_view(), name='details'),
]

