from rest_framework import serializers
from plans.models import PrivatePlan, Topic


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ["id", "user", "private_plan", "title", "hours"]


class PrivatePlanSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = PrivatePlan
        fields = ["id", "user", "title", "is_user_author", "is_selected", "topics"]
