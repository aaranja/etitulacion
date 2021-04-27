from users.models import Account, GraduateProfile
from .serializers import AccountSerializer, ProfileSerializer
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

class UploadDocumentsView(generics.UpdateAPIView):
    serializer_class = DocumentsSerializer
    def patch(self, request, *args, **kwargs):
        print("entrando a la actualizacion")

    @classmethod
    def get_extra_actions(cls):
        return []

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
        print("entra aqui")
        obj = get_object_or_404(Account.objects.filter(id=self.kwargs["pk"]))
        self.check_object_permissions(self.request, obj)
        return obj

class GraduateProfileViewSet(viewsets.ModelViewSet):
    #permission_classes = (IsAuthenticated,)
    serializer_class = ProfileSerializer
    queryset = GraduateProfile.objects.all()

    def get_queryset(self):
        print("perfil requerido por: ",self.request.user.id)
        user = self.request.user
        if user.is_superuser:
            return GraduateProfile.objects.all()
        ### CHANGE TO account__id = user.id ===========================================
        profile = GraduateProfile.objects.filter(account_id=user.id)#self.kwargs["pk"])#user.id)
        return profile

    # don't needed, only for reference
    def update(self, request, *args, **kwargs):
        print("entrando a update")
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        #print(serializer)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        return Response(serializer.data)