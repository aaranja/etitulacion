from django.http import HttpResponse
from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...graduate.documents import Files


class GraduateFile(views.APIView):
    """
    View to get the file from graduate dossier (documents fields)
    * Requires user to be authenticated and staff
    * Route '/staff/graduate-data/<pk>/documents/<keyname>/'
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, **kwargs):
        user = request.user
        if user.is_staff:
            graduate_pk = kwargs['pk']
            doc_key_name = kwargs['keyname']
            file = Files.get(doc_key_name, graduate_pk)
            if file is not None:
                return HttpResponse(file, status=status.HTTP_200_OK, content_type='application/pdf', )
            else:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)
