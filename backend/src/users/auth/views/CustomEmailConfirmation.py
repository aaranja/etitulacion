import random
from django.core.mail import send_mail
from django.template.loader import get_template
from django.utils import timezone

from ..serializers import EmailAddressSerializer, EmailConfirmationSerializer


class CustomEmailConfirmation:
    @staticmethod
    def otp_mail(user):
        global no
        # send_mail('Código OTP de verificación', 'Tu código OTP es {}'.format(no), user.email, [user.email])
        no = random.randrange(100000, 999999)

        subject = '[itetitulacion.com] Código de verificación'
        message = 'Este correo es generado automáticamente por el sistema ' \
                  'de titulación del Instituto Tecnológico de Ensenada.'
        from_email = 'flyordief@gmail.com'
        to = [user.email]

        # fs = FileSystemStorage(location='templates/')

        html_msg = get_template("verification_email.html").render(
            {
                'email': user.email,
                'code': '{}'.format(no),
            })

        send_mail(subject, message, from_email, to, fail_silently=True, html_message=html_msg)
        return no

    @staticmethod
    def email_no_verified(user):
        user_id = int(user.id)
        print({'user_id': user_id})
        data = {
            'email': user.email,
            'verified': 0,
            'primary': 0,
            'user': user_id,
        }
        serializer = EmailAddressSerializer(None, data)
        if serializer.is_valid():
            serializer.save()
            email_id = serializer.data.get('id')
            print("id creado ", email_id)
            return email_id
        else:
            print(serializer.errors)

    @staticmethod
    def store_code(email_id, code):
        # send confirmation email
        now = timezone.now()
        sent_time = now.strftime("%Y-%m-%d %H:%M:%S")
        data = {
            'sent': sent_time,
            'key': code,
            'email_address': email_id,
        }
        econfirmation_serializer = EmailConfirmationSerializer(None, data)
        if econfirmation_serializer.is_valid():
            econfirmation_serializer.save()
            return sent_time
        else:
            print(econfirmation_serializer.errors)
            return None