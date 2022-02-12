from django.db import models


# Create your models here.
# clasification 1 > school services 
# clasification 2 > coordination
# clasification 3 > both
# clasification 0 > upload by system

class DocumentsDetails(models.Model):
    key = models.AutoField(primary_key=True, unique=True, blank=False)
    keyName = models.CharField(max_length=10, blank=True)
    fullName = models.CharField(max_length=130, blank=False)
    description = models.CharField(max_length=252, blank=False)
    required = models.BooleanField(default=True)
    clasification = models.IntegerField(blank=False)
