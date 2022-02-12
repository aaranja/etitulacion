from rest_framework import views
from rest_framework.permissions import IsAuthenticated
from .serializers import TitulationSerializer
from .models import TitulationTypes
from rest_framework.response import Response

""" view for route '/process/4/titulation/types/' """
class TitulationView(views.APIView):
    #permission_classes = (IsAuthenticated,)
    def get(self, request, *args, ** kwargs):
        obj_list = []
        for i, item in enumerate(TitulationTypes.objects.all()):
            obj_list.append(item)
        results = TitulationSerializer(obj_list, many=True).data
        return Response(results)