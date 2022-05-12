from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...models import GraduateProfile
from ..serializers import ProfileSerializer


class Information(views.APIView):
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
        user = request.user
        profile_queryset = GraduateProfile.objects.filter(account_id=user)
        profile = list(profile_queryset.values())[0]
        return Response(profile)

    def put(self, request, *args, **kwargs):
        user = self.request.user
        graduated = GraduateProfile.objects.get(account_id=user)
        data = request.data['values']
        # get account data
        # get profile data
        serializer = ProfileSerializer(graduated, data, partial=True)
        if serializer.is_valid():
            serializer.save()  # Save profile
            # return data saved
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.error_messages)
        return Response(data, status=status.HTTP_406_NOT_ACCEPTABLE)
