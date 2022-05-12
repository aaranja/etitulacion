from datetime import datetime
from rest_framework import serializers
from ..graduate.serializers import StatusSerializer
from ..models import DateGroup, ARPStaff, ARPGroup, ARPData, GraduateProfile, Account, GraduateDocuments


class DocumentsSerializer(serializers.ModelSerializer):
    graduate_status = StatusSerializer()

    class Meta:
        model = GraduateDocuments
        fields = [
            'keyName',
            'name',
            'fileName',
            'status',
            'url',
            # 'lastModifiedDate',
            'enrollment',
            'graduate_status',
        ]

    def validate(self, data):
        graduate = data.get('graduate_status')
        status = graduate.get('status')
        keyName = data.get('keyName')
        print("status", status)

        if keyName == "AEP" and not (status == "STATUS_13" or status == "STATUS_14"):
            raise serializers.ValidationError(
                {'graduate_status': 'El egresado no cumple los requisitos para subir su carta de examen profesional.'})

        print("datos", data)
        return data

    def update(self, instance, validated_data):
        print("=== ACTUALIZANDO ===")
        validated_data.pop('graduate_status')
        gen_date = datetime.now()
        time = gen_date.strftime("%Y-%m-%dT%H:%M:%S")
        instance.fileName = validated_data['fileName']
        instance.status = validated_data['status']
        instance.lastModifiedDate = time
        instance.save()
        return instance

    def create(self, validated_data):
        print("=== CREANDO ===")
        gen_date = datetime.now()
        time = gen_date.strftime("%Y-%m-%dT%H:%M:%S")
        document = GraduateDocuments(
            keyName=validated_data['keyName'],
            name=validated_data['name'],
            fileName=validated_data['fileName'],
            status=validated_data['status'],
            url=validated_data['url'],
            lastModifiedDate=gen_date,
            enrollment=validated_data['enrollment'],
        )
        document.save()
        return document


class ARPAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            'first_name',
            'last_name',
        ]


class DateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GraduateProfile
        fields = [
            'i_date',
            'status',
        ]


class ARPProfileSerializer(serializers.ModelSerializer):
    account = ARPAccountSerializer()

    class Meta:
        model = GraduateProfile
        fields = [
            'career',
            'titulation_type',
            'cellphone',
            'status',
            'account',
            'i_date',
        ]

    def update(self, instance, validated_data):
        account_data = validated_data.pop('account')
        account_serializer = ARPAccountSerializer()
        super(self.__class__, self).update(instance, validated_data)
        super(ARPAccountSerializer, account_serializer).update(instance.account, account_data)
        return instance


class ARPDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ARPData
        fields = [
            'record_book',
            'record_page',
            'institute',
            'project_name',
            'int_assessor_name',
            'president',
            'secretary',
            'vocal',
            'graduate',
        ]


class ARPGroupSerializer(serializers.Serializer):
    date = serializers.DateTimeField()
    complete = serializers.BooleanField()

    class Meta:
        model = ARPGroup
        fields = [
            'gen_date',
            'date',
            'confirmed',
            'complete'
        ]

    def create(self, validated_data):
        gen_date = datetime.now()
        # time = gen_date.strftime("%Y-%m-%d %H:%M:%S")
        arp_group = ARPGroup(
            gen_date=gen_date,
            confirmed=False,
            complete=validated_data['complete'],
            date=validated_data['date']
        )
        arp_group.save()
        return arp_group


class ARPStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = ARPStaff
        fields = [
            'key',
            'id_card',
            'full_name',
            'profession',
        ]
        extra_kwargs = {
            'key': {'read_only': True},
        }

    def create(self, validated_data):
        arp_staff = ARPStaff(
            id_card=validated_data['id_card'],
            full_name=validated_data['full_name'],
            profession=validated_data['profession'],
        )
        arp_staff.save()
        return arp_staff


class DateGroupSerializer(serializers.ModelSerializer):
    """
    Serializer to create and update the date group
    """

    class Meta:
        model = DateGroup
        fields = [
            'id',
            'date',
            'no_graduate',
            'confirmed',
            'arp_complete',
            'arp_generated'
        ]
        extra_kwargs = {
            'id': {'read_only': True},
        }

    def create(self, validated_data):
        date_group = DateGroup(
            date=validated_data['date'],
            no_graduate=validated_data['no_graduate']
        )

        date_group.save()
        return date_group

    # def update(self, instance, validated_data):
    #     print(instance)
    #     instance.date = validated_data['date']
    #     instance.no_graduate = validated_data['no_graduate']
    #     instance.save()
    #     return instance
