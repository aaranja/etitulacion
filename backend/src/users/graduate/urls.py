from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import GraduateProfileViewSet, UploadFileView, StatusView, TitulationTypeView, NotificationsView, \
    InformationView, ProcedureHistoryView, DocumentsFileView, ARPInfoView

router = DefaultRouter()
router.register(r'account', GraduateProfileViewSet, basename='profile')

urlpatterns = [
    path('notifications/', NotificationsView.as_view()),
    path('profile/', InformationView.as_view()),
    path('profile/documents/<keyname>/', DocumentsFileView.as_view()),
    path('profile/documents/', UploadFileView.as_view()),
    path('profile/status/', StatusView.as_view()),
    path('profile/titulation-type/', TitulationTypeView.as_view()),
    path('profile/procedure/history/', ProcedureHistoryView.as_view()),
    path('profile/arp-info/', ARPInfoView.as_view())
]

urlpatterns += router.urls
