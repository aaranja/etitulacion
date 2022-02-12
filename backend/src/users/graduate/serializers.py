from django.utils import timezone

from rest_framework import serializers
from ..models import GraduateProfile, GraduateNotifications, GraduateProcedureHistory


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer to update the graduate profile
    """

    class Meta:
        model = GraduateProfile
        fields = ['enrollment', 'career', 'gender', 'cellphone', 'account', 'status', 'titulation_type',
                  'accurate_docs',
                  'documents']
        extra_kwargs = {
            'accurate_docs': {'read_only': True},
            'enrollment': {'read_only': True},
            'account': {'read_only': True}
        }

    def update(self, instance, validated_data):
        # instance.enrollment = validated_data.get('enrollment', instance.enrollment)
        instance.career = validated_data.get('career', instance.career)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.cellphone = validated_data.get('cellphone', instance.cellphone)
        instance.titulation_type = validated_data.get('titulation_type', instance.titulation_type)
        instance.save()
        return instance


class InauDateSerializer(serializers.Serializer):
    i_date = serializers.IntegerField()
    status = serializers.CharField()

    class Meta:
        model = GraduateProfile
        fields = ['i_date', 'status']

    def validate_i_date(self, data):
        return data

    def validate_status(self, status):
        return status

    def update(self, instance, validated_date):
        instance.i_date_id = validated_date.get('i_date', instance.i_date_id)
        instance.status = validated_date.get('status', instance.status)
        instance.save()
        return instance


class StatusSerializer(serializers.ModelSerializer):
    """
    Serializer to update the graduate status
    * Requires status string
    """
    status = serializers.CharField()

    class Meta:
        model = GraduateProfile
        fields = ['status']

    def validate_status(self, status):
        # if status == "STATUS_07":
        #     if self._args[0].status != "STATUS_06":
        #         raise serializers.ValidationError(
        #             _("Change status error."))
        return status

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        if instance.status == "STATUS_10":
            instance.i_date = None
        instance.save()
        return instance


class DocumentsSerializer(serializers.ModelSerializer):
    """
    Serializer to add, remove or update a document into graduate documents field
    * Requires JSON     : document metadata
               String   : update type (remove or update)
    * Return the json of document updated
    """

    documents = serializers.JSONField()

    class Meta:
        model = GraduateProfile
        fields = ['documents']

    def validate_documents(self, documents):
        prev_doc = self._args[0].documents
        new_doc = documents[0]

        if new_doc['status'] == "removed":
            # delete a document
            for i in range(len(prev_doc)):
                index = i - 1
                current = prev_doc[index]
                if current['key'] == new_doc['key']:
                    prev_doc.pop(index)
        else:
            replaced = False
            for i in range(len(prev_doc)):
                index = i - 1
                if prev_doc[index]['key'] == new_doc['key']:
                    # replace a document
                    replaced = True
                    prev_doc[index] = new_doc
            if not replaced:
                # add new document
                prev_doc.append(new_doc)
        return prev_doc

    @staticmethod
    def validate_update_type(update_type):
        return update_type

    def validate(self, data):
        return data

    def update(self, instance, validated_data):

        # print(validated_data)
        instance.documents = validated_data.get('documents', instance.documents)
        instance.save()
        return instance


class TitulationSerializer(serializers.ModelSerializer):
    """
    Serializer to update the titulation_type field of graduate
    * Requires String: titulation type
    """
    titulation_type = serializers.CharField()

    class Meta:
        model = GraduateProfile
        fields = ['titulation_type']

    def update(self, instance, validated_data):
        instance.titulation_type = validated_data.get('titulation_type', instance.titulation_type)
        instance.save()
        return instance


class NotificationSerializer(serializers.Serializer):
    """
    Serializer to get and set graduate notifications
    * Requires user to be authenticated and is graduate user
    """
    sender = serializers.CharField()
    type = serializers.CharField()
    message = serializers.CharField()
    enrollment = serializers.IntegerField()

    class Meta:
        model = GraduateNotifications
        fields = ['id', 'date', 'time', 'sender', 'type', 'message', 'enrollment']

    def update(self, instance, validated_data):
        pass

    def validate_sender(self, data):
        # if data == "USER_SERVICES":
        #     data= "Departamento de Servicios Escolares."
        # elif data == "USER_COORDINAT":
        #     data = "Coordinación de Titulación."
        return data

    def create(self, validated_data):
        print(validated_data)
        graduate = GraduateProfile.objects.get(enrollment=validated_data['enrollment'])

        now = timezone.now()
        time = now.strftime("%Y-%m-%d %H:%M:%S")

        notification = GraduateNotifications(
            time=time,
            sender=validated_data['sender'],
            type=validated_data['type'],
            message=validated_data['message'],
            enrollment=graduate,
        )

        notification.save()
        return notification


class ProcedureHistorySerializer(serializers.Serializer):
    """
    Serializer to get and set graduate procedure history
    * Requires user to be authenticated and is graduate or staff user
    """

    information = serializers.CharField()
    enrollment = serializers.IntegerField()
    last_status = serializers.CharField()

    class Meta:
        model = GraduateProcedureHistory
        fields = ['id', 'time', 'information', 'last_status', 'enrollment']

    def create(self, validated_data):
        graduate = GraduateProfile.objects.get(enrollment=validated_data['enrollment'])

        now = timezone.now()
        time = now

        procedure_history = GraduateProcedureHistory(
            time=time,
            information=validated_data['information'],
            last_status=validated_data['last_status'],
            enrollment=graduate,
        )

        procedure_history.save()
        return procedure_history
