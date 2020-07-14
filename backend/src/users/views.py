from django.shortcuts import render

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response


# Create your views here.
class CustomObtainAuthToken(ObtainAuthToken):
	def post(self, request, *args, **kwargs):
		response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
		token = Token.objects.get(key=repsonse.data['token'])
		return Response({'token':token.key, 'id':token.user_id})
