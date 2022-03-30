from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...graduate.serializers import StatusSerializer, ProcedureHistorySerializer
from ...models import GraduateProfile, GraduateNotifications, Account, GraduateProcedureHistory


class GraduateLiberation(views.APIView):
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

    def patch(self, request):
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
