import json
import re

from django.http import HttpResponse
from rest_framework import views, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .File import File
from .careerTypes import get_career
from .generate_cni import CDN_PDF
from .generate_aep import AEPpdf
from .serializers import DateGroupSerializer, ARPStaffSerializer, ARPDataSerializer, \
    ARPProfileSerializer, DateProfileSerializer, DocumentsSerializer
from ..graduate.documents import Files
from ..graduate.serializers import StatusSerializer, ProcedureHistorySerializer, NotificationSerializer, \
    InauDateSerializer
from ..models import Account, GraduateProfile, GraduateNotifications, DateGroup, ARPStaff, ARPData, \
    GraduateProcedureHistory, GraduateDocuments


class ServicesSettingsAccount(views.APIView):
    permission_classes = (IsAuthenticated,)


class LiberationView(views.APIView):
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get_graduate_data(usertype, enrollment):
        # search profile
        profile_queryset = GraduateProfile.objects.filter(enrollment=enrollment)
        profile = \
            list(profile_queryset.values('enrollment', 'career', 'status', 'accurate_docs', 'documents',
                                         'account_id'))[
                0]
        notifications_queryset = GraduateNotifications.objects.filter(enrollment_id=enrollment,
                                                                      sender=usertype)
        notifications = list(notifications_queryset.values('id', 'time', 'sender', 'type', 'message').order_by("-time"))
        # search first and last name
        account_queryset = Account.objects.filter(id=profile['account_id'])
        account = list(account_queryset.values('first_name', 'last_name', 'email'))[0]
        history_queryset = GraduateProcedureHistory.objects.filter(enrollment_id=enrollment)
        history = list(history_queryset.values().order_by('-time'))
        # merge graduate data
        account.update(profile)
        account.update({"notifications": notifications})
        account.update({"history": history})
        return account

    @staticmethod
    def get(request, *args, **kwargs):
        user = request.user
        res_data = {'aepGraduate': None}
        res_status = status.HTTP_401_UNAUTHORIZED
        return Response(res_data, res_status)

    def patch(self, request, *args, **kwargs):
        user = request.user
        res_data = None
        res_status = status.HTTP_401_UNAUTHORIZED
        if user.is_staff:
            enrollment = request.data['enrollment']
            type = request.data['type']
            print(type)
            profile = GraduateProfile.objects.get(enrollment=enrollment)
            new_status = None
            information = None
            if type == "success":
                new_status = "STATUS_15"
                information = "Carta de Acta de Examen Profesional liberada."
            elif type == "cancel":
                new_status = "STATUS_14"
                information = "Carta de Acta de Examen Profesional cancelada."

            if new_status is not None and profile is not None and information is not None:
                status_serializer = StatusSerializer(
                    profile, {'status': new_status},
                    partial=True)
                # delete confirm history
                valid_history = True
                if type == "cancel":
                    history = GraduateProcedureHistory.objects.filter(last_status="STATUS_14",
                                                                      enrollment=profile.enrollment)
                    for item in history:
                        item.delete()
                elif type == "success":
                    history_serializer = ProcedureHistorySerializer(
                        data={'information': information, 'last_status': profile.status, 'enrollment': enrollment})
                    if history_serializer.is_valid():
                        history_serializer.save()
                    else:
                        print(history_serializer.errors)
                        valid_history = False

                if status_serializer.is_valid() & valid_history:
                    status_serializer.save()
                    res_data = self.get_graduate_data(user.user_type, enrollment)
                    res_data['status'] = new_status
                    res_status = status.HTTP_200_OK
                else:
                    print(status_serializer.errors)
            else:
                res_status = status.HTTP_400_BAD_REQUEST
        return Response(res_data, res_status)


