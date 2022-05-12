from allauth.account.models import EmailAddress
from rest_framework import serializers


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
