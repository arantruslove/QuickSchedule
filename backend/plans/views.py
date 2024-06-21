from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from plans.models import PrivatePlan, Topic
from plans.serializers import PrivatePlanSerializer, TopicSerializer

# Create your views here.


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def private_plan_view(request, pk=None):

    if request.method == "GET":
        """Getting a PrivatePlan instance data by pk."""

        # Obtaing PrivatePlan instance
        try:
            private_plan = PrivatePlan.objects.get(pk=pk)
        except:
            return Response(
                {"detail": f"PrivatePlan {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Checking if the user is authorized to access the PrivatePlan
        if request.user != private_plan.user:
            return Response(
                {"detail": "You are not authorized to view this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Ensuring valid data has been provided
        serializer = PrivatePlanSerializer(private_plan)
        return Response(serializer.data)

    if request.method == "POST":
        """Creating a PrivatPlan instance."""

        data = request.data
        data["user"] = request.user.id  # Adding the user's id

        serializer = PrivatePlanSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Successfully created private plan."})
        else:
            return Response(serializer.errors)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def private_plan_list_view(request):

    if request.method == "GET":
        """Obtains a list of all the PrivatePlans associated with the user."""
        private_plans = PrivatePlan.objects.filter(user=request.user)
        serializer = PrivatePlanSerializer(private_plans, many=True)
        return Response(serializer.data)


@api_view(["POST", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def topic_view(request, pk=None):

    if request.method == "POST":
        """Creating a Topic instance."""

        data = request.data
        data["user"] = request.user.id  # Adding the user's id

        serializer = TopicSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Successfully created private plan."})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "PATCH":
        """Partially updates a Topic instance by pk."""
        data = request.data

        try:
            topic = Topic.objects.get(pk=pk)
        except:
            return Response(
                {"detail": f"Topic {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        if request.user != topic.user:
            return Response(
                {"detail": "You are not authorized to view this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = TopicSerializer(topic, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Successfully updated the topic."})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        """Deletes a Topic instance by pk."""
        try:
            topic = Topic.objects.get(pk=pk)
        except:
            return Response(
                {"detail": f"Topic {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Enforcing authorization
        if request.user != topic.user:
            return Response(
                {"detail": "You are not authorized to view this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

        topic.delete()
        return Response({"detail": f"Topic {pk} has been deleted."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def topic_list_view(request):

    if request.method == "GET":
        """Obtains a list of all the Topics associated with the plan."""
        private_plan_id = request.query_params.get("private_plan_id")

        if private_plan_id:
            # Check if the user is authorised to access the topics
            private_plan = PrivatePlan.objects.get(id=private_plan_id)
            if request.user != private_plan.user:
                return Response(
                    {"detail": "You are not authorised to view this resource."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            topics = Topic.objects.filter(private_plan=private_plan_id).order_by("id")
            serializer = TopicSerializer(topics, many=True)

        return Response(serializer.data)
