from abc import ABC

from allauth.account.adapter import get_adapter
from allauth.utils import email_address_exists
from rest_framework import serializers
from allauth.account import app_settings as allauth_settings
from django.contrib.auth import authenticate
from django.utils.translation import ugettext_lazy as _
from rest_framework.authtoken.models import Token

from ..models import Account, GraduateProfile


class AuthTokenSerializer(serializers.Serializer):
    """
    Serializer to get the user token after authenticate
    * Requires email and password
    * Return user attributes
    """

    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass

    email = serializers.EmailField(
        label=_("Email"),
        write_only=True
    )
    password = serializers.CharField(
        label=_("Password"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )
    token = serializers.CharField(
        label=_("Token"),
        read_only=True
    )

    def authenticate(self, **kwargs):
        return authenticate(self.context['request'], **kwargs)

    def _validate_email(self, email, password):
        user = None
        if email and password:
            user = self.authenticate(email=email, password=password)
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg)
        return user

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = self._validate_email(email, password)
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ['key', 'user']


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type', ]
        extra_kwargs = {
            'email': {'read_only': True},
            'user_type': {'read_only': True}
        }

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance


class RegisterSerializer(serializers.Serializer):
    """
    Serializer to create a new Graduate Account
    """
    # account data
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)
    # profile data
    enrollment = serializers.CharField(required=True, write_only=True)
    cellphone = serializers.CharField(required=True, write_only=True)
    career = serializers.CharField(required=True, write_only=True)
    gender = serializers.CharField(required=True)

    def save(self, request):
        # create and save account
        print(request.data)
        new_account = Account(
            email=request.data['email'],
            first_name=request.data['first_name'],
            last_name=request.data['last_name'],
            user_type="USER_GRADUATE",
        )
        new_account.set_password(request.data['password1'])
        new_account.save()

        # create a new profile
        new_profile = GraduateProfile(
            enrollment=request.data['enrollment'],
            cellphone=request.data['cellphone'],
            career=request.data['career'],
            gender=request.data['gender'],
            status="STATUS_00",
        )

        # make a default documents properties
        documents = []

        # save documents and account on new profile
        new_profile.documents = documents
        new_profile.account = new_account
        new_profile.save()
        print(new_account)
        return new_account

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def validate_enrollment(self, enrollment):
        # check if enrollment is unique

        if GraduateProfile.objects.filter(enrollment=enrollment).exists():
            raise serializers.ValidationError(
                _("The enrollment has already been registered before."))

        return enrollment

    def validate_career(self, career):
        # check if career is valid
        return career

    def validate_cellphone(self, cellphone):
        # check if gender is valid
        return cellphone

    def validate_gender(self, gender):
        # check if gender is valid
        return gender

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                _("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'user_type': self.validated_data.get('user_type', ''),
            'enrollment': self.validated_data.get('enrollment', ''),
            'cellphone': self.validated_data.get('cellphone', ''),
            'career': self.validated_data.get('career', ''),
            'gender': self.validated_data.get('gender', ''),
        }


class StaffRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer to register a new Staff Account
    """
    # account data
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    user_type = serializers.CharField(required=True, write_only=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = Account
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type', 'password1', 'password2']

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                _("The two password fields didn't match."))
        return data

    def save(self, request):
        # create and save account
        new_account = Account(
            email=request['email'],
            first_name=request['first_name'],
            last_name=request['last_name'],
            user_type=request['user_type'],
        )
        new_account.is_staff = True
        new_account.set_password(request['password1'])
        new_account.save()
        return new_account
