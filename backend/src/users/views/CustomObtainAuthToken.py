from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from allauth.account.models import EmailAddress

from ..serializers.AuthTokenSerializer import AuthTokenSerializer


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

        data_res = {
            'user_id': user.id,
            'user_type': user.user_type,
        }

        emailaddress = EmailAddress.objects.get(user_id=user.id)

        if emailaddress.verified:
            # return token and permit access to session
            token, created = Token.objects.get_or_create(user=user)
            data_res['token'] = token.key
            data_res['created'] = created
            data_res['email_verified'] = True
        else:
            # return the account is not verified
            data_res['email_verified'] = False

        print(data_res)
        return Response(data_res, status=status.HTTP_202_ACCEPTED)
