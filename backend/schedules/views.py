from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from schedules.models import StudyDateHour
from schedules.date_time_utils import get_consecutive_dates

from schedules.serializers import StudyDateHourSerializer


@api_view(["POST", "PATCH"])
@permission_classes([IsAuthenticated])
def study_dates_hours_list_view(request):

    if request.method == "POST":
        study_dates_hours = StudyDateHour.objects.filter(user=request.user)

        # Storing a map of the date representation to hour
        dates_to_hours = {}
        for study_date_hour in study_dates_hours:
            date_str = study_date_hour.date.strftime("%Y-%m-%d")
            dates_to_hours[date_str] = study_date_hour.hours

        # Delete all the dates as they will be replaced with fresh ones
        dates_to_delete = StudyDateHour.objects.filter(user=request.user)
        dates_to_delete.delete()

        # Create consecutive date intances for a set number of dates
        N_DAYS = 180  # Approximately half a year
        user_time_zone = request.user.time_zone
        dates_list = get_consecutive_dates(N_DAYS, user_time_zone)
        for date in dates_list:
            # Creating the instance and keeping the original hours field
            try:
                hours = dates_to_hours[date]
            except:
                hours = 0
            data = {"user": request.user.id, "date": date, "hours": hours}
            serializer = StudyDateHourSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            study_date_hour.save()

        # Return a list of all of the StudyDateHour instances
        instances = StudyDateHour.objects.filter(user=request.user)
        serializer = StudyDateHourSerializer(instances, many=True)

        return Response(serializer.data)
