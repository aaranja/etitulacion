import json
from types import SimpleNamespace

from django.http import HttpResponse
from rest_framework import viewsets, views, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .documents import Files
from ..auth.serializers import AccountSerializer
from ..models import GraduateProfile, GraduateNotifications, GraduateProcedureHistory, Account, DateGroup, ARPData, \
    ARPStaff
from .serializers import ProfileSerializer, DocumentsSerializer, StatusSerializer, TitulationSerializer, \
    ProcedureHistorySerializer


class ARPInfoView(views.APIView):
    """
    View to get the ARP info
    * Requires user is authenticated
    * Route '/graduate/profile/arp-info/'
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = self.request.user
        res_response = None
        res_status = status.HTTP_401_UNAUTHORIZED
        if user.user_type == "USER_GRADUATE":
            dateInfo = {}
            profile_queryset = GraduateProfile.objects.filter(account_id=user).values('enrollment', 'i_date', 'career',
                                                                                      'titulation_type', 'cellphone')
            profile = list(profile_queryset)[0]
            # get account data
            account_queryset = Account.objects.filter(id=user.id).values('email', 'first_name', 'last_name', )
            account = list(account_queryset)[0]
            account.update(profile)
            account['key'] = user.id

            # get date data
            if profile['i_date'] is not None:
                date_group = DateGroup.objects.filter(id=profile['i_date'])
                date = list(date_group.values())[0]
                dateInfo.update(date)
                # get arp data
                if date['arp_generated']:
                    arp_query = ARPData.objects.filter(graduate=profile['enrollment'])
                    arp_data = list(arp_query.values())[0]
                    arp_staff = list(map(arp_data.get, ['president_id', 'secretary_id', 'vocal_id']))
                    staff_data = []
                    for staff in arp_staff:
                        if staff is not None:
                            arp_query = ARPStaff.objects.filter(key=staff).values()
                            staff_data.append(list(arp_query)[0])
                        else:
                            print("vacio")

                    account.update({'staffData': staff_data})
                    account.update(arp_data)
                else:
                    print("datos arp no generados")

            else:
                dateInfo.update({'date': None})
            dateInfo.update({'arpData': account})
            res_response = {'dateInfo': dateInfo}
            res_status = status.HTTP_200_OK

        return Response(res_response, res_status)


class DocumentsFileView(views.APIView):
    """
    View to get the file
    * Requires user is authenticated
    * Route '/graduate/profile/documents/{keyname}'
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = self.request.user
        if user.user_type == "USER_GRADUATE":
            profile = GraduateProfile.objects.get(account_id=user)
            graduate_pk = profile.enrollment
            doc_key_name = self.kwargs['keyname']
            files = Files()
            file = files.get(doc_key_name, graduate_pk)
            if file is not None:
                return HttpResponse(file, status=status.HTTP_200_OK, content_type='application/pdf', )
            else:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        return Response(None, status=status.HTTP_400_BAD_REQUEST)


class ProcedureHistoryView(views.APIView):
    """
    View to get and update the procedure history of graduate
    * Requires user is authenticated
    * Route '/graduate/procedure/history/'
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get_next_status(current_status):
        if current_status == "STATUS_05":
            return "STATUS_04"
        elif current_status == "STATUS_08":
            return "STATUS_07"
        return None

    @staticmethod
    def set_next_procedure(new_status, information, profile):
        status_serializer = StatusSerializer(profile, {'status': new_status}, partial=True)
        history_serializer = ProcedureHistorySerializer(
            data={'information': information, 'last_status': profile.status, 'enrollment': profile.enrollment})
        if history_serializer.is_valid() & status_serializer.is_valid():
            status_serializer.save()
            history_serializer.save()
            history = GraduateProcedureHistory.objects.filter(enrollment_id=profile.enrollment)
            if history.exists():
                return Response({"status": new_status, "procedure_history": history.values()},
                                status=status.HTTP_202_ACCEPTED)

        return Response(None, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """
        Get the procedure history
        :return:
        """
        user = self.request.user
        profile = GraduateProfile.objects.get(account_id=user)

        history = GraduateProcedureHistory.objects.filter(enrollment_id=profile.enrollment)
        if history.exists():
            return Response({'procedure_history': history.values()})

        return Response({'procedure_history': []})

    def put(self, request):
        """
        Create a history register about procedure.
        :param request: {information: 'string'}
        :return:
        """

        user = self.request.user
        profile = GraduateProfile.objects.get(account_id=user)

        procedure_type = request.data['type']
        if procedure_type == "init":
            # set the init status - processing -
            # and make a new procedure history entry
            return self.set_next_procedure("STATUS_03", "Trámite iniciado.", profile)
        elif procedure_type == "resend":
            # resend the dossier to reinit the procedure
            # re-start status
            new_status = self.get_next_status(profile.status)
            print(new_status)
            # set new information history
            information = "Expediente reenviado."
            return self.set_next_procedure(new_status, information, profile)
        elif procedure_type == "cancel":
            # go back status and delete all procedure history entries
            new_status = "STATUS_02"
            status_serializer = StatusSerializer(profile, {'status': new_status}, partial=True)

            history = GraduateProcedureHistory.objects.filter(enrollment_id=profile.enrollment)
            history.delete()

            if status_serializer.is_valid():
                status_serializer.save()
                return Response({"status": new_status, "procedure_history": history.values()},
                                status=status.HTTP_202_ACCEPTED)

        return Response(None, status=status.HTTP_400_BAD_REQUEST)


class GraduateProfileViewSet(viewsets.ModelViewSet):
    """
    View to get or update the graduate profile
    * Requires user authenticated
    * Route '/graduate/profile/'
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = ProfileSerializer
    queryset = GraduateProfile.objects.all()

    def get_queryset(self):
        user = self.request.user
        return GraduateProfile.objects.filter(account_id=user)

    # don't needed, only for reference
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        # print(serializer)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        return Response(serializer.data)


