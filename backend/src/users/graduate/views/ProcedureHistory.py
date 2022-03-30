from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers import StatusSerializer, ProcedureHistorySerializer
from ...models import GraduateProcedureHistory, GraduateProfile


class ProcedureHistory(views.APIView):
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
