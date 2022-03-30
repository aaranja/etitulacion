from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers import ARPStaffSerializer
from ...models import ARPStaff


class Rubricator(views.APIView):
    """
    View to get and set ARP staff
    * Requires user to be authenticated and staff
    * Route '/staff/coordination/arp-staff/'
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, *args, **kwargs):
        user = request.user
        res_data = {'arpStaff': None}
        res_status = status.HTTP_401_UNAUTHORIZED
        if user.is_staff:
            arp_staff_queryset = ARPStaff.objects.all()
            arp_staff = list(arp_staff_queryset.values().all())
            res_data['arpStaff'] = arp_staff
            res_status = status.HTTP_200_OK
        return Response(res_data, res_status)

    @staticmethod
    def post(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = None
        if user.is_staff:
            arp_staff = request.data['arpStaffData']
            group_date_serializer = ARPStaffSerializer(
                None, arp_staff)
            if group_date_serializer.is_valid():
                group_date_serializer.save()
                res_status = status.HTTP_201_CREATED
                res_data = {'arpStaff': [group_date_serializer.data]}
        return Response({'create': res_data}, res_status)

    @staticmethod
    def patch(request):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = None
        if user.is_staff:
            arp_staff = request.data['arpStaffData']
            current_arp = ARPStaff.objects.get(key=arp_staff['key'])
            group_date_serializer = ARPStaffSerializer(
                current_arp, arp_staff)
            if group_date_serializer.is_valid():
                group_date_serializer.save()
                res_data = {'arpStaff': [group_date_serializer.data]}
                res_status = status.HTTP_200_OK
            else:
                print("error")
        return Response({'updated': res_data}, res_status)

    @staticmethod
    def delete(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = None
        if user.is_staff:
            key = request.query_params.get('key')
            current_arp = ARPStaff.objects.get(key=key)
            if current_arp is not None:
                current_arp.delete()
                res_status = status.HTTP_200_OK
                res_data = {'arpStaff': [key]}
        return Response({'delete': res_data}, res_status)
