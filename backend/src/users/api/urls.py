from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, GraduateProfileViewSet, UploadFileView, VerifyInformationView, StatusView

router = DefaultRouter()
router.register(r'account', GraduateProfileViewSet, basename='profile')
router.register(r'', AccountViewSet, basename='user')

urlpatterns = [
	path('process/1/<pk>/', VerifyInformationView.as_view()),
	path('process/2/upload/files/', UploadFileView.as_view()),
	path('graduate/profile/status/', StatusView.as_view()),

]

urlpatterns += router.urls