from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class Account(AbstractUser):
    """
        User model to all accounts
    """
    username = None
    first_name = None
    last_name = None

    email = models.EmailField(_('email address'), unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    user_type = models.CharField(blank=True, max_length=20)

    def __str__(self):
        return self.email
