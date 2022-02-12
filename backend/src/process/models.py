from django.db import models

# Create your models here.
class TitulationTypes(models.Model):
    name = models.CharField(max_length=120, blank=False, null=False)
    academic_year = models.CharField(max_length=30)

