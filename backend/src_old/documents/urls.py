from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import DocumentsView

router = DefaultRouter()

urlpatterns = [
	path('procedure/documents-metadata/', DocumentsView.as_view()),
]

urlpatterns += router.urls