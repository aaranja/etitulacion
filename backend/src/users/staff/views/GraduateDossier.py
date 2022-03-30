from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..careerTypes import get_career
from ..generate_cni import CDN_PDF
from ...graduate.serializers import ProcedureHistorySerializer, NotificationSerializer
from ...models import GraduateProfile, Account, GraduateProcedureHistory, GraduateNotifications
from ..serializers import StatusSerializer


class GraduateDossier(views.APIView):
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
    def get_graduate_data(usertype, enrollment):
        """
        Search a graduate profile and return his profile, history and notifications data.
        """
        profile_queryset = GraduateProfile.objects.filter(enrollment=enrollment)
        profile = \
            list(profile_queryset.values(
                'enrollment',
                'first_name',
                'last_name',
                'career',
                'cellphone',
                'status',
                'accurate_docs',
                'documents',
                'account_id'
            ))[0]
        # get email
        account = Account.objects.get(id=profile['account_id'])
        email = account.email

        notifications_queryset = GraduateNotifications.objects.filter(enrollment_id=enrollment,
                                                                      sender=usertype)
        notifications = list(notifications_queryset.values('id', 'time', 'sender', 'type', 'message').order_by("-time"))
        # search first and last name
        history_queryset = GraduateProcedureHistory.objects.filter(enrollment_id=enrollment)
        history = list(history_queryset.values().order_by('-time'))
        # merge graduate data
        profile['email'] = email
        profile.update({"notifications": notifications})
        profile.update({"history": history})
        return profile

    def get(self, request, *args, **kwargs):
        """
        Method to response a graduate profile if exist
        """
        user = self.request.user
        graduate_pk = self.kwargs['pk']
        if user.is_staff:
            # search profile
            account = self.get_graduate_data(user.user_type, graduate_pk)
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
                account = self.get_graduate_data(user.user_type, profile.enrollment)
                if new_status == "STATUS_06":
                    # generate the CDNI document
                    graduate_name = account["first_name"] + " " + account["last_name"]
                    cdn = CDN_PDF(graduate_name, profile.enrollment, get_career(profile.career), False)
                    cdn.generate()

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
