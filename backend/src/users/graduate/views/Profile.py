from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..serializers import ProfileSerializer
from ...models import GraduateProfile


class Profile(viewsets.ModelViewSet):
    """
    View to get or update the graduate profile
    * Requires user authenticated
    * Route '/graduate/profile/'
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = ProfileSerializer
    queryset = GraduateProfile.objects.all()

    def get_queryset(self):
        user = self.request.user
        return GraduateProfile.objects.filter(account_id=user)

    # don't needed, only for reference
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        # print(serializer)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        return Response(serializer.data)
