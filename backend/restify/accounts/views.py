from .models import MyUser
from revs.models import Rev
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView
from .serializers import MyUserSerializer, RegisterSerializer, MyTokenObtainPairSerializer, UpdateProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
User = get_user_model()


class MyUserLogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        if self.request.data.get('all'):
            token: OutstandingToken
            for token in OutstandingToken.objects.filter(user=request.user):
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            return Response({"status": "OK, goodbye, all refresh tokens blacklisted"})
        refresh_token = self.request.data.get('refresh_token')
        token = RefreshToken(token=refresh_token)
        token.blacklist()
        return Response({"status": "OK, goodbye"})


class MyUserDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MyUserSerializer

    def get(self, request, *args, **kwargs):
        if self.request.user.id == self.kwargs["pk"]:
            return super().get(self, request, *args, **kwargs)
        user = self.get_object()
        reservations = user.revs.filter(property__host=self.request.user)
        if not reservations:
            if self.request.user.revs.filter(property__host=user):
                return super().get(request, *args, **kwargs)
            return Response("Forbidden: You have no right to view this profile", status=403)
        return super().get(request, *args, **kwargs)

    def get_object(self):
        return get_object_or_404(MyUser, id=self.kwargs['pk'])


class MyUserHomeView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MyUserSerializer

    def get_object(self):
        return get_object_or_404(MyUser, id=self.request.user.id)


class MyUserRegisterAPIView(CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class MyUserUpdateAPIView(RetrieveAPIView, UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UpdateProfileSerializer

    def get_object(self):
        return get_object_or_404(MyUser, id=self.request.user.id)


class MyUserLoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
