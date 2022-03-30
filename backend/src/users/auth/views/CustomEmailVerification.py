from allauth.account.models import EmailAddress, EmailConfirmation
from django.utils import timezone
from rest_framework import views, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .CustomEmailConfirmation import CustomEmailConfirmation
from ..serializers import EmailConfirmationSerializer, EmailAddressSerializer


class CustomEmailVerification(views.APIView):
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
    def get(request, *args, **kwargs):
        """
        Return if email is verified and start a verification if it is not
        """
        res_data = {}
        res_status = status.HTTP_401_UNAUTHORIZED
        user = request.user

        email_query = EmailAddress.objects.filter(email=user.email)
        email = list(email_query)[0]
        if email is not None:
            if not email.verified:
                email_confirmate = CustomEmailConfirmation
                # check if email is sent
                confirmation_query = EmailConfirmation.objects.filter(email_address_id=email.id)
                confirmations = list(confirmation_query)
                if len(confirmations) == 0:
                    # send confirmation email
                    now = timezone.now()
                    sent_time = now.strftime("%Y-%m-%d %H:%M:%S")
                    code = email_confirmate.otp_mail(user)
                    data = {
                        'sent': sent_time,
                        'key': code,
                        'email_address': email.id,
                    }
                    econfirmation_serializer = EmailConfirmationSerializer(None, data)
                    if econfirmation_serializer.is_valid():
                        res_data['email'] = email.values()
                        res_data['sent'] = sent_time
                        econfirmation_serializer.save()
                        res_status = status.HTTP_200_OK
                    else:
                        print(econfirmation_serializer.errors)
                else:
                    # get code expire time
                    print("ya ha una código")
                    print(email.email)
                    res_data['email'] = email.email
                    res_data['sent'] = confirmations[0].sent
                    res_status = status.HTTP_200_OK
        else:
            res_status = status.HTTP_400_BAD_REQUEST
        return Response(res_data, res_status)

    @staticmethod
    def post(request, *args, **kwargs):
        res_data = {}
        res_status = status.HTTP_401_UNAUTHORIZED
        data_email = request.data['email']
        data_code = request.data['code']
        email_query = EmailAddress.objects.filter(email=data_email)
        email = list(email_query)[0]
        if email is not None:
            if not email.verified:
                # check if email is sent
                confirmation_query = EmailConfirmation.objects.filter(email_address_id=email.id)
                confirmations = list(confirmation_query)
                if len(confirmations) > 0:
                    confirmation = confirmations[0]
                    if confirmation.key == data_code:
                        eas = EmailAddressSerializer(email,{'verified': 1}, partial=True )
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
        return Response(res_data, res_status)