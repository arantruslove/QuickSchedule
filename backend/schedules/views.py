from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from schedules.models import ScheduleFormDraft
from schedules.serializers import ScheduleFormDraftSerializer


# Create your views here.
@api_view(["GET", "POST", "PATCH"])
@permission_classes([IsAuthenticated])
def schedule_form_draft_view(request):
    if request.method == "GET":
        """Fetches a ScheduleFormDraft instance by user id."""
        try:
            draft = ScheduleFormDraft.objects.get(user=request.user)
        except:
            return Response(
                {"detail": f"Resource does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = ScheduleFormDraftSerializer(draft)
        return Response(serializer.data)

    if request.method == "POST":
        """Creates a new ScheduleFormDraft instance."""
        data = request.data
        data["user"] = request.user.id  # Adding the user
        serializer = ScheduleFormDraftSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "PATCH":
        """Partial update of a ScheduleFormDraft instance. Queried by user id."""
        data = request.data
        draft = ScheduleFormDraft.objects.get(user=request.user)
        serializer = ScheduleFormDraftSerializer(draft, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
