from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from ..serializers import AccountSerializer
from rest_framework.permissions import IsAuthenticated

from ...models import Account


class AccountViewSet(viewsets.ModelViewSet):
    """
    View to get user account after login
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = AccountSerializer
    queryset = Account.objects.all()

    # return all own data for authenticated user
    # superuser true get all data
    # superuser false get own data
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Account.objects.all()
        return Account.objects.filter(id=user.id)

    def get_object(self):
        obj = get_object_or_404(Account.objects.filter(id=self.kwargs["pk"]))
        # obj = get_object_or_404(Account.objects.filter(id=16760256))
        self.check_object_permissions(self.request, obj)
        return obj