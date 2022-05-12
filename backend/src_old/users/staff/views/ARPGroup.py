from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers import DateGroupSerializer, ARPDataSerializer, ARPProfileSerializer, DateProfileSerializer
from ...graduate.serializers import ProcedureHistorySerializer, StatusSerializer
from ...models import DateGroup, GraduateProfile, ARPData, Account


class ARPGroup(views.APIView):
    """
    View to get and set ARP groups
    - Create a new ARP group
    - Update an ARP group
    - Delete an ARP group
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
            get_type = request.query_params.get('id')
            if get_type == "list":
                # coordination
                arp_queryset = DateGroup.objects.filter(arp_generated=True)
                arp_groups = arp_queryset.values()
                res_data = {'arpGroups': arp_groups}
                res_status = status.HTTP_200_OK
            elif get_type == "list-services":
                # services
                arp_queryset = DateGroup.objects.filter(arp_generated=True, confirmed=True)
                arp_groups = arp_queryset.values()
                res_data = {'arpGroups': arp_groups}
                res_status = status.HTTP_200_OK
            else:
                # specific group id
                date_group = DateGroup.objects.filter(id=get_type)
                date = list(date_group.values())[0]

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
            arp_id = request.data['id']
            # set arp generated on date group
            date_group_queryset = DateGroup.objects.get(id=arp_id)
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
    def patch(request):
        user = request.user
        res_status = status.HTTP_400_BAD_REQUEST
        res_data = None

        if user.is_staff:
            arp_data = request.data['data']
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
                if date_group.arp_generated and arp_data is not None:
                    arp_update = arp_data['update']
                    arp_delete = arp_data['delete']
                    # save graduate data and arp data
                    for graduate in arp_update:
                        current_arp = ARPData.objects.get(graduate_id=graduate['enrollment'])
                        arp_serializer = ARPDataSerializer(current_arp, graduate, partial=True)
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
                    for enrollment in arp_delete:
                        current_arp = ARPData.objects.get(graduate_id=enrollment)
                        profile = GraduateProfile.objects.get(enrollment=enrollment)
                        profile_serializer = DateProfileSerializer(profile, {'i_date': None, 'status': 'STATUS_10'},
                                                                   partial=True)
                        information = "Fecha de toma de protesta eliminada."
                        history_serializer = ProcedureHistorySerializer(
                            data={'information': information, 'last_status': profile.status, 'enrollment': enrollment})
                        if profile_serializer.is_valid() & history_serializer.is_valid():
                            profile_serializer.save()
                            history_serializer.save()
                            current_arp.delete()
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
            arp_id = request.query_params.get('id')
            profiles = GraduateProfile.objects.filter(i_date=arp_id)
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
            DateGroup.objects.get(id=arp_id).delete()
            res_data = {'date': None, 'graduateList': None}
            res_status = status.HTTP_200_OK
        return Response({'delete': res_data}, res_status)
