from rest_framework import viewsets, views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Account
from .serializers import AccountSerializer


class AccountDetailsView(views.APIView):
    """
    View to get, update, add and delete an account detail
    * Requires user is admin and is authenticated
    * Route '/admin/site/account-details/'
    """

    permission_classes = (IsAuthenticated,)
    user_types = {'services': 'USER_SERVICES', "graduates": 'USER_GRADUATE', 'coordination': 'USER_COORDINAT'}

    def get(self, request, *args, **kwargs):
        user = self.request.user
        type = self.request.query_params.get('type')
        if user.user_type == "USER_ADMIN" and type is not None:
            accounts = Account.objects.filter(user_type=self.user_types[type])
            account_details = list(
                accounts.values('id', 'last_login','date_joined', 'email'))
            for account in account_details:
                # set an unique key
                account['key'] = account['id']
            return Response(account_details)
        return Response(None, status=status.HTTP_401_UNAUTHORIZED)

    @staticmethod
    def put(request, pk, format=None):
        res_data = None
        res_status = status.HTTP_401_UNAUTHORIZED
        user = request.user
        print(user.user_type)
        if user.user_type == "USER_ADMIN":
            account = Account.objects.get(id=pk)
            if account is not None:
                data = request.data
                serializer = AccountSerializer(account, data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    res_data = serializer.data
                    print(res_data)
                    res_status = status.HTTP_200_OK
                else:
                    print(serializer.errors)
            else:
                res_status = status.HTTP_204_NO_CONTENT
        return Response(res_data, res_status)

    @staticmethod
    def delete(request, *args, **kwargs):
        res_data = None
        res_status = status.HTTP_401_UNAUTHORIZED
        user = request.user
        id = request.query_params.get('id')
        if user.user_type == "USER_ADMIN" and id is not None:
            account = Account.objects.filter(id=id)
            if account is not None:
                account.delete()
                res_status = status.HTTP_200_OK
            else:
                res_status = status.HTTP_204_NO_CONTENT
        return Response(res_data, res_status)
