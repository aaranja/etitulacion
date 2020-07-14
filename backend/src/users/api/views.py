from users.models import Account
from .serializers import AccountSerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class AccountViewSet(viewsets.ModelViewSet):
	permission_classes = (IsAuthenticated,)  
	serializer_class = AccountSerializer
	queryset = Account.objects.all()

	# return all data for authenticated user
	# superuser true get all data
	# superuser false get own data
	def get_queryset(self):
		print("sesión iniciada por: ",self.request.user)
		user = self.request.user
		if user.is_superuser:
			return Account.objects.all()
		return Account.objects.filter(id=user.id)

	def get_object(self):
		obj = get_object_or_404(Account.objects.filter(id=self.kwargs["pk"]))
		self.check_object_permissions(self.request, obj)
		return obj