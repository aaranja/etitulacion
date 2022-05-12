from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TitulationView, InstituteView

router = DefaultRouter()

urlpatterns = [
    path('process/4/titulation/types/', TitulationView.as_view()),
    path('settings/institute/', InstituteView.as_view()),
]

urlpatterns += router.urls
