from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import DocumentsView

router = DefaultRouter()

urlpatterns = [
	path('process/2/documents/descriptions/', DocumentsView.as_view()),
]

urlpatterns += router.urls