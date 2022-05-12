import json

from django.http import HttpResponse
from rest_framework import views, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


from process.models import InstituteData
from ..serializers import DocumentsSerializer
from ...models import GraduateProfile, ARPData, Account, DateGroup, GraduateDocuments, ARPStaff
from ..careerTypes import get_career
from ..generate_aep import AEPpdf
from ...graduate.documents import Files


class AEPGeneration(views.APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request, *args, **kwargs):
        user = request.user
        res_data = {'aepGraduate': None}
        res_status = status.HTTP_401_UNAUTHORIZED
        if user.is_staff:
            enrollment = request.query_params.get('enrollment')
            profile_query = GraduateProfile.objects.filter(enrollment=enrollment)
            profile = list(profile_query.values(
                'enrollment',
                'career',
                'titulation_type',
                'i_date',
                'account'
            ).all())[0]
            if profile['i_date'] is not None:
                # get arp data
                arp_queryset = ARPData.objects.filter(graduate_id=profile['enrollment'])
                arp_list = list(arp_queryset.values().all())[0]
                profile.update(arp_list)
                # get account data
                account_queryset = Account.objects \
                    .filter(id=profile['account']) \
                    .values('email', 'first_name',
                            'last_name')
                account = list(account_queryset)[0]
                profile.update(account)
                profile['key'] = profile['account']

                # get date data
                date_queryset = DateGroup.objects.filter(id=profile['i_date'])
                date = list(date_queryset.values('date'))[0]
                profile.update(date)

                # get institute data
                inst_queryset = InstituteData.objects.all()
                if len(inst_queryset) == 0:
                    institute = {}
                else:
                    institute = list(inst_queryset.values('code', 'city', 'services_lead', 'director'))[0]
                profile.update(institute)

                # aep document
                doc_queryset = GraduateDocuments.objects.filter(keyName="AEP", enrollment=profile['enrollment'])
                aep_document = None
                if doc_queryset.exists():
                    aep_document = list(doc_queryset.values())[0]
                else:
                    print("no existe aep file")
                profile['aepDocument'] = aep_document
                res_data = {'aepGraduate': profile}
                res_status = status.HTTP_200_OK
        return Response(res_data, res_status)

    @staticmethod
    def post(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = {'aepDocument': None}
        if user.is_staff:
            aep_data = request.data['aepData']
            # check is all field has been filled
            valid = True
            for field in aep_data:
                if aep_data[field] is None or aep_data[field] == "":
                    valid = False
                else:
                    if field == "career":
                        aep_data[field] = get_career(aep_data[field])
                    elif field == "president_id" or field == "secretary_id" or field == "vocal_id":
                        staff = ARPStaff.objects.filter(key=aep_data[field])
                        aep_data[field] = list(staff.values("id_card", "full_name", "profession"))[0]
            if valid:
                aep_doc = AEPpdf(aep_data)
                aep_doc.generate()
                file = Files.get("preAEP", str(aep_data['enrollment']))
                if file is not None:
                    return HttpResponse(file, status=status.HTTP_200_OK, content_type='application/pdf', )
        return Response(res_data, res_status)

    @staticmethod
    def patch(request):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = {'aepDocument': None}
        if user.is_staff:
            aep_data = request.data

            metadata = json.loads(aep_data['data'])
            enrollment = aep_data['graduate']
            file = aep_data['file']
            graduate = GraduateProfile.objects.get(enrollment=enrollment)
            # print(metadata)
            print("archivo ", file)
            document_metadata = {
                'keyName': 'AEP',
                'name': 'Acta de Examen Profesional',
                'fileName': metadata['name'],
                'status': 'done',
                'url': '/AEP/',
                'lastModifiedDate': metadata['lastModified'],
                'enrollment': graduate.enrollment,
                'graduate_status': {
                    'status': graduate.status
                }
            }

            doc_queryset = GraduateDocuments.objects.filter(keyName="AEP", enrollment=graduate.enrollment).first()
            doc_serializer = DocumentsSerializer(doc_queryset, document_metadata)
            if doc_serializer.is_valid():
                files = Files()
                files.save(file, "AEP", graduate.enrollment)
                doc_serializer.save()
                res_status = status.HTTP_200_OK
            else:
                print(doc_serializer.errors)

        return Response(res_data, res_status)

    @staticmethod
    def delete(request, *args, **kwargs):
        user = request.user
        res_status = status.HTTP_401_UNAUTHORIZED
        res_data = {'aepDocument': None}

        if user.is_staff:
            enrollment = request.query_params.get('enrollment')
            doc_queryset = GraduateDocuments.objects.filter(keyName="AEP", enrollment=enrollment).first()
            if doc_queryset is not None:
                doc_queryset.delete()
                res_status = status.HTTP_200_OK
            else:
                res_status = status.HTTP_404_NOT_FOUND
        return Response(res_data, res_status)
