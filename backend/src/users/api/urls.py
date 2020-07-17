from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, GraduateProfileViewSet

router = DefaultRouter()
router.register(r'account', GraduateProfileViewSet, basename='profile')
router.register(r'', AccountViewSet, basename='user')
urlpatterns = router.urls

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
