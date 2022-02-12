from rest_framework import viewsets, views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Account


class AccountDetailsView(views.APIView):
    """
    View to get, update, add and delete a account detail
    * Requires user is admin and is authenticated
    * Route '/admin/site/account-details/'
    """

    permission_classes = (IsAuthenticated,)
    user_types = {'services': 'USER_SERVICES', "graduate": 'USER_GRADUATE', 'coordination': 'USER_COORDINAT'}

    def get(self, request, *args, **kwargs):
        user = self.request.user
        type = self.request.query_params.get('type')
        if user.user_type == "USER_ADMIN" and type is not None:
            accounts = Account.objects.filter(user_type=self.user_types[type])
            account_details = list(
                accounts.values('id', 'last_login', 'first_name', 'last_name', 'date_joined', 'email'))
            for account in account_details:
                # set an unique key
                account['key'] = account['id']
            return Response(account_details)
        return Response(None, status=status.HTTP_401_UNAUTHORIZED)
