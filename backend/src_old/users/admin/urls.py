from django.urls import path

from .views import AccountDetailsView

urlpatterns = [
    path('site/account-details/', AccountDetailsView.as_view()),
    path('site/account-details/<int:pk>/', AccountDetailsView.as_view())
]
