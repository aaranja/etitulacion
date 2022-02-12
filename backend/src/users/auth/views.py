from rest_framework import viewsets, views, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from .serializers import AuthTokenSerializer, AccountSerializer, StaffRegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_auth.registration.views import RegisterView
from allauth.account import app_settings as allauth_settings
from django.conf import settings
from rest_auth.app_settings import (TokenSerializer,
                                    JWTSerializer,
                                    create_token)
from django.utils.translation import ugettext_lazy as _

from ..models import Account


class CustomRegisterView(RegisterView):
    """
    Custom register view to create a graduated account
    ** Response with a JSON with the values needed in the front to display correct data
    """

    def get_response_data(self, user):
        if allauth_settings.EMAIL_VERIFICATION == \
                allauth_settings.EmailVerificationMethod.MANDATORY:
            return {"detail": _("Verification e-mail sent.")}
        print(user.user_type)

        if getattr(settings, 'REST_USE_JWT', False):
            data = {
                'user': user,
                'token': self.token
            }
            return JWTSerializer(data).data
        else:
            ts = TokenSerializer(user.auth_token).data
            data = {
                'key': ts['key'],
                'user': ts['user'],
                'user_type': user.user_type,
                'all_name': user.first_name + " " + user.last_name
            }
            return data


class CustomObtainAuthToken(ObtainAuthToken):
    """
    View to user authenticate
    * Requires email
    """
    permission_classes = (AllowAny,)
    serializer_class = AuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        fullname = user.first_name + " " + user.last_name
        print(user.user_type)
        print("logeando")
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'user_type': user.user_type,
            'fullname': fullname,
        })


class AccountViewSet(viewsets.ModelViewSet):
    """
    View to get user account after login
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = AccountSerializer
    queryset = Account.objects.all()

    # return all own data for authenticated user
    # superuser true get all data
    # superuser false get own data
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Account.objects.all()
        return Account.objects.filter(id=user.id)

    def get_object(self):
        obj = get_object_or_404(Account.objects.filter(id=self.kwargs["pk"]))
        # obj = get_object_or_404(Account.objects.filter(id=16760256))
        self.check_object_permissions(self.request, obj)
        return obj


class StaffRegisterView(views.APIView):
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
        data = {'data': None}
        status_res = status.HTTP_401_UNAUTHORIZED
        if user.is_superuser:
            account = request.data['account']
            register_type = request.data['register_type']
            usertype = self.account_types[register_type]
            if usertype is not None:
                # assign usertype to account
                account['usertype'] = usertype
                #     serialize account
                serializer = self.serializer(user, account, partial=True)
                if serializer.is_valid():
                    # save the account
                    serializer.save(account)
                    status_res = status.HTTP_201_CREATED
                else:
                    # return the error
                    data['message'] = serializer.errors
                    status_res = status.HTTP_406_NOT_ACCEPTABLE
            else:
                status_res = status.HTTP_400_BAD_REQUEST
        return Response(data, status_res)
