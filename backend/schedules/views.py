from django.db import transaction
from django.utils.dateparse import parse_date
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from plans.models import PrivatePlan, Topic
from plans.serializers import PrivatePlanSerializer, TopicSerializer
from schedules.models import StudyDateHour
from schedules.date_time_utils import get_consecutive_dates
from schedules.serializers import StudyDateHourSerializer
from schedules.algorithms.functions import (
    convert_date_queryset_to_hours_list,
    convert_plan_queryset_to_class_instances,
    allocate_required_hours,
    are_plan_hours_viable,
    add_required_hours_field,
    format_viability_result,
    create_schedule,
    create_schedule_topic_instances,
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


@api_view(["PATCH"])
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
        dates_hours_instances = StudyDateHour.objects.filter(
            user=request.user
        ).order_by("date")
        hours_list, start_date = convert_date_queryset_to_hours_list(
            dates_hours_instances
        )

        # Getting plan objects from plan instances
        plan_instances = (
            PrivatePlan.objects.filter(user=request.user, is_selected=True)
            .order_by("id")
            .reverse()
        )
        plan_classes = convert_plan_queryset_to_class_instances(
            plan_instances, len(hours_list), start_date
        )

        # Allocated required hours to the plan classes
        allocate_required_hours(plan_classes, sum(hours_list))

        # Checking if the plans can form a viable schedule
        viability_result = are_plan_hours_viable(plan_classes, hours_list)

        if viability_result["is_viable"] == True:
            add_required_hours_field(plan_instances, plan_classes)
            serializer = PrivatePlanSerializer(plan_instances, many=True)
            return Response(serializer.data)
        else:
            serializer = PrivatePlanSerializer(plan_instances, many=True)
            format_viability_result(viability_result, serializer.data)
            return Response(viability_result, status=status.HTTP_400_BAD_REQUEST)

    except ValueError as e:
        # User should not have been able to make this request since selected plan
        # fractions did not sum to 1
        return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response(
            {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@transaction.atomic
def schedule_view(request):
    """Generates a schedules based on the user's plans and topics."""

    if request.method == "GET":
        """Fetches the user's schedule Topic instances."""
        schedule_topics = Topic.objects.filter(
            user=request.user, study_date__isnull=False
        )
        serializer = TopicSerializer(schedule_topics, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        """Generates a schedule based on the user's Plans and Topics information."""
        try:
            # Deleting any existing schedule Topic instances
            existing_schedule_topics = Topic.objects.filter(
                user=request.user, study_date__isnull=False
            ).select_for_update(nowait=True)
            existing_schedule_topics.delete()

            # Getting hours list and start date
            dates_hours_instances = StudyDateHour.objects.filter(
                user=request.user
            ).order_by("date")
            hours_list, start_date = convert_date_queryset_to_hours_list(
                dates_hours_instances
            )

            # Getting plan objects from plan instances
            plan_instances = PrivatePlan.objects.filter(
                user=request.user, is_selected=True
            )
            plan_classes = convert_plan_queryset_to_class_instances(
                plan_instances, len(hours_list), start_date
            )

            # Create the schedule and the schedule Topic instances
            schedule = create_schedule(plan_classes, hours_list)
            create_schedule_topic_instances(schedule, start_date)

            # Returning the schedule Topics in the response
            schedule_topics = Topic.objects.filter(
                user=request.user, study_date__isnull=False
            ).order_by("study_date")
            serializer = TopicSerializer(schedule_topics, many=True)

            return Response(serializer.data)

        except ValueError as e:
            # User should not have been able to make this request since selected plan
            # fractions did not sum to 1
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
