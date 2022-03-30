from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers import StaffRegisterSerializer
from ...models import Account


class StaffRegister(views.APIView):
    """
    View to create a new Staff Account
    * Requires user is admin
    * Route '/admin/register/staff/'
    """
    permission_classes = (IsAuthenticated,)
    serializer = StaffRegisterSerializer
    account_types = {
        'services': 'USER_SERVICES',
        'coordination': 'USER_COORDINAT',
    }

    def post(self, request, *args, **kwargs):
        user = self.request.user
        data = {}
        status_res = status.HTTP_401_UNAUTHORIZED

        if user.is_superuser:
            account = request.data['account']
            print(account)
            register_type = request.data['register_type']
            usertype = self.account_types[register_type]
            if usertype is not None:
                # assign usertype to account
                account['user_type'] = usertype
                #     serialize account
                serializer = self.serializer(None, account)
                if serializer.is_valid():
                    # save the account
                    email = serializer.save(account)
                    data_query = Account.objects.filter(email=email)
                    data = \
                        list(data_query.values("id", "last_login", "email", "date_joined"))[
                            0]
                    status_res = status.HTTP_201_CREATED
                else:
                    # return the error
                    data['message'] = serializer.errors
                    status_res = status.HTTP_406_NOT_ACCEPTABLE
            else:
                status_res = status.HTTP_400_BAD_REQUEST
        return Response(data, status_res)