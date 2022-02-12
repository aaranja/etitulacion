from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AccountViewSet, StaffRegisterView, CustomObtainAuthToken

router = DefaultRouter()
router.register(r'', AccountViewSet, basename='user')

urlpatterns = [
    path('staff-register/', StaffRegisterView.as_view()),
    path('authenticate/', CustomObtainAuthToken.as_view()),
]
urlpatterns += router.urls
