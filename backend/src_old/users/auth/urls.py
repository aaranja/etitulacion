from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'', views.AccountViewSet, basename='user')

urlpatterns = [
    path('', views.CustomObtainAuthToken.as_view()),
    path('registration/graduate/', views.CustomRegister.as_view()),
    path('registration/staff/', views.StaffRegister.as_view()),
    path('confirm-email/', views.CustomEmailVerification.as_view()),
    # path('rest-auth/registration/account-confirm-email/', null_view, name='account_confirm_email'),
]
urlpatterns += router.urls
