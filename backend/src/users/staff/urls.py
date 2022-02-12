from django.urls import path

from .views import GraduateDossierView, GraduateListView, GraduateFileView, \
    ServicesSettings, ServicesSettingsAccount, GroupDateView \
    , ARPStaffView, ARPGroupView, AEPView, LiberationView

urlpatterns = [
    path('services/settings/signature/<id>/', ServicesSettings.as_view()),
    path('services/settings/signature/', ServicesSettings.as_view()),
    path('services/settings/account-details/', ServicesSettingsAccount.as_view()),
    path('graduate-data/<pk>/', GraduateDossierView.as_view()),
    path('graduate-list/', GraduateListView.as_view()),
    path('graduate-data/<pk>/documents/<keyname>/', GraduateFileView.as_view()),
    path('coordination/group-date/', GroupDateView.as_view(), ),
    path('coordination/arp-group/', ARPGroupView.as_view(), ),
    path('coordination/arp-staff/', ARPStaffView.as_view(), ),
    path('services/aep-graduate/', AEPView.as_view(), ),
    path('services/aep-liberation/', LiberationView.as_view())

]
