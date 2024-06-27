from rest_framework import serializers

from schedules.models import StudyDateHour


class StudyDateHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyDateHour
        fields = ["id", "user", "date", "hours"]
