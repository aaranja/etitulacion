from rest_auth.app_settings import TokenSerializer
from rest_auth.registration.views import RegisterView
from rest_framework import status
from rest_framework.response import Response

from .CustomEmailVerification import CustomEmailConfirmation


class CustomRegister(RegisterView):
    """
    Custom register view to create a graduated account
    ** Response with a JSON with the values needed in the front to display correct data
    """

    def get_response_data(self, user):
        # generate token
        ts = TokenSerializer(user.auth_token).data
        data = {
            # 'key': ts['key'],
            'user': ts['user'],
            'user_type': user.user_type,
            'email_confirmed': False,
            'email': user.email,
        }
        return data

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # create user
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        confirmation = CustomEmailConfirmation
        # set user as not verified
        email_id = confirmation.email_no_verified(user)
        # send email confirmation
        # code = confirmation.otp_mail(user)
        code = '111222'
        # set store code
        sent = confirmation.store_code(email_id, code)
        print("mandado el ", sent)
        return Response(self.get_response_data(user),
                        status=status.HTTP_201_CREATED,
                        headers=headers)
