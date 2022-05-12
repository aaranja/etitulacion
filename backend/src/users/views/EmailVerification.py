from allauth.account.models import EmailAddress, EmailConfirmation
from django.utils import timezone
from rest_framework import views, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..utils import EmailConfirmationUtils
from ..serializers import EmailConfirmationSerializer, EmailAddressSerializer

from ..models import Account


class EmailVerification(views.APIView):
    """
    View to response about email verification.
    * Get generate an email to user account if is not verified. Or get the expiry time code.
    * Post receive the code and check if it is matching with email code was sent before
    * Put generate a new mail and resend the new left time to code expire.
    * URL: authenticate/confirm-email/

    Tu cuenta ha sido registrada con exito.
    Para confirmar el registro, se ha enviado un correo a tu dirección electrónica:
    al16760256@ite.edu.mx, con el enlace que verificará tu cuenta.

    Ir al inicio


    """
    permission_classes = (AllowAny,)

    @staticmethod
    def get(request, pk):
        """
        Method which receive an email and check if is verified
        If it's not, return the left time of email confirmation sent.
        If it doesn't have any email sent to confirmation, send a new one.
        """
        res_data = {}
        email_query = EmailAddress.objects.filter(email=pk)

        email = list(email_query)[0]

        if email is not None:
            print(email)
            if not email.verified:
                # check if email is sent
                confirmation_query = EmailConfirmation.objects.filter(email_address_id=email.id)
                confirmations = list(confirmation_query)
                if len(confirmations) == 0:
                    # send confirmation email
                    confirmation = EmailConfirmationUtils

                    # send email confirmation
                    user = Account.objects.get(id=email.user_id)
                    code = confirmation.otp_mail(user)

                    # store code confirmation
                    sent = confirmation.store_code(email.id, code)
                    print("correo enviado, ", sent)
                    res_data['sent'] = sent
                    res_status = status.HTTP_200_OK
                else:
                    # get code expire time
                    print("ya ha una código")
                    res_data['email'] = email.email
                    res_data['sent'] = confirmations[0].sent
                    res_status = status.HTTP_200_OK
            else:
                res_status = status.HTTP_200_OK
                res_data = {'verified': True, 'email': pk}
        else:
            res_status = status.HTTP_400_BAD_REQUEST
        return Response(res_data, res_status)

    @staticmethod
    def post(request, *args, **kwargs):
        """
        Method which receive email and code to account verification
        """
        res_data = {}
        res_status = status.HTTP_401_UNAUTHORIZED
        data_email = request.data['email']
        data_code = request.data['code']
        print(request.data)
        # Account.objects.get()
        email = EmailAddress.objects.get(email=data_email)
        if email is not None:
            if not email.verified:
                # check if email is sent
                confirmation_query = EmailConfirmation.objects.filter(email_address_id=email.id)
                confirmations = list(confirmation_query)
                if len(confirmations) > 0:
                    confirmation = confirmations[0]
                    if confirmation.key == data_code:
                        eas = EmailAddressSerializer(email, {'verified': 1}, partial=True)
                        if eas.is_valid():
                            # set account verified and delete confirmation
                            confirmation_query.delete()
                            eas.save()
                        else:
                            print(eas.error_messages)
                        res_status = status.HTTP_202_ACCEPTED
                    else:
                        res_data = {'code': ["Código inválido"]}
                        res_status = status.HTTP_400_BAD_REQUEST
                else:
                    res_status = status.HTTP_204_NO_CONTENT
        else:
            res_status = status.HTTP_400_BAD_REQUEST
            res_data = {'error': ['Email no encontrado']}
        return Response(res_data, res_status)
