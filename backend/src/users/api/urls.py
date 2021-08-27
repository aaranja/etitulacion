from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, GraduateProfileViewSet, UploadDocumentsView, FilesView, VerifyInformationView

router = DefaultRouter()
router.register(r'account', GraduateProfileViewSet, basename='profile')
router.register(r'documents', UploadDocumentsView, basename='documents')
# router.register(r'process/1', VerifyInformationView, basename='process_1')
router.register(r'', AccountViewSet, basename='user')

urlpatterns = [
	path(r'<pk>/upload/', FilesView.as_view()),
	path('process/1/<pk>/', VerifyInformationView.as_view()),
]
# from .views import (
#     AccountListView,
#     AccountDetailView,
#     AccountCreateView,
#     AccountDeleteView,
#     AccountUpdateView
# )

# urlpatterns = [
#     path('', AccountListView.as_view()),
#     path('create/', AccountCreateView.as_view()),
#     path('<pk>', AccountDetailView.as_view()),
#     path('<pk>/delete/', AccountDeleteView.as_view()),
#     path('<pk>/update/', AccountUpdateView.as_view()),
# ]

urlpatterns += router.urls