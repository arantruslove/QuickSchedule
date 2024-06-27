from django.utils.dateparse import parse_date
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

        # Storing a map of the date representation to hours
        dates_to_hours = {
            study_date_hour.date.strftime("%Y-%m-%d"): study_date_hour.hours
            for study_date_hour in study_dates_hours
        }

        # Delete all the dates as they will be replaced with fresh ones
        StudyDateHour.objects.filter(user=request.user).delete()

        # Create consecutive date instances for a set number of dates
        N_DAYS = 180  # Approximately half a year
        user_time_zone = request.user.time_zone
        dates_list = get_consecutive_dates(N_DAYS, user_time_zone)

        new_instances = []
        for date_str in dates_list:
            hours = dates_to_hours.get(date_str, 0)
            new_instance = StudyDateHour(
                user=request.user, date=parse_date(date_str), hours=hours
            )
            new_instances.append(new_instance)

        # Bulk create all new instances
        StudyDateHour.objects.bulk_create(new_instances)

        # Return a list of all of the StudyDateHour instances
        instances = StudyDateHour.objects.filter(user=request.user)
        serializer = StudyDateHourSerializer(instances, many=True)

        return Response(serializer.data)
