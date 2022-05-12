from allauth.account.models import EmailAddress
from django.contrib.auth import authenticate
from rest_framework import serializers, status
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import APIException, _get_error_details


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


class CustomValidation(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _('Invalid input.')
    default_code = 'invalid'

    def __init__(self, detail=None, code=None, status_code=None):
        if detail is None:
            detail = self.default_detail
        if code is None:
            code = self.default_code
        if status_code is not None:
            self.status_code = status_code

        # For validation failures, we may collect many errors together,
        # so the details should always be coerced to a list if not already.
        if isinstance(detail, tuple):
            detail = list(detail)
        elif not isinstance(detail, dict) and not isinstance(detail, list):
            detail = [detail]

        self.detail = _get_error_details(detail, code)
