import re

from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...models import GraduateProfile, Account


class GraduateList(views.APIView):
    """
    View to get all graduate in a list
    * Requires user to be authenticated and staff
    * Route '/staff/graduate-list/'
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get_status(current_status):
        if current_status == "STATUS_02":
            return ['STATUS_02', 'STATUS_03', 'STATUS_01', 'STATUS_00']
        elif current_status == "STATUS_06":
            return ['STATUS_06', 'STATUS_07', 'STATUS_08', 'STATUS_09']
        elif current_status == "STATUS_10":
            return ['STATUS_09', 'STATUS_10']
        else:
            return [current_status]

    def get(self, request, *args, **kwargs):
        user = request.user
        # only staff can get all graduate data
        if user.is_staff is True:
            # get graduate profile data
            profiles_queryset = GraduateProfile.objects.all()
            list_profile = list(
                profiles_queryset.values('enrollment', 'first_name', 'last_name','career', 'status', 'accurate_docs', 'account_id'))
            list_graduate = []
            # for graduate in list_profile:
            #     # get graduate account data
            #     account_queryset = Account.objects.filter(id=graduate['account_id'], user_type="USER_GRADUATE")
            #     account = list(account_queryset.values('first_name', 'last_name'))[0]
            #     # merge profile and account data
            #     account.update(graduate)
            #     # add to global list graduate
            #     list_graduate.append(account)

            return Response(list_profile, status=status.HTTP_200_OK, content_type='application/json')
        return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request, *args, **kwargs):
        user = request.user
        if user.is_staff:
            filter_career = request.data['career']  # career filter
            filter_status = request.data['status']  # status filter
            search = request.data['search']  # enrollment or name filter

            # get filter by career and status
            if filter_career is not None and filter_status is not None:
                profiles_queryset = GraduateProfile.objects.filter(career=filter_career,
                                                                   status__in=self.get_status(filter_status))
            # get filter by only career
            elif filter_career is not None:
                profiles_queryset = GraduateProfile.objects.filter(career=filter_career)
            # get filter by only status
            elif filter_status is not None:
                profiles_queryset = GraduateProfile.objects.filter(status__in=self.get_status(filter_status))
            # get all data
            else:
                profiles_queryset = GraduateProfile.objects.all()

            # if enrollment or name is set in request
            # set search type
            search_type = None
            if len(search) > 0:
                if search.isnumeric():
                    search_type = "enrollment"
                else:
                    search_type = "name"

            # create a list with only required profile fields
            list_profile = list(
                profiles_queryset.values('enrollment', "first_name", 'last_name', 'career', 'status', 'accurate_docs', 'account_id'))
            # make a list to merge profile and account fields
            list_graduate = []
            # on each graduate
            for graduate in list_profile:
                # default True: the data is filtered correct
                isvalid = True
                # when search type is name, get the name and matches with search
                if search_type == "name":
                    all_name = graduate['first_name'] + " " + graduate['last_name']
                    if re.match(search.lower(), all_name.lower()) is None:
                        # if is not matching, the data is don't added to list
                        isvalid = False
                # when search type is enrollment, get the profile enrollment and matches with search
                elif search_type == "enrollment":
                    if re.match(search, str(graduate['enrollment'])) is None:
                        # if is not matching, the data is don't added to list
                        isvalid = False
                if isvalid:
                    # add graduate into list graduate
                    list_graduate.append(graduate)
            return Response(list_graduate, status=status.HTTP_200_OK, content_type='application/json')
        return Response(None, status=status.HTTP_405_METHOD_NOT_ALLOWED)