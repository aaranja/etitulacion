from django.http import HttpResponse
from rest_framework import views, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..File import File
from ..generate_cni import CDN_PDF


class SettingsSignature(views.APIView):
    """
    View to set and get settings information:
    - Account details
    - Seal and signature of CNI
    - Password reset
    * Requires user to be authenticated and staff
    * Route '/staff/services/settings/signature/'
    """
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get(self, request, **kwargs):
        user = request.user
        if user.is_staff:
            id = kwargs['id']
            if id == "signature" or id == "seal":
                fs = File("storage/settings/cni/")
                file = fs.get(id)
                response = HttpResponse(file, status=status.HTTP_200_OK, content_type="image/png")
                response['Content-Disposition'] = 'attachment; filename="foo.xls"'
                return response
            elif id == "preview-cni":
                # remove all cni pdf document
                fs = File("storage/settings/cni/")
                fs.remove("preview")
                # generate new cni preview pdf
                newcni = CDN_PDF("PREVIEW_NAME", 12345607, "PREVIEW_CAREER", True)
                if newcni.generate():
                    # if generate is ok, open the file and return in response
                    fs = File("storage/settings/cni/")
                    file = fs.get("preview")
                    if file is not None:
                        response = HttpResponse(file, status=status.HTTP_200_OK, content_type='application/pdf')
                    else:
                        response = HttpResponse(None, status=status.HTTP_204_NO_CONTENT, )
                    return response
                else:
                    return Response(None, status=status.HTTP_400_BAD_REQUEST)
        return Response(None, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def put(request, *args, **kwargs):
        user = request.user
        if user.is_staff:
            action_type = request.data['action_type']
            type = request.data['type']
            if action_type == "upload":
                file = request.FILES['file']
                file.name = type + ".png"
                fs = File("storage/settings/cni/" + type + "/")
                if fs.replace(file):
                    return Response({type: "success"}, status=status.HTTP_200_OK)
            return Response(None, status=status.HTTP_404_NOT_FOUND)
        return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)
