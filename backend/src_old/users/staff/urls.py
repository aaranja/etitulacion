from django.urls import path

from .views import GraduateList, GraduateDossier, GraduateFile, SettingsSignature, InaugurationGroup, ARPGroup, \
    Rubricator, AEPGeneration, GraduateLiberation

urlpatterns = [
    path('services/settings/signature/<id>/', SettingsSignature.as_view()),
    path('services/settings/signature/', SettingsSignature.as_view()),
    path('services/aep-graduate/', AEPGeneration.as_view(), ),
    path('services/aep-liberation/', GraduateLiberation.as_view()),
    # path('services/settings/account-details/', ServicesSettingsAccount.as_view()),
    path('graduate-data/<pk>/', GraduateDossier.as_view()),
    path('graduate-list/', GraduateList.as_view()),
    path('graduate-data/<pk>/documents/<keyname>/', GraduateFile.as_view()),
    path('coordination/group-date/', InaugurationGroup.as_view(), ),
    path('coordination/arp-group/', ARPGroup.as_view(), ),
    path('coordination/arp-staff/', Rubricator.as_view(), ),
]
