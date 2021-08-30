from rest_framework import serializers
from users.models import Account, GraduateProfile
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate

# Class to get the auth token from an authenticated account through email
class CustomAuthTokenSerializer(serializers.Serializer):
	email = serializers.EmailField(
			label = _("Email"),
			write_only = True
		)
	password = serializers.CharField(
		label=_("Password"),
		style={'input_type': 'password'},
		trim_whitespace=False,
		write_only=True
	)

	token = serializers.CharField(
		label=_("Token"),
		read_only=True
	)

	def authenticate(self, **kwargs):
		return authenticate(self.context['request'], **kwargs)

	def _validate_email(self, email, password):
		user = None

		if email and password:
			user = self.authenticate(email=email, password=password)
		else:
			msg = _('Must include "email" and "password".')
			raise exceptions.ValidationError(msg)

		return user

	def validate(self, attrs):
		email = attrs.get('email')
		password = attrs.get('password')

		if email and password:
			user = self._validate_email(email, password)
			if not user:
				msg = _('Unable to log in with provided credentials.')
				raise serializers.ValidationError(msg, code='authorization')
		else:
			msg = _('Must include "email" and "password".')
			raise serializers.ValidationError(msg, code='authorization')
		
		attrs['user'] = user
		return attrs

class AccountSerializer(serializers.ModelSerializer):
	class Meta:
		model = Account
		fields = ['id','email','first_name','last_name','user_type',]
		extra_kwargs = {
			'email': {'read_only': True},
			'user_type': {'read_only': True}
		}

class StatusSerializer(serializers.ModelSerializer):
	status = serializers.CharField()
	class Meta:
		model = GraduateProfile
		fields = ['status']

	def validate_status(self, status, *args, **kwargs):
		print(status)
		return status

	def update(self, instance, validated_data):
		instance.status = validated_data.get('status', instance.status)
		instance.save()
		return instance

class DocumentsSerializer(serializers.ModelSerializer):
	documents = serializers.JSONField()
	update_type = serializers.CharField()

	class Meta:
		model = GraduateProfile
		fields = ['documents','update_type']
	
	def validate_documents(self, documents, *args, **kwargs):
		prevDoc = self._args[0].documents
		newDoc = documents[0]
		
		if(newDoc['status']== "removed"):
			# delete a document
			for i in range(len(prevDoc)):
				index = i-1
				currentDoc = prevDoc[index]
				if(currentDoc['key'] == newDoc['key']):
					prevDoc.pop(index)
		else:
			Replaced = False
			for i in range(len(prevDoc)):
				index = i-1
				if(prevDoc[index]['key'] == newDoc['key']):
					# replace a document
					Replaced = True
					prevDoc[index] = newDoc
			if(not Replaced):
				# add new document
				prevDoc.append(newDoc)
		return prevDoc

	def validate_update_type(self, update_type, *args, **kwargs):
		return update_type

	def validate(self, data):
		return data

	def update(self, instance, validated_data):

		# print(validated_data)
		instance.documents = validated_data.get('documents', instance.documents)
		instance.save()
		return instance

class ProfileSerializer(serializers.ModelSerializer):
	account = AccountSerializer()
	class Meta:
		model = GraduateProfile

		fields = [
			'enrollment', 
			'career', 
			'gender', 
			'titulation_type', 
			'status', 
			'accurate_docs',
			'account', 
			'documents'
		]

		extra_kwargs = {
			'accurate_docs': {'read_only': True},
			'enrollment': {'read_only':True},
		}

	# validate all documents propierties
	def validate_documents(self, documents, *args, **kwargs):
		print(self._args[0].documents)
		return documents

	def validate_status(self,status, *args, **kwargs):
		print(status)
		return status

	def update(self, instance, validated_data):
		
		print("entrando a update")
		account_data = validated_data.pop('account')
		account = (instance.account)
		
		instance.enrollment = validated_data.get('enrollment', instance.enrollment)
		instance.career = validated_data.get('career', instance.career)
		instance.gender = validated_data.get('gender', instance.gender)
		instance.titulation_type = validated_data.get('titulation_type', instance.titulation_type)
		instance.status = validated_data.get('status', instance.status)
		instance.accurate_docs = validated_data.get('accurate_docs', instance.accurate_docs)
		instance.documents = validated_data.get('documents', instance.documents)
		instance.account = validated_data.get('account', instance.account)
		
		instance.save()

		account.first_name = account_data.get('first_name', account.first_name)
		account.last_name = account_data.get('last_name', account.last_name)
		# the email can't be changed, account serializer email field is read_only
		# account.email = account_data.get('email', account.email)
		account.save()
		return instance	

class TokenSerializer(serializers.ModelSerializer):
	class Meta:
		model = Token
		fields = ['key', 'user']

class RegisterSerializer(serializers.Serializer):
	# account data
	email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
	first_name = serializers.CharField(required=True, write_only=True)
	last_name = serializers.CharField(required=True, write_only=True)
	user_type = serializers.CharField(required=True, write_only=True)
	password1 = serializers.CharField(required=True, write_only=True)
	password2 = serializers.CharField(required=True, write_only=True)
	# profile data
	enrollment = serializers.CharField(required=True, write_only=True)
	career = serializers.CharField(required=True, write_only=True)
	gender = serializers.CharField(required=True)

	def validate_email(self, email):
		email = get_adapter().clean_email(email)
		if allauth_settings.UNIQUE_EMAIL:
			if email and email_address_exists(email):
				raise serializers.ValidationError(
					_("A user is already registered with this e-mail address."))
		return email

	def validate_enrollment(self, enrollment):
		# check if enrollment is unique
		return enrollment

	def validate_user_type(self, user_type):
		# set user as Egresado
		return "USER_GRADUATE"

	def validate_career(self, career):
		# check if career is valid
		return career
	def validate_gender(self, gender):
		# check if gender is valid
		return gender

	def validate_password1(self, password):
		return get_adapter().clean_password(password)

	def validate(self, data):
		if data['password1'] != data['password2']:
			raise serializers.ValidationError(
				_("The two password fields didn't match."))
		return data

	def get_cleaned_data(self):
		return {
			'first_name': self.validated_data.get('first_name', ''),
			'last_name': self.validated_data.get('last_name', ''),
			'password1': self.validated_data.get('password1', ''),
			'email': self.validated_data.get('email', ''),
			'user_type': self.validated_data.get('user_type',''),
			'enrollment': self.validated_data.get('enrollment',''),
			'career': self.validated_data.get('career',''),
			'gender': self.validated_data.get('gender',''),
		}

	def save(self, request):
		print("entrando a registro")
		# create and save account
		new_account = Account(
			email=request.data['email'],
			first_name=request.data['first_name'],
			last_name=request.data['last_name'],
			user_type=request.data['user_type'], 
			)
		new_account.set_password(request.data['password1'])
		new_account.save()

		# create a new profile
		new_profile = GraduateProfile(
			enrollment=request.data['enrollment'],
			career=request.data['career'],
			gender=request.data['gender'],
			status="STATUS_00",
			)

		# make a default documents properties
		
		documents = []
		
		# save documents and account on new profile
		new_profile.documents = documents
		new_profile.account = new_account
		new_profile.save()

		# adapter = get_adapter()
		# user = adapter.new_user(request)
		# self.cleaned_data = self.get_cleaned_data()
		# adapter.save_user(request, user, self)
		# setup_user_email(request, user, [])
		# #user.save()
		return new_account