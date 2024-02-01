from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


app_name = "accounts"
urlpatterns = [
    path('<int:pk>/profile/', views.MyUserDetailView.as_view(), name='profile'),
    path('home/', views.MyUserHomeView.as_view(), name='home'),
    path('register/', views.MyUserRegisterAPIView.as_view(), name='register'),
    path('profile/update/', views.MyUserUpdateAPIView.as_view(),
         name='update_profile'),
    path('login/', views.MyUserLoginView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.MyUserLogoutView.as_view(), name='token_logout'),
]
