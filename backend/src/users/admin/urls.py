from django.urls import path

from .views import AccountDetailsView

urlpatterns = [
    path('site/account-details/', AccountDetailsView.as_view())
]