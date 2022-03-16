from django.db import models


# Create your models here.
class TitulationTypes(models.Model):
    name = models.CharField(max_length=120, blank=False, null=False)
    academic_year = models.CharField(max_length=30)


class InstituteData(models.Model):
    institute = models.CharField(max_length=254, blank=True, default="Ensenada")
    code = models.CharField(max_length=30, blank=True)
    city = models.CharField(max_length=254, blank=True)
    services_lead = models.CharField(max_length=254, blank=True)
    director = models.CharField(max_length=254, blank=True)
