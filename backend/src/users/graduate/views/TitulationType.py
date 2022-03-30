from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...models import GraduateProfile
from ..serializers import TitulationSerializer


class TitulationType(views.APIView):
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
