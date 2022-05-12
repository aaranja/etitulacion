from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...graduate.serializers import InauDateSerializer, ProcedureHistorySerializer, StatusSerializer
from ...models import DateGroup, GraduateProfile, Account
from ..serializers import DateGroupSerializer


class InaugurationGroup(views.APIView):
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

    @staticmethod
    def info_message(string):
        return "Fecha de toma de protesta {}.".format(string)

    @staticmethod
    def group_date_assignment(enrollment, group_id):
        profile = GraduateProfile.objects.get(enrollment=enrollment)
        graduate_date_serializer = InauDateSerializer(
            profile,
            {'i_date': group_id, 'status': "STATUS_11"},
            partial=True)
        # save if its valid
        information = "Fecha de toma de protesta {}.".format("asignada")
        history_serializer = ProcedureHistorySerializer(
            data={'information': information, 'last_status': profile.status, 'enrollment': enrollment})
        if graduate_date_serializer.is_valid() & history_serializer.is_valid():
            name = Account.objects.get(id=profile.account_id)
            graduate_date_serializer.save()
            history_serializer.save()
            return {'account_id': profile.account_id, 'enrollment': str(profile.enrollment),
                    'first_name': name.first_name, 'last_name': name.last_name}
        else:
            return None

    def get(self, request):
        """
        get params types: groups, specific with id
        """
        user = request.user
        res_data = {'dateGroups': None}
        res_status = status.HTTP_400_BAD_REQUEST
        if user.is_staff:
            request_type = self.request.query_params.get('type')
            if request_type == 'all':
                # response all date groups
                date_groups_queryset = DateGroup.objects.filter(arp_generated=False)
                date_groups = list(date_groups_queryset.order_by("date").values())
                res_data['dateGroups'] = date_groups
                res_status = status.HTTP_200_OK
            elif str(request_type).isnumeric():
                profiles = GraduateProfile.objects \
                    .filter(i_date=request_type) \
                    .values('enrollment', 'career', 'account_id')
                for profile in profiles:
                    names = Account.objects \
                        .filter(id=profile['account_id']) \
                        .values('first_name', 'last_name')
                    full_name = list(names.all())[0]
                    profile.update(full_name)
                    profile['enrollment'] = str(profile['enrollment'])
                res_data = {'dateGroupInfo': profiles}
                res_status = status.HTTP_200_OK
        else:
            res_status = status.HTTP_401_UNAUTHORIZED
        return Response(res_data, res_status)

    def post(self, request, *args, **kwargs):
        """
        create a new group date
        """
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = None
        user = request.user
        if user.is_staff:
            group_date = request.data['groupDate']
            # count graduates
            graduate_list = group_date['graduateList']
            no_graduate = len(graduate_list)
            # create a new group date
            group_date_serializer = DateGroupSerializer(
                None, {'date': group_date['date'], 'no_graduate': no_graduate})
            if group_date_serializer.is_valid():
                # register and get id of group date
                data_group_date = group_date_serializer.save()
                group_id = data_group_date.id
                # get graduate list and set new date into graduate i_date field
                group_date_graduate = []
                for enrollment in graduate_list:
                    # assign date foreign key and set new status into graduate profile
                    graduate_dated = self.group_date_assignment(enrollment, group_id, )
                    if graduate_dated is not None:
                        group_date_graduate.append(graduate_dated)
                    else:
                        print("error agregando a {}".format(enrollment))
                # make response
                res_group_date = {'id': group_id, 'date': group_date['date'], 'no_graduate': no_graduate}
                res_data = {'groupDate': res_group_date, 'dateGroupInfo': group_date_graduate}
                res_status = status.HTTP_201_CREATED
        return Response(res_data, status=res_status)

    def patch(self, request):
        """
        update a current group date
        """
        user = request.user
        res_data = None
        # res_status = status.HTTP_400_BAD_REQUEST
        if user.is_staff:
            group_date = request.data['groupDate']
            # update a current group date
            group_date_graduate = []
            for enrollment in group_date['toRemove']:
                # remove all graduate dated by toRemove list
                profile = GraduateProfile.objects.get(enrollment=enrollment)
                status_serializer = StatusSerializer(
                    profile, {'status': 'STATUS_10'},
                    partial=True)
                information = "Fecha de toma de protesta eliminada."
                history_serializer = ProcedureHistorySerializer(
                    data={'information': information, 'last_status': profile.status, 'enrollment': enrollment})
                if status_serializer.is_valid() & history_serializer.is_valid():
                    status_serializer.save()
                    history_serializer.save()
            for enrollment in group_date['graduateList']:
                profile = GraduateProfile.objects.get(enrollment=enrollment)
                # update graduate data if it doesn't has the gruop date id
                if profile.i_date is not group_date['id']:
                    graduate_dated = self.group_date_assignment(enrollment, group_date['id'])
                    if graduate_dated is not None:
                        group_date_graduate.append(graduate_dated)
                    else:
                        print("error agregando a {}".format(enrollment))
            no_graduate = len(group_date['graduateList'])
            # create a new group date
            group_date = DateGroup.objects.get(id=group_date['id'])
            group_date_serializer = DateGroupSerializer(
                group_date,
                {
                    'date': group_date['date'],
                    'no_graduate': no_graduate
                }
            )
            if group_date_serializer.is_valid():
                group_date_serializer.save()
            group_date['no_graduate'] = no_graduate
            res_data = {'groupDate': group_date, 'dateGroupInfo': group_date_graduate}
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
        group_id = request.query_params.get('id')
        if user.is_staff:
            # get graduate and remove status and current date
            profiles = GraduateProfile.objects.filter(i_date=group_id)
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
            DateGroup.objects.get(id=group_id).delete()
            res_data = {'groupDate': None, 'dateGroupInfo': None}
            res_status = status.HTTP_200_OK
        else:
            res_status = status.HTTP_401_UNAUTHORIZED
        return Response(res_data, status=res_status)
