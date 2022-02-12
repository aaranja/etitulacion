from rest_framework import serializers
from .models import DocumentsDetails
class DocumentsSerializer(serializers.ModelSerializer):
	class Meta:
		model = DocumentsDetails
		fields = [
			'key',
			'keyName',
			'fullName',
			'description',
			'required',
			'clasification',
		]
		extra_kwargs = {
		'key': { 'read_only': True }
		}