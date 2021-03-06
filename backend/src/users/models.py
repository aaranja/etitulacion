from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
from .managers import AccountManager

class Account(AbstractUser):
	# remove username field
	username = None
	# the email is required and unique
	email = models.EmailField(_('email address'), unique=True)
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = []

	# all object are provided from CustomUserManager
	objects = AccountManager()
	type_user = models.CharField(blank=True, max_length=15)
	
	def __str__(self):
		return self.email

class GraduateProfile(models.Model):
	enrollment = models.IntegerField(primary_key=True, unique=True, blank=False)
	career = models.CharField(max_length=30, blank=True)
	gender = models.CharField(max_length=10, blank=True)
	titulation_type = models.CharField(max_length=30, blank=True, null=True)
	status = models.CharField(max_length=30, blank=True, null=True)
	accurate_docs = models.BooleanField(default=False)
	account = models.OneToOneField(Account,on_delete=models.CASCADE, related_name="account") # relational with Perfil model