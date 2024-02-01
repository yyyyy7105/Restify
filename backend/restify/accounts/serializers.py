from rest_framework import serializers
from .models import MyUser
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'email', 'first_name', 'last_name',
                  'phone_number', 'self_intro', 'avatar', 'rating', 'rating_num']


class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = MyUser
        fields = ('id', 'email', 'phone_number', 'password1', 'password2',
                  'first_name', 'last_name', 'avatar', 'self_intro')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone_number': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password1": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        self_intro = validated_data.get('self_intro')
        avatar = validated_data.get('avatar')
        if self_intro:
            user = MyUser.objects.create(
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                phone_number=validated_data['phone_number'],
                self_intro=self_intro,
                avatar=avatar,
            )
        else:
            user = MyUser.objects.create(
                email=validated_data['email'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                phone_number=validated_data['phone_number'],
                avatar=avatar,
            )
        user.set_password(validated_data['password1'])
        user.save()
        return user


class UpdateProfileSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(
        write_only=True, required=False, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = MyUser
        fields = ('email', 'phone_number', 'password1', 'password2',
                  'first_name', 'last_name', 'avatar', 'self_intro')
        extra_kwargs = {
            'email': {'required': False},
        }

    def validate(self, attrs):
        if attrs.get('password1') != attrs.get('password2'):
            raise serializers.ValidationError(
                {"password1": "Password fields didn't match."})
        return attrs

    def update(self, instance, validated_data):
        if validated_data.get('password1'):
            instance.set_password(validated_data['password1'])
            instance.save()
        return super().update(instance, validated_data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra responses here
        data['userid'] = self.user.id
        return data