class AEPView(views.APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, *args, **kwargs):
        user = request.user
        res_data = {'aepGraduate': None}
        res_status = status.HTTP_401_UNAUTHORIZED
        if user.is_staff:
            enrollment = request.query_params.get('enrollment')
            profile_query = GraduateProfile.objects.filter(enrollment=enrollment)
            profile = list(profile_query.values(
                'enrollment',
                'career',
                'titulation_type',
                'i_date',
                'account'
            ).all())[0]
            if profile['i_date'] is not None:
                arp_queryset = ARPData.objects.filter(graduate_id=profile['enrollment'])
                arp_list = list(arp_queryset.values().all())[0]
                profile.update(arp_list)
                account_queryset = Account.objects \
                    .filter(id=profile['account']) \
                    .values('email', 'first_name',
                            'last_name')
                account = list(account_queryset)[0]
                profile.update(account)
                profile['key'] = profile['account']
                doc_queryset = GraduateDocuments.objects.filter(keyName="AEP", enrollment=profile['enrollment'])
                aepDocument = None
                if doc_queryset.exists():
                    aepDocument = list(doc_queryset.values())[0]
                else:
                    print("no existe aep file")
                profile['aepDocument'] = aepDocument
                res_data = {'aepGraduate': profile}
                res_status = status.HTTP_200_OK
        return Response(res_data, res_status)

    @staticmethod
    def post(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = {'aepDocument': None}
        if user.is_staff:
            aep_data = request.data['aepData']
            name = aep_data['first_name']
            enrollment = aep_data["enrollment"]
            career = aep_data['career']
            aep_doc = AEPpdf(name, enrollment, career)
            if aep_doc.generate():
                file = Files.get("preAEP", str(enrollment))
                if file is not None:
                    return HttpResponse(file, status=status.HTTP_200_OK, content_type='application/pdf', )
        return Response(res_data, res_status)

    @staticmethod
    def patch(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = {'aepDocument': None}
        if user.is_staff:
            aep_data = request.data

            metadata = json.loads(aep_data['data'])
            enrollment = aep_data['graduate']
            file = aep_data['file']
            graduate = GraduateProfile.objects.get(enrollment=enrollment)
            document_metadata = {
                'keyName': 'AEP',
                'name': 'Acta de Examen Profesional',
                'fileName': metadata['name'],
                'status': 'done',
                'url': '/AEP/',
                'lastModifiedDate': metadata['lastModifiedDate'],
                'enrollment': graduate.enrollment,
                'graduate_status': {
                    'status': graduate.status
                }
            }

            doc_queryset = GraduateDocuments.objects.filter(keyName="AEP", enrollment=graduate.enrollment).first()
            doc_serializer = DocumentsSerializer(doc_queryset, document_metadata)
            if doc_serializer.is_valid():
                files = Files()
                files.save(file, "AEP", graduate.enrollment)
                doc_serializer.save()
                res_status = status.HTTP_200_OK
            else:
                print(doc_serializer.errors)

        return Response(res_data, res_status)

    @staticmethod
    def delete(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = {'aepDocument': None}

        if user.is_staff:
            enrollment = request.query_params.get('enrollment')
            doc_queryset = GraduateDocuments.objects.filter(keyName="AEP", enrollment=enrollment).first()
            if doc_queryset is not None:
                doc_queryset.delete()
                res_status = status.HTTP_200_OK
            else:
                res_status = status.HTTP_404_NOT_FOUND
        return Response(res_data, res_status)


class ARPStaffView(views.APIView):
    """
    View to get and set ARP staff
    * Requires user to be authenticated and staff
    * Route '/staff/coordination/arp-staff/'
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, *args, **kwargs):
        user = request.user
        res_data = {'arpStaff': None}
        res_status = status.HTTP_401_UNAUTHORIZED
        if user.is_staff:
            arp_staff_queryset = ARPStaff.objects.all()
            arp_staff = list(arp_staff_queryset.values().all())
            res_data['arpStaff'] = arp_staff
            res_status = status.HTTP_200_OK
        return Response(res_data, res_status)

    @staticmethod
    def post(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = None
        if user.is_staff:
            arp_staff = request.data['arpStaffData']
            group_date_serializer = ARPStaffSerializer(
                None, arp_staff)
            if group_date_serializer.is_valid():
                group_date_serializer.save()
                res_status = status.HTTP_201_CREATED
                res_data = {'arpStaff': [group_date_serializer.data]}
        return Response({'create': res_data}, res_status)

    @staticmethod
    def patch(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = None
        if user.is_staff:
            arp_staff = request.data['arpStaffData']
            current_arp = ARPStaff.objects.get(key=arp_staff['key'])
            group_date_serializer = ARPStaffSerializer(
                current_arp, arp_staff)
            if group_date_serializer.is_valid():
                group_date_serializer.save()
                res_data = {'arpStaff': [group_date_serializer.data]}
                res_status = status.HTTP_200_OK
            else:
                print("error")
        return Response({'updated': res_data}, res_status)

    @staticmethod
    def delete(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = None
        if user.is_staff:
            key = request.query_params.get('key')
            current_arp = ARPStaff.objects.get(key=key)
            if current_arp is not None:
                current_arp.delete()
                res_status = status.HTTP_200_OK
                res_data = {'arpStaff': [key]}
        return Response({'delete': res_data}, res_status)


class ARPGroupView(views.APIView):
    """
    View to get and set ARP groups
    - Create a new ARP group
    - Update a ARP group
    - Delete a ARP group
    - Read all ARP groups data
    * Requires user to be authenticated and staff
    * Route '/staff/coordination/group-date/'
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, *args, **kwargs):
        user = request.user
        res_data = None
        res_status = status.HTTP_400_BAD_REQUEST
        if user.is_staff:
            id = request.query_params.get('id')
            if id == "list":
                # coordination
                arp_queryset = DateGroup.objects.filter(arp_generated=True)
                arp_groups = arp_queryset.values()
                res_data = {'arpGroups': arp_groups}
                res_status = status.HTTP_200_OK
            elif id == "list-services":
                # services
                arp_queryset = DateGroup.objects.filter(arp_generated=True, confirmed=True)
                arp_groups = arp_queryset.values()
                res_data = {'arpGroups': arp_groups}
                res_status = status.HTTP_200_OK
            else:
                # specific group id
                dateGroup = DateGroup.objects.filter(id=id)
                date = list(dateGroup.values())[0]

                if date["arp_generated"]:
                    graduate_queryset = GraduateProfile.objects.filter(i_date=date['id'])
                    graduate_list = list(
                        graduate_queryset.values(
                            'enrollment',
                            'cellphone',
                            'career',
                            'titulation_type',
                            'account'
                        ).all())
                    for graduate in graduate_list:
                        arp_queryset = ARPData.objects.filter(graduate=graduate['enrollment'])
                        arp_list = list(arp_queryset.values())[0]
                        graduate.update(arp_list)
                        account_queryset = Account.objects \
                            .filter(id=graduate['account']) \
                            .values('email', 'first_name',
                                    'last_name')
                        account = list(account_queryset)[0]
                        graduate.update(account)
                        graduate['key'] = graduate['account']
                    res_data = {'graduateList': graduate_list, 'date': date}
                    res_status = status.HTTP_200_OK
        return Response(res_data, res_status)

    @staticmethod
    def post(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_400_BAD_REQUEST
        res_data = None

        if user.is_staff:
            id = request.data['id']
            # set arp generated on date group
            date_group_queryset = DateGroup.objects.get(id=id)
            date_group = date_group_queryset.__dict__.copy()
            date_group.pop('_state')
            date_serializer = DateGroupSerializer(date_group_queryset, {'arp_generated': True},
                                                  partial=True)
            if date_serializer.is_valid():
                # get graduate list by date group
                graduate_queryset = GraduateProfile.objects.filter(i_date=date_group['id'])
                graduate_list = list(graduate_queryset.values(
                    'enrollment', 'career', 'titulation_type', 'status', 'account_id'
                ))
                # get first name, last name and email by account
                for graduate in graduate_list:
                    account_queryset = Account.objects.filter(id=graduate['account_id'])
                    account = list(account_queryset.values('first_name', 'last_name', 'email'))[0]
                    graduate.update(account)
                    graduate['graduate'] = graduate['enrollment']
                    graduate['key'] = graduate['account_id']
                # create arp data for all graduate
                arp_data_serializer = ARPDataSerializer(None, graduate_list, many=True)

                if arp_data_serializer.is_valid():
                    for graduate in graduate_list:
                        information = "Datos de Acto de Recepción Profesional creados."
                        profile = GraduateProfile.objects.get(enrollment=graduate['enrollment'])
                        history_serializer = ProcedureHistorySerializer(
                            data={'information': information, 'last_status': profile.status,
                                  'enrollment': graduate['enrollment']})
                        status_serializer = StatusSerializer(
                            profile, {'status': 'STATUS_12'},
                            partial=True)
                        if history_serializer.is_valid() & status_serializer.is_valid():
                            status_serializer.save()
                            history_serializer.save()
                    arp_data_serializer.save()
                    date_serializer.save()
                    res_data = {
                        'graduateList': graduate_list,
                        'date': date_group
                    }
                    res_status = status.HTTP_200_OK
                else:
                    print(arp_data_serializer.errors)
            else:
                print(date_serializer.errors)
        else:
            res_status = status.HTTP_401_UNAUTHORIZED
        return Response(res_data, res_status)

    @staticmethod
    def patch(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_400_BAD_REQUEST
        res_data = None

        if user.is_staff:
            arpData = request.data['data']
            date = request.data['date']
            complete = request.data['complete']
            print("complete ", complete)
            assist = request.data['assist']
            saved = []
            deleted = []
            res_data = {
                'saved': saved,
                'deleted': deleted
            }

            date_group = DateGroup.objects.get(id=date['id'])
            current_assist = date_group.confirmed
            new_date_data = {}
            if complete is not None:
                new_date_data['arp_complete'] = complete

            do_history = False
            if assist is not None:
                print("confirmación", assist)
                print("confirmación actual: ", current_assist)
                new_date_data['confirmed'] = assist
                if current_assist != assist:
                    print("no es igual")
                    do_history = True
            # set arp generated on date group

            date_serializer = DateGroupSerializer(date_group, new_date_data,
                                                  partial=True)
            if date_serializer.is_valid():
                # date serializer valid
                if date_group.arp_generated and arpData is not None:
                    arpUpdate = arpData['update']
                    arpDelete = arpData['delete']
                    # save graduate data and arp data
                    for graduate in arpUpdate:
                        currentARP = ARPData.objects.get(graduate_id=graduate['enrollment'])
                        arp_serializer = ARPDataSerializer(currentARP, graduate, partial=True)
                        profile = GraduateProfile.objects.get(enrollment=graduate['enrollment'])
                        graduate['account'] = {
                            'first_name': graduate['first_name'],
                            'last_name': graduate['last_name']
                        }
                        graduate['president'] = graduate['president_id']
                        graduate['secretary'] = graduate['secretary_id']
                        graduate['vocal'] = graduate['vocal_id']
                        profile_serializer = ARPProfileSerializer(profile, graduate, partial=True)

                        if arp_serializer.is_valid() & profile_serializer.is_valid():
                            arp_serializer.save()
                            profile_serializer.save()
                            saved.append(graduate)
                    # delete arp data and remove date_group
                    for enrollment in arpDelete:
                        currentARP = ARPData.objects.get(graduate_id=enrollment)
                        profile = GraduateProfile.objects.get(enrollment=enrollment)
                        profile_serializer = DateProfileSerializer(profile, {'i_date': None, 'status': 'STATUS_10'},
                                                                   partial=True)
                        information = "Fecha de toma de protesta eliminada."
                        history_serializer = ProcedureHistorySerializer(
                            data={'information': information, 'last_status': profile.status, 'enrollment': enrollment})
                        if profile_serializer.is_valid() & history_serializer.is_valid():
                            profile_serializer.save()
                            history_serializer.save()
                            currentARP.delete()
                            deleted.append(enrollment)

                    res_data['saved'] = saved
                    res_data['deleted'] = deleted

                # save date
                date_serializer.save()
                # create history for each graduate
                if do_history:
                    if assist:
                        information = "Asistencia al Acto de Recepción Profesional confirmada."
                        status_grad = "STATUS_13"
                    else:
                        information = "Asistencia al Acto de Recepción Profesional sin confirmar."
                        status_grad = "STATUS_12"

                    profiles_queryset = GraduateProfile.objects.filter(i_date=date_group.id)
                    for profile in profiles_queryset:
                        history_serializer = ProcedureHistorySerializer(
                            data={'information': information, 'last_status': profile.status,
                                  'enrollment': profile.enrollment})
                        status_serializer = StatusSerializer(
                            profile, {'status': status_grad},
                            partial=True)
                        if history_serializer.is_valid() & status_serializer.is_valid():
                            history_serializer.save()
                            status_serializer.save()
                        else:
                            print(history_serializer.errors)

                res_data['date'] = date_serializer.data
                res_status = status.HTTP_200_OK
            else:
                print(date_serializer.errors)
        else:
            res_status = status.HTTP_401_UNAUTHORIZED
        return Response(res_data, res_status)

    @staticmethod
    def delete(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = None
        if user.is_staff:
            id = request.query_params.get('id')
            profiles = GraduateProfile.objects.filter(i_date=id)
            for profile in profiles:
                information = "Fecha de toma de protesta eliminada."
                history_serializer = ProcedureHistorySerializer(
                    data={'information': information, 'last_status': profile.status, 'enrollment': profile.enrollment})
                graduate_date_serializer = StatusSerializer(
                    profile, {'status': 'STATUS_10'},
                    partial=True)
                # save it if is valid
                arp_data = ARPData.objects.get(graduate=profile.enrollment)
                if graduate_date_serializer.is_valid() & history_serializer.is_valid():
                    history_serializer.save()
                    arp_data.delete()
                    graduate_date_serializer.save()
            # get date and delete
            DateGroup.objects.get(id=id).delete()
            res_data = {'date': None, 'graduateList': None}
            res_status = status.HTTP_200_OK
        return Response({'delete': res_data}, res_status)


class GroupDateView(views.APIView):
    """
    View to get and set groups date to graduate
    - Create new group date
    - Update group date
    - Delete group date
    - Read group date info
    * Requires user to be authenticated and staff
    * Route '/staff/coordination/group-date/'
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        """
        get params types: groups, specific with id
        """
        user = request.user
        res_data = {'dateGroups': None}
        res_status = status.HTTP_400_BAD_REQUEST
        if user.is_staff:
            type = self.request.query_params.get('type')
            if type == 'all':
                # response all date groups
                date_groups_queryset = DateGroup.objects.filter(arp_generated=False)
                date_groups = list(date_groups_queryset.order_by("date").values())
                res_data['dateGroups'] = date_groups
                res_status = status.HTTP_200_OK
            elif str(type).isnumeric():
                profiles = GraduateProfile.objects.filter(i_date=type).values('enrollment', 'career', 'account_id')
                for profile in profiles:
                    names = Account.objects.filter(id=profile['account_id']).values('first_name', 'last_name')
                    full_name = list(names.all())[0]
                    profile.update(full_name)
                    profile['enrollment'] = str(profile['enrollment'])
                res_data = {'dateGroupInfo': profiles}
                res_status = status.HTTP_200_OK
        else:
            res_status = status.HTTP_401_UNAUTHORIZED
        return Response(res_data, res_status)

    @staticmethod
    def post(request, *args, **kwargs):
        """
        create a new group date
        """
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = None
        user = request.user
        if user.is_staff:
            groupDate = request.data['groupDate']
            # count graduates
            graduate_list = groupDate['graduateList']
            no_graduate = len(graduate_list)
            # create a new group date
            group_date_serializer = DateGroupSerializer(
                None, {'date': groupDate['date'], 'no_graduate': no_graduate})
            if group_date_serializer.is_valid():
                # register and get id of group date
                data_group_date = group_date_serializer.save()
                group_id = data_group_date.id
                # get graduate list and set new date into graduate i_date field
                group_date_graduate = []
                for enrollment in graduate_list:
                    # assign date foreign key and set new status into graduate profile
                    profile = GraduateProfile.objects.get(enrollment=enrollment)
                    graduate_date_serializer = InauDateSerializer(
                        profile,
                        {'i_date': group_id, 'status': 'STATUS_11'},
                        partial=True)
                    # save if its valid
                    information = "Fecha de toma de protesta asignada."
                    history_serializer = ProcedureHistorySerializer(
                        data={'information': information, 'last_status': profile.status, 'enrollment': enrollment})
                    if graduate_date_serializer.is_valid() & history_serializer.is_valid():
                        name = Account.objects.get(id=profile.account_id)
                        group_date_graduate.append(
                            {'account_id': profile.account_id, 'enrollment': str(profile.enrollment),
                             'first_name': name.first_name, 'last_name': name.last_name})
                        graduate_date_serializer.save()
                        history_serializer.save()
                # make response
                res_groupDate = {'id': group_id, 'date': groupDate['date'], 'no_graduate': no_graduate}
                res_data = {'groupDate': res_groupDate, 'dateGroupInfo': group_date_graduate}
                res_status = status.HTTP_201_CREATED
        return Response(res_data, status=res_status)

    @staticmethod
    def patch(request, *args, **kwargs):
        """
        update a current group date
        """
        user = request.user
        res_data = None
        res_status = status.HTTP_400_BAD_REQUEST
        if user.is_staff:
            groupDate = request.data['groupDate']
            # update a currently group date
            group_date_graduate = []
            for enrollment in groupDate['toRemove']:
                # remove all datedgraduate by toRemove list
                profile = GraduateProfile.objects.get(enrollment=enrollment)
                inaudate_serializer = StatusSerializer(
                    profile, {'status': 'STATUS_10'},
                    partial=True)
                information = "Fecha de toma de protesta eliminada."
                history_serializer = ProcedureHistorySerializer(
                    data={'information': information, 'last_status': profile.status, 'enrollment': enrollment})
                if inaudate_serializer.is_valid() & history_serializer.is_valid():
                    inaudate_serializer.save()
                    history_serializer.save()
            for enrollment in groupDate['graduateList']:
                profile = GraduateProfile.objects.get(enrollment=enrollment)
                # update graduate data if it doesn't has the gruop date id
                if profile.i_date is not groupDate['id']:
                    graduate_date_serializer = InauDateSerializer(
                        profile, {'i_date': groupDate['id'], 'status': 'STATUS_11'},
                        partial=True)
                    information = "Fecha de toma de protesta asignada."
                    history_serializer = ProcedureHistorySerializer(
                        data={'information': information, 'last_status': profile.status, 'enrollment': enrollment})
                    if graduate_date_serializer.is_valid() & history_serializer.is_valid():
                        name = Account.objects.get(id=profile.account_id)
                        group_date_graduate.append(
                            {'account_id': profile.account_id, 'enrollment': str(profile.enrollment),
                             'first_name': name.first_name, 'last_name': name.last_name})
                        graduate_date_serializer.save()
                        history_serializer.save()
            no_graduate = len(groupDate['graduateList'])
            # create a new group date
            dateGroup = DateGroup.objects.get(id=groupDate['id'])
            group_date_serializer = DateGroupSerializer(
                dateGroup,
                {
                    'date': groupDate['date'],
                    'no_graduate': no_graduate
                }
            )
            if group_date_serializer.is_valid():
                group_date_serializer.save()
            groupDate['no_graduate'] = no_graduate
            res_data = {'groupDate': groupDate, 'dateGroupInfo': group_date_graduate}
            res_status = status.HTTP_202_ACCEPTED
        else:
            res_status = status.HTTP_401_UNAUTHORIZED

        return Response(res_data, status=res_status)

    @staticmethod
    def delete(request, *args, **kwargs):
        """
        delete a existing group date
        """
        user = request.user
        res_data = {'dateGroups': None}
        id = request.query_params.get('id')
        if user.is_staff:
            # get graduate and remove status and current date
            profiles = GraduateProfile.objects.filter(i_date=id)
            for profile in profiles:
                graduate_date_serializer = StatusSerializer(
                    profile, {'status': 'STATUS_10'},
                    partial=True)
                # save it if is valid
                information = "Fecha de toma de protesta eliminada."
                history_serializer = ProcedureHistorySerializer(
                    data={'information': information, 'last_status': profile.status, 'enrollment': profile.enrollment})
                if graduate_date_serializer.is_valid() & history_serializer.is_valid():
                    graduate_date_serializer.save()
                    history_serializer.save()
                    # get date and delete
                else:
                    return Response(res_data, status=status.HTTP_400_BAD_REQUEST)
            DateGroup.objects.get(id=id).delete()
            res_data = {'groupDate': None, 'dateGroupInfo': None}
            res_status = status.HTTP_200_OK
        else:
            res_status = status.HTTP_401_UNAUTHORIZED
        return Response(res_data, status=res_status)


class ServicesSettings(views.APIView):
    """
    View to set and get settings information:
    - Account details
    - Seal and signature of CNI
    - Password reset
    * Requires user to be authenticated and staff
    * Route '/staff/services/settings/signature/'
    """
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, **kwargs):
        user = request.user
        if user.is_staff:
            id = kwargs['id']

            if id == "signature" or id == "seal":
                fs = File("storage/settings/cni/")
                file = fs.get(id)
                response = HttpResponse(file, status=status.HTTP_200_OK, content_type="image/png")
                response['Content-Disposition'] = 'attachment; filename="foo.xls"'
                return response
            elif id == "preview-cni":
                # remove all cni pdf document
                fs = File("storage/settings/cni/")
                fs.remove("preview")
                # generate new cni preview pdf
                newcni = CDN_PDF("PREVIEW_NAME", 12345607, "PREVIEW_CAREER", True)
                if newcni.generate():
                    # if generate is ok, open the file and return in response
                    fs = File("storage/settings/cni/")
                    file = fs.get("preview")
                    if file is not None:
                        response = HttpResponse(file, status=status.HTTP_200_OK, content_type='application/pdf')
                    else:
                        response = HttpResponse(None, status=status.HTTP_204_NO_CONTENT, )
                    return response
                else:
                    return Response(None, status=status.HTTP_400_BAD_REQUEST)
        return Response(None, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def put(request, *args, **kwargs):
        user = request.user
        if user.is_staff:
            action_type = request.data['action_type']
            type = request.data['type']
            if action_type == "upload":
                file = request.FILES['file']
                file.name = type + ".png"
                fs = File("storage/settings/cni/" + type + "/")
                if fs.replace(file):
                    return Response({type: "success"}, status=status.HTTP_200_OK)
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class GraduateFileView(views.APIView):
    """
    View to get the file from graduate dossier (documents fields)
    * Requires user to be authenticated and staff
    * Route '/staff/graduate-data/<pk>/documents/<keyname>/'
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, **kwargs):
        user = request.user
        if user.is_staff:
            graduate_pk = kwargs['pk']
            doc_key_name = kwargs['keyname']
            file = Files.get(doc_key_name, graduate_pk)
            if file is not None:
                return HttpResponse(file, status=status.HTTP_200_OK, content_type='application/pdf', )
            else:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class GraduateDossierView(views.APIView):
    """
    View to get the graduate dossier (graduate profile and account)
    * Requires user to be authenticated and staff
    * Route '/staff/graduate-data/<pk>/'
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def approval_status(staff_type, approval_type):
        """
        Get the new status by the approval type
        :param approval_type: String. "success" | "error".
        :param staff_type: String. "USER_SERVICES" | "USER_COORDINAT"
        :return: String. "STATUS_0X"
        """
        status_types = {
            'USER_SERVICES': {
                "init": {
                    "status": "STATUS_04",
                },
                "error": {
                    "status": "STATUS_05",
                    "information": "Departamento de Servicios escolares. Trámite rechazado."
                },
                "success": {
                    "status": "STATUS_06",
                    "information": "Departamento de Servicios escolares. Trámite aprobado."
                }
            },
            'USER_COORDINAT': {
                "init": {
                    'status': "STATUS_07"
                },
                'error': {
                    "status": "STATUS_08",
                    "information": "Coordinación de Titulación. Trámite rechazado."
                },
                "success": {
                    "status": "STATUS_09",
                    "information": "Coordinación de Titulación. Trámite aprobado."
                },
            }
        }
        return status_types[staff_type][approval_type]

    @staticmethod
    def getGraduateData(usertype, enrollment):
        # search profile
        profile_queryset = GraduateProfile.objects.filter(enrollment=enrollment)
        profile = \
            list(profile_queryset.values('enrollment', 'career', 'cellphone', 'status', 'accurate_docs', 'documents',
                                         'account_id'))[
                0]
        notifications_queryset = GraduateNotifications.objects.filter(enrollment_id=enrollment,
                                                                      sender=usertype)
        notifications = list(notifications_queryset.values('id', 'time', 'sender', 'type', 'message').order_by("-time"))
        # search first and last name
        account_queryset = Account.objects.filter(id=profile['account_id'])
        account = list(account_queryset.values('first_name', 'last_name', 'email'))[0]
        history_queryset = GraduateProcedureHistory.objects.filter(enrollment_id=enrollment)
        history = list(history_queryset.values().order_by('-time'))
        # merge graduate data
        account.update(profile)
        account.update({"notifications": notifications})
        account.update({"history": history})
        return account

    def get(self, request, *args, **kwargs):
        user = self.request.user
        graduate_pk = self.kwargs['pk']

        if user.is_staff:
            # search profile
            account = self.getGraduateData(user.user_type, graduate_pk)
            # return graduate data
            return Response(account, status=status.HTTP_200_OK)
        return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request, *args, **kwargs):
        """
        Post to handle dossier graduated approval.
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        user = self.request.user

        graduate_pk = self.kwargs['pk']
        approval_type = request.data['type']
        message = request.data['message']
        result_type = None

        if user.is_staff:
            # get the new status and information to procedure history by approval and user type
            status_procedure = self.approval_status(user.user_type, approval_type)
            new_status = status_procedure['status']
            information = status_procedure['information']

            # get the graduate profile and set the new status
            profile = GraduateProfile.objects.get(enrollment=graduate_pk)
            status_serializer = StatusSerializer(profile, {'status': new_status}, partial=True)

            # create a new procedure history
            history_serializer = ProcedureHistorySerializer(
                data={'information': information, 'last_status': profile.status, 'enrollment': profile.enrollment})

            # create a notification if type is error and save it
            notifications = None
            if approval_type == "error":
                notification_serializer = NotificationSerializer(
                    data={'sender': user.user_type, 'type': approval_type, 'message': message,
                          'enrollment': profile.enrollment})
                if notification_serializer.is_valid():
                    notification_serializer.save()

            # save the new status and new procedure history
            if history_serializer.is_valid() & status_serializer.is_valid():
                status_serializer.save()
                history_serializer.save()
                # history = GraduateProcedureHistory.objects.filter(enrollment_id=profile.enrollment)
                account = self.getGraduateData(user.user_type, profile.enrollment)
                if new_status == "STATUS_06":
                    # generate the CDNI document
                    graduate_name = account["first_name"] + " " + account["last_name"]
                    cdni = CDN_PDF(graduate_name, profile.enrollment, get_career(profile.career), False)
                    cdni.generate()

                # if everything is fine, return the new status, procedure history and notifications
                return Response(account, status=status.HTTP_202_ACCEPTED)
                # if history.exists():
                #     return Response({
                #         "status": new_status,
                #         "procedure_history": history.values(),
                #         "notifications": notifications
                #     },
                #         status=status.HTTP_202_ACCEPTED)

        # isn´t staff or something got bad
        return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class GraduateListView(views.APIView):
    """
    View to get all graduate in a list
    * Requires user to be authenticated and staff
    * Route '/staff/graduate-list/'
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get_status(current_status):
        if current_status == "STATUS_02":
            return ['STATUS_02', 'STATUS_03', 'STATUS_01', 'STATUS_00']
        elif current_status == "STATUS_06":
            return ['STATUS_06', 'STATUS_07', 'STATUS_08', 'STATUS_09']
        elif current_status == "STATUS_10":
            return ['STATUS_09', 'STATUS_10']
        else:
            return [current_status]

    def get(self, request, *args, **kwargs):
        user = request.user
        # only staff can get all graduate data
        if user.is_staff is True:
            # get graduate profile data
            profiles_queryset = GraduateProfile.objects.all()
            list_profile = list(
                profiles_queryset.values('enrollment', 'career', 'status', 'accurate_docs', 'account_id'))
            list_graduate = []
            for graduate in list_profile:
                # get graduate account data
                account_queryset = Account.objects.filter(id=graduate['account_id'], user_type="USER_GRADUATE")
                account = list(account_queryset.values('first_name', 'last_name'))[0]
                # merge profile and account data
                account.update(graduate)
                # add to global list graduate
                list_graduate.append(account)

            return Response(list_graduate, status=status.HTTP_200_OK, content_type='application/json')
        return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request, *args, **kwargs):
        user = request.user
        if user.is_staff:
            filter_career = request.data['career']  # career filter
            filter_status = request.data['status']  # status filter
            search = request.data['search']  # enrollment or name filter

            # get filter by career and status
            if filter_career is not None and filter_status is not None:
                profiles_queryset = GraduateProfile.objects.filter(career=filter_career,
                                                                   status__in=self.get_status(filter_status))
            # get filter by only career
            elif filter_career is not None:
                profiles_queryset = GraduateProfile.objects.filter(career=filter_career)
            # get filter by only status
            elif filter_status is not None:
                profiles_queryset = GraduateProfile.objects.filter(status__in=self.get_status(filter_status))
            # get all data
            else:
                profiles_queryset = GraduateProfile.objects.all()

            # if enrollment or name is set in request
            # set search type
            search_type = None
            if len(search) > 0:
                if search.isnumeric():
                    search_type = "enrollment"
                else:
                    search_type = "name"

            # create a list with only required profile fields
            list_profile = list(
                profiles_queryset.values('enrollment', 'career', 'status', 'accurate_docs', 'account_id'))
            # make a list to merge profile and account fields
            list_graduate = []
            # on each graduate
            for graduate in list_profile:
                # get account data
                account_queryset = Account.objects.filter(id=graduate['account_id'], user_type="USER_GRADUATE")
                account = list(account_queryset.values('first_name', 'last_name'))[0]
                # default True: the data is filtered correct
                isvalid = True
                # when search type is name, get the name and matches with search
                if search_type == "name":
                    all_name = account['first_name'] + " " + account['last_name']
                    if re.match(search.lower(), all_name.lower()) is None:
                        # if is not matching, the data is don't added to list
                        isvalid = False
                # when search type is enrollment, get the profile enrollment and matches with search
                elif search_type == "enrollment":
                    if re.match(search, str(graduate['enrollment'])) is None:
                        # if is not matching, the data is don't added to list
                        isvalid = False
                if isvalid:
                    # add graduate into list graduate
                    account.update(graduate)
                    list_graduate.append(account)
            return Response(list_graduate, status=status.HTTP_200_OK, content_type='application/json')
        return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)
