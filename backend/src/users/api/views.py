from users.models import Account, GraduateProfile
from .serializers import AccountSerializer, ProfileSerializer,DocumentsSerializer, StatusSerializer, StaffRegisterSerializer
from django.shortcuts import get_object_or_404
from django.core import serializers
from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.request import Request
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from .documents import Files
import json, time
import asyncio
from types import SimpleNamespace
from asgiref.sync import sync_to_async
# view for router '/staff/graduate-list/'
class GraduateListView(views.APIView):
    permissions_classes = (IsAuthenticated,)

    def get(self, request, * args, **kwargs):
        user = self.request.user
        # only staff can get all graduate data
        if(user.is_staff is True):
            # get graduate profile data
            profiles_queryset = GraduateProfile.objects.all()
            listProfile = list(profiles_queryset.values('enrollment','career','status','accurate_docs','account_id'))
            listGraduate = []
            for graduate in listProfile:
                # get graduate account data
                account_queryset = Account.objects.filter(id = graduate['account_id'], user_type="USER_GRADUATE")
                account = list(account_queryset.values('first_name', 'last_name'))[0]
                # merge profile and account data
                account.update(graduate)
                # add to global list graduate
                listGraduate.append(account)
            return Response(listGraduate, status = status.HTTP_200_OK, content_type='application/json')
        return Response(None,status = status.HTTP_405_METHOD_NOT_ALLOWED)

# view fro router '/admin/register/staff/'
class StaffRegisterView(views.APIView):
    permission_classes = (IsAuthenticated,)
    serializer = StaffRegisterSerializer

    def post(self, request, *args, **kwargs):
        user = self.request.user
        if(user.is_superuser):
            print("is admin")
            serializer = self.serializer(user, request.data , partial=True)
            if serializer.is_valid():
                print("cuenta creada")
                serializer.save(request)

        return Response({'data': 'userdata'}, status = status.HTTP_201_CREATED )

# view for route '/graduate/profile/status/'
class StatusView(views.APIView):
    permission_classes = (IsAuthenticated,)
    serializer = StatusSerializer

    def get(self, request, *args, **kwargs):
        user = self.request.user
        profile = GraduateProfile.objects.get(account_id = user)
        return Response({'status': profile.status})

    def put(self, request, *args, **kwargs):
       
        user = self.request.user
        profile = GraduateProfile.objects.get(account_id=user)
        data = request.data
        
        serializer = self.serializer(profile, {'status':data['status']} , partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": data['status']}, status = status.HTTP_202_ACCEPTED)
        return Response({'data': "dta"}, status = status.HTTP_202_ACCEPTED)

# view for route '/process/1/<pk>/', fist step of process
class VerifyInformationView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        profile = GraduateProfile.objects.filter(account_id = user)
        return profile

    def get(self, request, *args, **kwargs):
        results = ProfileSerializer().data
        return Response(results)

    def put(self, request, *args, **kwargs):
        user = self.request.user
        graduated = GraduateProfile.objects.get(account_id = user)
        data = request.data
        # set new status
        data.update({'status':'STATUS_01'}) 
        print(data)
        serializer = ProfileSerializer(graduated, data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_202_ACCEPTED)

# view for route 'process/2/upload/<pk>/', able to update documents json

class UploadFileView(views.APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser,)
    serializer = DocumentsSerializer

    def saveNewDocument(self, metadata, status):
        fileStatus = "uploaded"
        if(status =="removed"):
            fileStatus = "removed"
        file = dict()
        file['key']        = metadata.key
        file['keyNum']     = int(metadata.key)
        file['keyName']    = metadata.keyName
        file['fileName']   = metadata.fileName
        file['status']     = fileStatus
        file['url']        = metadata.url
        return file

    def put(self, request, format=None):
        
        update_type = request.data['update_type']
        data = request.data['data']
        user = self.request.user
        file = None

        status_response = "removed"
        if(update_type == "upload"):
            file = request.FILES['file']
            status_response = "success"

        profile = GraduateProfile.objects.get(account_id = user)
        fileData = json.loads(
            data, 
            object_hook=lambda d: SimpleNamespace(**d))

        serializer = self.serializer(
            profile, 
            {'documents':[self.saveNewDocument(fileData, update_type)], 
            'update_type': update_type} , 
            partial=True
            )

        if serializer.is_valid():
            
            serializer.save()

            # save file
            if(file is not None):
                Files.save(self,file, fileData.keyName, profile.enrollment)
            # remove file
            else: 
                
                Files.remove(self, fileData.keyName, profile.enrollment)

            # if the user remove an document, the status changes to documentation incomplete
            if(status_response == "removed"):
                status_serializer = StatusSerializer(profile, {'status':"STATUS_01"},  partial=True)
                if( status_serializer.is_valid()):
                    status_serializer.save()
            return Response({'status': status_response, 'key': fileData.key}, status=status.HTTP_202_ACCEPTED)
        return Response({'status': "error", 'key': fileData.key}, status=status.HTTP_202_ACCEPTED)

class AccountViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)  
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    # return all own data for authenticated user
    # superuser true get all data
    # superuser false get own data
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Account.objects.all()
        return Account.objects.filter(id=user.id)

    def get_object(self):
        obj = get_object_or_404(Account.objects.filter(id=self.kwargs["pk"]))
        #obj = get_object_or_404(Account.objects.filter(id=16760256))
        self.check_object_permissions(self.request, obj)
        return obj

class GraduateProfileViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = ProfileSerializer
    queryset = GraduateProfile.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return GraduateProfile.objects.all()
        ### CHANGE TO account_id = user.id ===========================================
        profile = GraduateProfile.objects.filter(account_id = user)#enrollment=self.kwargs["pk"])
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