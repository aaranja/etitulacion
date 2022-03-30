from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...models import GraduateProfile, GraduateNotifications


class Notifications(views.APIView):
    """
    View to get the recent graduate notifications
    * Route 'graduate/notifications/'
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request):
        user = request.user
        profile = GraduateProfile.objects.filter(account_id=user.id)

        enrollment = list(profile.values('enrollment'))[0]['enrollment']

        notifications_queryset = GraduateNotifications.objects.filter(enrollment_id=enrollment)
        notifications = list(notifications_queryset.values().order_by("-time")[:1])

        return Response({'notifications': notifications}, status=status.HTTP_202_ACCEPTED)
