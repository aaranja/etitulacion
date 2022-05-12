from allauth.account.models import EmailConfirmation
from rest_framework import serializers
from django.utils import timezone


class EmailConfirmationSerializer(serializers.ModelSerializer):
    """
    Serializer to store email information that has been sent
    """

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
