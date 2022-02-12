from  rest_framework import serializers
from .models import TitulationTypes
class TitulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TitulationTypes
        fields = [
            'id',
            'name',
            'academic_year',
        ]

        extra_kwargs = {
            'id': {'read_only':True }
        }