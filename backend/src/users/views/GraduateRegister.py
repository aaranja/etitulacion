from dj_rest_auth.registration.views import RegisterView
from allauth.account.models import EmailAddress
from rest_framework import status
from rest_framework.response import Response

from ..utils import EmailConfirmationUtils


class GraduateRegister(RegisterView):
    """
    Custom register view to create a graduated account
    ** Response with a JSON with the session information as unconfirmed account
    """

    def get_response_data(self, user):
        # send user session without token and an email unconfirmed
        data = {
            'user_type': user.user_type,
            'email_confirmed': False,
            'email': user.email,
        }
        return data

    def create(self, request, *args, **kwargs):
        request.data['user_type'] = "USER_GRADUATE"
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.is_valid():
            # create user
            user = self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            # get email address
            email_address = EmailAddress.objects.get_for_user(user, request.data['email'])

            confirmation = EmailConfirmationUtils

            # send email confirmation
            code = confirmation.otp_mail(user)

            # store code confirmation
            sent = confirmation.store_code(email_address.id, code)

            return Response(self.get_response_data(user),
                            status=status.HTTP_201_CREATED,
                            headers=headers)
