from rest_framework import serializers
from ..models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined']
        extra_kwargs = {
            'id': {'read_only': True},
            'date_joined': {'read_only': True},
        }

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.first_name)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance
