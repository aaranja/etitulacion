from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from users.api.serializers import CustomAuthTokenSerializer
from rest_framework.permissions import AllowAny

class CustomObtainAuthToken(ObtainAuthToken):
	permission_classes = (AllowAny,)
	serializer_class = CustomAuthTokenSerializer

	def post(self, request, *args, **kwargs):
		serializer = self.serializer_class(data=request.data, context={'request': request})
		serializer.is_valid(raise_exception=True)
		user = serializer.validated_data['user']
		token, created = Token.objects.get_or_create(user=user)
		print("Sesión iniciada por: "+user.email)
		return Response({
			'token': token.key,
			'user_id': user.pk,
			'user_type': user.user_type,
			})