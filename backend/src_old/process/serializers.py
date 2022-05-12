from rest_framework import serializers
from .models import TitulationTypes, InstituteData


class TitulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TitulationTypes
        fields = [
            'id',
            'name',
            'academic_year',
        ]

        extra_kwargs = {
            'id': {'read_only': True}
        }


class InstituteSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstituteData
        fields = [
            'institute',
            'code',
            'city',
            'services_lead',
            'director',
        ]
        extra_kwargs = {
            'id': {'read_only': True}
        }
