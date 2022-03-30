from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import Profile, UploadFile, Status, TitulationType, Notifications, \
    Information, ProcedureHistory, DocumentsFile, ARPInfo

router = DefaultRouter()
router.register(r'account', Profile, basename='profile')

urlpatterns = [
    path('notifications/', Notifications.as_view()),
    path('profile/', Information.as_view()),
    path('profile/documents/<keyname>/', DocumentsFile.as_view()),
    path('profile/documents/', UploadFile.as_view()),
    path('profile/status/', Status.as_view()),
    path('profile/titulation-type/', TitulationType.as_view()),
    path('profile/procedure/history/', ProcedureHistory.as_view()),
    path('profile/arp-info/', ARPInfo.as_view())
]

urlpatterns += router.urls