class UploadFileView(views.APIView):
    """
    View to get, save or removed a document from graduate profile
    * Requires user is authenticated
    * Route '/graduate/profile/documents/'
    """
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser,)
    serializer = DocumentsSerializer

    @staticmethod
    def save_new_document(metadata, type_update):
        """
        :type metadata: dict()
        """
        file_status = "uploaded"
        if type_update == "removed":
            file_status = "removed"
        file = dict()
        file['key'] = metadata.key
        file['keyNum'] = int(metadata.key)
        file['keyName'] = metadata.keyName
        file['fileName'] = metadata.fileName
        file['status'] = file_status
        file['url'] = metadata.url
        return file

    @staticmethod
    def get_new_status(current_status):
        switch = {
            "STATUS_04": {'status': "STATUS_03"},
            "STATUS_03": {'status': "STATUS_01"},
            "STATUS_08": {'status': "STATUS_07"},
        }
        return switch.get(current_status, {'status': current_status})

    def put(self, request):
        update_type = request.data['update_type']
        data = request.data['data']
        user = self.request.user

        profile = GraduateProfile.objects.get(account_id=user)
        file_data = json.loads(
            data,
            object_hook=lambda d: SimpleNamespace(**d))

        document = self.save_new_document(file_data, update_type)

        serializer = self.serializer(
            profile,
            {'documents': [document]},
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            # set new status and save file
            files = Files()
            status_response = "removed"
            if update_type == "uploading":
                file = request.FILES['file']
                files.save(file, file_data.keyName, profile.enrollment)
                status_response = "success"
            elif update_type == "removed":
                # remove file
                files.remove(file_data.keyName, profile.enrollment)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(None, status=status.HTTP_400_BAD_REQUEST)


class StatusView(views.APIView):
    """
    View to get or update the graduate status in graduate profile
    * Requires user is authenticated
    * Route '/graduate/profile/status/'
    """
    permission_classes = [IsAuthenticated]
    serializer = StatusSerializer

    def get(self, request):
        user = self.request.user
        profile = GraduateProfile.objects.get(account_id=user)
        return Response({'status': profile.status})

    def put(self, request):
        user = self.request.user
        profile = GraduateProfile.objects.get(account_id=user)
        data = request.data

        print("estatus")
        print(data)
        print("=========")
        serializer = self.serializer(profile, {'status': data['status']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": data['status']}, status=status.HTTP_202_ACCEPTED)
        return Response({'data': "dta"}, status=status.HTTP_409_CONFLICT)


class TitulationTypeView(views.APIView):
    """
    View to get or update the titulation type of graduate profile
    * Requires user is authenticated
    * Route 'graduate/profile/titulation-type/'
    """
    permission_classes = IsAuthenticated

    def put(self, request):
        user = self.request.user
        graduated = GraduateProfile.objects.get(account_id=user)
        data = request.data
        # set new status
        data.update({'titulation_type': data['titulation']})
        serializer = TitulationSerializer(graduated, data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationsView(views.APIView):
    """
    View to get the recent graduate notifications
    * Route 'graduate/notifications/'
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = self.request.user
        profile = GraduateProfile.objects.filter(account_id=user.id)

        enrollment = list(profile.values('enrollment'))[0]['enrollment']

        notifications_queryset = GraduateNotifications.objects.filter(enrollment_id=enrollment)
        notifications = list(notifications_queryset.values().order_by("-time")[:1])

        return Response({'notifications': notifications}, status=status.HTTP_202_ACCEPTED)


class InformationView(views.APIView):
    """
    View to update graduate profile and account
    * Route '/graduate/profile/'
    """
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        profile = GraduateProfile.objects.filter(account_id=user)
        return profile

    def get(self, request, *args, **kwargs):
        user = self.request.user

        profile_queryset = GraduateProfile.objects.filter(account_id=user)
        profile = list(profile_queryset.values())[0]

        account_queryset = Account.objects.filter(id=user.id)
        account = list(account_queryset.values('first_name', 'last_name'))[0]

        account.update(profile)

        return Response(account)

    def put(self, request, *args, **kwargs):
        user = self.request.user
        graduated = GraduateProfile.objects.get(account_id=user)
        data = request.data['values']
        # get account data
        account = {'first_name': data.pop('first_name'),
                   'last_name': data.pop('last_name')}
        # get profile data
        profile = data

        serializer = ProfileSerializer(graduated, profile, partial=True)
        if serializer.is_valid():
            account_serializer = AccountSerializer(user, account, partial=True)
            if account_serializer.is_valid():
                serializer.save()  # Save profile
                account_serializer.save()  # Save account
                account.update(profile)
                # return data saved
                return Response(account, status=status.HTTP_201_CREATED)
        return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
