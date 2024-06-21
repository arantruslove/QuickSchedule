from rest_framework import serializers

from plans.models import PrivatePlan, Topic


class PrivatePlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivatePlan
        fields = ["id", "user", "title", "is_user_author"]


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ["id", "user", "private_plan", "title", "hours"]
