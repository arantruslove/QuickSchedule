from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from plans.serializers import PrivatePlanSerializer

# Create your views here.


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def private_plan_view(request):
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
