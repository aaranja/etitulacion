from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TitulationView

router = DefaultRouter()

urlpatterns = [
	path('process/4/titulation/types/', TitulationView.as_view()),
]

urlpatterns += router.urls