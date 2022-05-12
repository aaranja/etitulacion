from dj_rest_auth.serializers import PasswordResetSerializer
from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from rest_framework import serializers

from ..models import Account


class CustomPasswordResetSerializer(PasswordResetSerializer):

    def validate_email(self, value):
        self.reset_form = PasswordResetForm(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError('Error')

        ###### FILTER YOUR USER MODEL ######
        if not Account.objects.filter(email=value).exists():
            raise serializers.ValidationError('Invalid e-mail address')
        return value

    def get_email_options(self):
        print("entra quí")
        extra_context = {'site_name': "etitulacion"}  # your extra context parameters
        return {
            'domain_override': settings.FRONTEND_URL,
            # 'email_template_name': 'registration/custom_reset_email.txt',
            'html_email_template_name': 'registration/password_reset_email.html',
            'extra_email_context': extra_context
        }
