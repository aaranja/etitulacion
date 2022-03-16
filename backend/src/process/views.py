from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from .serializers import TitulationSerializer, InstituteSerializer
from .models import TitulationTypes, InstituteData
from rest_framework.response import Response

""" view for route '/process/4/titulation/types/' """


class TitulationView(views.APIView):
    # permission_classes = (IsAuthenticated,)
    def get(self, request, *args, **kwargs):
        obj_list = []
        for i, item in enumerate(TitulationTypes.objects.all()):
            obj_list.append(item)
        results = TitulationSerializer(obj_list, many=True).data
        return Response(results)


class InstituteView(views.APIView):
    """
    View to modify data about institute
    * Requires user to be authenticated and staff or admin
    * Route '/settings/institute/'
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, *args, **kwargs):
        user = request.user
        res_data = None
        res_status = status.HTTP_401_UNAUTHORIZED
        if user.is_staff:
            data = InstituteData.objects.all()
            if len(data) == 0:
                res_data = {}
                print("sin datos")
            else:
                res_data = list(data.values())[0]
            res_status = status.HTTP_200_OK

        return Response(res_data, res_status)

    @staticmethod
    def patch(request, *args, **kwargs):
        user = request.user
        res_data = {}
        res_status = status.HTTP_401_UNAUTHORIZED
        if user.is_staff:
            print("actualizando: ", request.data)
            id_inst = request.data['id']
            if id_inst is not None:
                institute = InstituteData.objects.get(id=id_inst)
                serializer = InstituteSerializer(institute, request.data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    print(serializer.errors)
            else:
                serializer = InstituteSerializer(None, request.data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    print(serializer.errors)
            res_status = status.HTTP_200_OK
            res_data = request.data

        return Response(res_data, res_status)
