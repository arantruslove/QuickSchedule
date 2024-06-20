from rest_framework import serializers

from plans.models import PrivatePlan


class PrivatePlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivatePlan
        fields = ["name", "user", "is_user_author"]
