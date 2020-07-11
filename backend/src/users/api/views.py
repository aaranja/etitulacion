from users.models import Account
from .serializers import AccountSerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()