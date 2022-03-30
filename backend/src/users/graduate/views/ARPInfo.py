from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...models import GraduateProfile, Account, DateGroup, ARPData, ARPStaff


class ARPInfo(views.APIView):
    """
    View to get the ARP info
    * Requires user is authenticated
    * Route '/graduate/profile/arp-info/'
    """
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = self.request.user
        res_response = None
        res_status = status.HTTP_401_UNAUTHORIZED
        if user.user_type == "USER_GRADUATE":
            dateInfo = {}
            profile_queryset = GraduateProfile.objects.filter(account_id=user).values('enrollment', 'i_date', 'career',
                                                                                      'titulation_type', 'cellphone')
            profile = list(profile_queryset)[0]
            # get account data
            account_queryset = Account.objects.filter(id=user.id).values('email', 'first_name', 'last_name', )
            account = list(account_queryset)[0]
            account.update(profile)
            account['key'] = user.id

            # get date data
            if profile['i_date'] is not None:
                date_group = DateGroup.objects.filter(id=profile['i_date'])
                date = list(date_group.values())[0]
                dateInfo.update(date)
                # get arp data
                if date['arp_generated']:
                    arp_query = ARPData.objects.filter(graduate=profile['enrollment'])
                    arp_data = list(arp_query.values())[0]
                    staff_data = []
                    a_subset = {key: arp_data[key] for key in ['president_id', 'secretary_id', 'vocal_id']}
                    for staff in a_subset:
                        if a_subset[staff] is not None:
                            arp_query = ARPStaff.objects.filter(key=a_subset[staff]).values()
                            data = list(arp_query)[0]
                            data['role'] = staff
                            staff_data.append(data)
                        else:
                            print("vacio")
                    account.update({'staffData': staff_data})
                    account.update(arp_data)
                else:
                    print("datos arp no generados")

            else:
                dateInfo.update({'date': None})
            dateInfo.update({'arpData': account})
            res_response = {'dateInfo': dateInfo}
            res_status = status.HTTP_200_OK

        return Response(res_response, res_status)