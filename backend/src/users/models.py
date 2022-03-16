from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import AccountManager


class Account(AbstractUser):
    """
    Account model to all users auth
    """
    # remove username field
    username = None
    # the email is required and unique
    email = models.EmailField(_('email address'), unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # all object are provided from CustomUserManager
    objects = AccountManager()
    user_type = models.CharField(blank=True, max_length=15)

    def __str__(self):
        return self.email


class DateGroup(models.Model):
    """
    Model to group together the ARP of graduates
    """
    date = models.DateTimeField(editable=True)
    no_graduate = models.IntegerField(default=0)
    confirmed = models.BooleanField(default=False)
    arp_complete = models.BooleanField(default=False)
    arp_generated = models.BooleanField(default=False)

    def __str__(self):
        return self.id


class GraduateProfile(models.Model):
    """
    Profile model with all data of graduate and documents information
    """
    enrollment = models.IntegerField(primary_key=True, unique=True, blank=False)
    career = models.CharField(max_length=30, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    cellphone = models.CharField(blank=True, default=None, max_length=10)
    titulation_type = models.CharField(max_length=120, blank=True, null=True)
    status = models.CharField(max_length=30, blank=True, null=True)
    accurate_docs = models.BooleanField(default=False)
    documents = models.JSONField(blank=True, default=list)
    i_date = models.ForeignKey(
        DateGroup, on_delete=models.SET_NULL,
        default=None,
        related_name="i_date",
        null=True,
        blank=True,
        editable=True,
    )
    account = models.OneToOneField(
        Account,
        on_delete=models.CASCADE,
        related_name="account")


class GraduateDocuments(models.Model):
    """
    Documents model for aep metadata
    """
    key = models.AutoField(primary_key=True, unique=True, blank=False)
    keyName = models.CharField(max_length=8, blank=False)
    name = models.CharField(max_length=120, blank=False)
    fileName = models.CharField(max_length=254, blank=False)
    status = models.CharField(max_length=30, blank=True, null=True)
    url = models.CharField(max_length=254, blank=False)
    lastModifiedDate = models.DateTimeField(editable=True)
    enrollment = models.ForeignKey(GraduateProfile, on_delete=models.CASCADE, related_name="document_id")


class GraduateNotifications(models.Model):
    """
    Notification model about process state of graduate
    """
    time = models.DateTimeField(editable=False)
    sender = models.CharField(max_length=120, blank=False)
    type = models.CharField(max_length=30, default="Default")
    message = models.CharField(max_length=254, blank=False)
    enrollment = models.ForeignKey(GraduateProfile, on_delete=models.CASCADE, related_name="enrollment_id")


class GraduateProcedureHistory(models.Model):
    """
    Process model about the history procedure
    """
    time = models.DateTimeField(editable=False)
    information = models.CharField(max_length=254, blank=False)
    last_status = models.CharField(max_length=30, blank=True, null=True)
    enrollment = models.ForeignKey(GraduateProfile, on_delete=models.CASCADE, related_name="history_id")


class ARPStaff(models.Model):
    """
    Model to represent the person on graduate ARP DATA
    """
    key = models.AutoField(primary_key=True, unique=True, blank=False)
    id_card = models.IntegerField(unique=True, blank=False)
    full_name = models.CharField(max_length=254, blank=True)
    profession = models.CharField(max_length=254, blank=True)
    role = models.CharField(max_length=25, blank=True)


class ARPGroup(models.Model):
    """
    Model to group together the ARP of graduates
    """
    gen_date = models.DateTimeField(editable=True)
    date = models.DateTimeField(editable=True, null=True)
    confirmed = models.BooleanField(default=False)
    complete = models.BooleanField(default=False)


class ARPData(models.Model):
    key = models.AutoField(primary_key=True, unique=True, blank=False)
    record_book = models.IntegerField(blank=True, null=True)
    record_page = models.IntegerField(blank=True, null=True)
    institute = models.CharField(max_length=254, blank=True)
    project_name = models.CharField(max_length=254, blank=True)
    int_assessor_name = models.CharField(max_length=254, blank=True)
    president = models.ForeignKey(ARPStaff, on_delete=models.SET_NULL, null=True, blank=True,
                                  related_name="president")
    secretary = models.ForeignKey(ARPStaff, on_delete=models.SET_NULL, null=True, blank=True,
                                  related_name="secretary")
    vocal = models.ForeignKey(ARPStaff, on_delete=models.SET_NULL, null=True, blank=True,
                              related_name="vocal")
    graduate = models.OneToOneField(GraduateProfile, on_delete=models.CASCADE, related_name="graduate")


class ServicesSignature(models.Model):
    lastModifiedDate = models.DateTimeField(editable=False)
    name = models.CharField(max_length=256, blank=False)
    upload_account = models.OneToOneField(Account, blank=True, null=True, on_delete=models.SET_NULL)
