from django.db import transaction
from django.utils.dateparse import parse_date
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from plans.models import PrivatePlan
from plans.serializers import PrivatePlanSerializer
from schedules.models import StudyDateHour
from schedules.date_time_utils import get_consecutive_dates
from schedules.serializers import StudyDateHourSerializer
from schedules.algorithms.functions import (
    convert_dates_to_hours_list,
    convert_dicts_to_plan_objects,
    allocate_required_hours,
    are_plan_hours_viable,
    add_required_hours_field,
    format_viability_result,
)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def study_date_hour_view(request, pk):
    """Updates a StudyDateHour instance by pk."""
    if request.method == "PATCH":
        data = request.data

        # Obtaing PrivatePlan instance
        try:
            study_date_hour = StudyDateHour.objects.get(pk=pk)
        except:
            return Response(
                {"detail": f"StudyDateHour {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Checking if the user is authorized to access the PrivatePlan
        if request.user != study_date_hour.user:
            return Response(
                {"detail": "You are not authorized to view this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = StudyDateHourSerializer(study_date_hour, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def study_date_hour_list_view(request):
    """
    API view for updating study dates and hours based on the current date and returning
    the list of instances.
    """

    with transaction.atomic():
        # Locking the rows for the current user
        study_dates_hours = StudyDateHour.objects.filter(
            user=request.user
        ).select_for_update(nowait=True)

        # Create a map of dates to hours
        dates_to_hours = {
            sdh.date.strftime("%Y-%m-%d"): sdh.hours for sdh in study_dates_hours
        }

        # Delete existing records
        StudyDateHour.objects.filter(user=request.user).delete()

        # Generate new dates
        N_DAYS = 180  # Approximately half a year
        user_time_zone = request.user.time_zone
        dates_list = get_consecutive_dates(N_DAYS, user_time_zone)

        # Prepare new instances
        new_instances = []
        for date_str in dates_list:
            hours = dates_to_hours.get(date_str, 0)
            new_instance = StudyDateHour(
                user=request.user, date=parse_date(date_str), hours=hours
            )
            new_instances.append(new_instance)

        # Bulk create new instances
        StudyDateHour.objects.bulk_create(new_instances)

        # Fetch and serialize all new instances for the response
        new_study_dates_hours = StudyDateHour.objects.filter(
            user=request.user
        ).order_by("date")
        serializer = StudyDateHourSerializer(new_study_dates_hours, many=True)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def study_date_hour_list_zero(request):
    """
    Updates all of the instances associated with the user to zero hours.
    """
    instances = StudyDateHour.objects.filter(user=request.user)

    for instance in instances:
        instance.hours = 0
    StudyDateHour.objects.bulk_update(instances, ["hours"])

    # Return a list of all of the StudyDateHour instances
    instances = StudyDateHour.objects.filter(user=request.user)
    serializer = StudyDateHourSerializer(instances, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def plan_required_hours(request):
    """
    Returns a list of plan details with a 'required_hours' field included
    which indicates how many hours should be spent on that plan.

    Will throw an HTTP 400 error if the plan fractions violate the constraint imposed
    by the list of study hours.
    """
    try:
        # Getting hours list and start date
        dates_hours_instances = StudyDateHour.objects.filter(user=request.user)
        dates_hours_serializer = StudyDateHourSerializer(
            dates_hours_instances, many=True
        )
        hours_list, start_date = convert_dates_to_hours_list(
            dates_hours_serializer.data
        )

        # Gettins plans data
        plan_instances = PrivatePlan.objects.filter(user=request.user, is_selected=True)
        plans_serializer = PrivatePlanSerializer(plan_instances, many=True)
        plans_data = plans_serializer.data

        # Obtaining the list of Plan objects and allocating the required hours
        n_days = len(hours_list)
        plans = convert_dicts_to_plan_objects(plans_data, n_days, start_date)
        total_hours = sum(hours_list)
        allocate_required_hours(plans, total_hours)

        # Check if the plans' required hours can form a viable schedule within the study
        # hour constraints
        viability_result = are_plan_hours_viable(plans, hours_list)

        if viability_result["is_viable"]:
            add_required_hours_field(plans_data, plans)
            return Response(plans_data)
        else:
            format_viability_result(viability_result, plans_data)
            return Response(viability_result, status=status.HTTP_400_BAD_REQUEST)

    except ValueError as e:
        # User should not have been able to make this request since selected plan
        # fractions did not sum to 1
        return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response(
            {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
