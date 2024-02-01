from django.urls import path
from . import views

app_name="property"
urlpatterns = [ 
    path('add/', views.CreatePropertyView.as_view(), name="add_property"),
    path('<int:pk>/update/', views.UpdatePropertyView.as_view(), name="update_property"),
    path('<int:pk>/delete/', views.DeletePropertyView.as_view(), name="delete_property"),
    path('preview/<int:pk>/delete/', views.DeletePreviewView.as_view(), name="delete_preview"),
    path('<int:pk>/preview/add/', views.AddPreviewView.as_view(), name="update_preview"),
    path('index/', views.PropertyIndexView.as_view(), name="index"),
    path('user/<int:pk>/', views.MyPropertyIndexView.as_view(), name="my_property"),
    path('<int:prop_pk>/availability/add/', views.CreateAvailabilityView.as_view(), name="add_availability"),
    path('availability/<int:pk>/update/', views.UpdateAvailabilityView.as_view(), name="update_availability"),
    path('availability/<int:pk>/delete/', views.DeleteAvailabilityView.as_view(), name="delete_availability"),
    path('<int:pk>/detail/', views.PropertyDetailView.as_view(), name="property_detail"),
    # below is only for testing purpose
    path('<int:pk>/availability/', views.PropertyAvailabilityView.as_view(), name="availability_detail"),
]
