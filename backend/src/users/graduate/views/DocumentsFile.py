from django.http import HttpResponse
from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...models import GraduateProfile
from ..documents import Files


class DocumentsFile(views.APIView):
    """
    View to get the file
    * Requires user is authenticated
    * Route '/graduate/profile/documents/{keyname}'
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = self.request.user
        if user.user_type == "USER_GRADUATE":
            profile = GraduateProfile.objects.get(account_id=user)
            graduate_pk = profile.enrollment
            doc_key_name = self.kwargs['keyname']
            files = Files()
            file = files.get(doc_key_name, graduate_pk)
            if file is not None:
                return HttpResponse(file, status=status.HTTP_200_OK, content_type='application/pdf', )
            else:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        return Response(None, status=status.HTTP_400_BAD_REQUEST)
