from rest_framework import serializers

from plans.models import PrivatePlan


class PrivatePlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivatePlan
        fields = ["id", "title", "user", "is_user_author"]
