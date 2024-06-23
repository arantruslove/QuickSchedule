from rest_framework import serializers

from schedules.models import ScheduleFormDraft


class ScheduleFormDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleFormDraft
        fields = ["id", "user", "daily_study_hours", "plan_selection_status"]
