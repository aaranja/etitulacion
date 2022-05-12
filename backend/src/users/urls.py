from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CustomObtainAuthToken, GraduateRegister, EmailVerification

router = DefaultRouter()

urlpatterns = [

    path('authenticate', CustomObtainAuthToken.as_view()),

    path('registration/graduate', GraduateRegister.as_view()),
    path('registration/email-confirmation/check=<pk>', EmailVerification.as_view()),
    path('registration/email-confirmation', EmailVerification.as_view())
    # path('rest-auth/registration/account-confirm-email/', null_view, name='account_confirm_email'),
]
urlpatterns += router.urls
