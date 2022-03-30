import json
from types import SimpleNamespace

from rest_framework import views, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers import DocumentsSerializer
from ...models import GraduateProfile
from ..documents import Files


class UploadFile(views.APIView):
    """
    View to get, save or removed a document from graduate profile
    * Requires user is authenticated
    * Route '/graduate/profile/documents/'
    """
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser,)
    serializer = DocumentsSerializer

    @staticmethod
    def save_new_document(metadata, type_update):
        """
        :type metadata: dict()
        :type metadata: basestring
        """
        file_status = "uploaded"
        if type_update == "removed":
            file_status = "removed"
        file = dict()
        file['key'] = metadata.key
        file['keyNum'] = int(metadata.key)
        file['keyName'] = metadata.keyName
        file['fileName'] = metadata.fileName
        file['status'] = file_status
        file['url'] = metadata.url
        return file

    @staticmethod
    def get_new_status(current_status):
        switch = {
            "STATUS_04": {'status': "STATUS_03"},
            "STATUS_03": {'status': "STATUS_01"},
            "STATUS_08": {'status': "STATUS_07"},
        }
        return switch.get(current_status, {'status': current_status})

    def put(self, request):
        update_type = request.data['update_type']
        data = request.data['data']
        user = self.request.user

        profile = GraduateProfile.objects.get(account_id=user)
        file_data = json.loads(
            data,
            object_hook=lambda d: SimpleNamespace(**d))

        document = self.save_new_document(file_data, update_type)

        serializer = self.serializer(
            profile,
            {'documents': [document]},
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            # set new status and save file
            files = Files()
            status_response = "removed"
            if update_type == "uploading":
                file = request.FILES['file']
                files.save(file, file_data.keyName, profile.enrollment)
                status_response = "success"
            elif update_type == "removed":
                # remove file
                files.remove(file_data.keyName, profile.enrollment)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(None, status=status.HTTP_400_BAD_REQUEST)
