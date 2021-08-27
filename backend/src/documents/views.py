from django.shortcuts import render
from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from .serializers import DocumentsSerializer
from .models import DocumentsDetails
from rest_framework.response import Response


# Create your views here.

# view for route '/process/2/documents/descriptions/'
class DocumentsView(views.APIView):
	#permission_classes = (IsAuthenticated,)
	def get(self, request, *args, **kwargs):
		# get all documents details
		obj_list = []
		for i, item in enumerate(DocumentsDetails.objects.all()):
			obj_list.append(item)

		results = DocumentsSerializer(obj_list, many=True).data
		return Response(results)