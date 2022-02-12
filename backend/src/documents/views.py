from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from .serializers import DocumentsSerializer
from .models import DocumentsDetails
from rest_framework.response import Response


# Create your views here.

# view for route '/procedure/documents-metadata/'
class DocumentsView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        type = request.data['type']
        obj_list = []
        documents = None
        if type == "graduate_process":
            documents = DocumentsDetails.objects.exclude(clasification=0)
        elif type == "services_documents":
            documents = DocumentsDetails.objects.exclude(clasification=2).exclude(clasification=0)
        elif type == "coordination_documents":
            documents = DocumentsDetails.objects.exclude(clasification=1)

        # get all documents details
        if documents is not None:
            for i, item in enumerate(documents):
                obj_list.append(item)

        results = DocumentsSerializer(obj_list, many=True).data
        return Response(results)
