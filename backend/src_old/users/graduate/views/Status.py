from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers import StatusSerializer
from ...models import GraduateProfile


class Status(views.APIView):
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
        serializer = self.serializer(profile, {'status': data['status']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": data['status']}, status=status.HTTP_202_ACCEPTED)
        return Response({'data': "dta"}, status=status.HTTP_409_CONFLICT)
