
from allauth.account.adapter import get_adapter
from allauth.utils import email_address_exists
from django.utils import timezone
from rest_framework import serializers, status
from allauth.account import app_settings as allauth_settings
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token
from allauth.account.models import EmailAddress, EmailConfirmation

from ..models import Account, GraduateProfile
from .CustomValidation import CustomValidation


class EmailConfirmationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailConfirmation
        fields = ['id', 'created', 'sent', 'key', 'email_address']

    @staticmethod
    def validate_email_address(email):
        print("email: ", email.id)
        return email.id

    def create(self, validate_data):
        now = timezone.now()
        time = now.strftime("%Y-%m-%d %H:%M:%S")
        email_confirmation = EmailConfirmation(
            created=time,
            sent=validate_data["sent"],
            key=validate_data["key"],
            email_address_id=validate_data['email_address']
        )
        email_confirmation.save()
        return email_confirmation


class EmailAddressSerializer(serializers.ModelSerializer):
    """
    Serializer to get and set emails is verified
    """

    class Meta:
        model = EmailAddress
        fields = ['id', 'email', 'verified', 'primary', 'user']

    @staticmethod
    def validate_user(user):
        print("número de usuario: ", user.id)
        return user.id

    def create(self, validated_data):
        email_address = EmailAddress(
            email=validated_data['email'],
            verified=validated_data['verified'],
            user_id=validated_data['user']
        )
        email_address.save()
        return email_address

    def update(self, instance, validated_data):
        # instance.email = validated_data.get('email', instance.email)
        instance.verified = validated_data.get('verified', instance.verified)
        # instance.user_id = validated_data.get('user', instance.user_id)
        instance.save()
        return instance


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

    @staticmethod
    def is_verified(user_id):
        email = EmailAddress.objects.get(user_id=user_id)
        if email:
            return email.verified == 1
        else:
            msg = _("We can't locate your account.")
            raise serializers.ValidationError(msg)

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
            elif user.user_type == "USER_GRADUATE":
                if not self.is_verified(user.id):
                    msg = _('Your account is not verified, please click the next link to verify it.')
                    detail = {'non_field_errors': [msg]}
                    res = CustomValidation(detail, code='permission_denied', status_code=status.HTTP_403_FORBIDDEN)
                    print(res)
                    raise res
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
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)
    # profile data
    enrollment = serializers.CharField(required=True, write_only=True)
    cellphone = serializers.CharField(required=True, write_only=True)

    def save(self, request):
        # create and save account
        new_account = Account(
            email=request.data['email'],
            user_type="USER_GRADUATE",
        )
        new_account.set_password(request.data['password1'])
        new_account.save()

        # create a new profile
        new_profile = GraduateProfile(
            enrollment=request.data['enrollment'],
            cellphone=request.data['cellphone'],
            status="STATUS_00",
        )

        # make a default documents properties
        documents = []

        # save documents and account on new profile
        new_profile.documents = documents
        new_profile.account = new_account
        new_profile.save()
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

    def validate_cellphone(self, cellphone):
        # check if gender is valid
        return cellphone

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                _("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        return {
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'user_type': self.validated_data.get('user_type', ''),
            'enrollment': self.validated_data.get('enrollment', ''),
            'cellphone': self.validated_data.get('cellphone', ''),
        }


class StaffRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer to register a new Staff Account
    """
    # account data
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    user_type = serializers.CharField(required=True, write_only=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = Account
        fields = ['id', 'email', 'user_type', 'password1', 'password2']

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
            user_type=request['user_type'],
        )
        new_account.is_staff = True
        new_account.set_password(request['password1'])
        new_account.save()
        return new_account
