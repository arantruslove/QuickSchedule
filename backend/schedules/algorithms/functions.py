from typing import List, Dict, Tuple
from datetime import datetime, timedelta
from copy import deepcopy
from django.db.models.query import QuerySet


from .classes import Topic, Plan
from schedules.models import StudyDateHour
from plans import models
from plans.serializers import TopicSerializer


# Utilities
def n_days_difference(date: str, reference_date: str) -> int:
    """Determine the number of days between an input date and a reference date."""
    date_format = "%Y-%m-%d"

    date = datetime.strptime(date, date_format)
    reference_date = datetime.strptime(reference_date, date_format)

    date_difference = date - reference_date
    return date_difference.days


# Converting to data types that are
def convert_date_queryset_to_hours_list(
    dates_hours_queryset: QuerySet[StudyDateHour],
) -> Tuple[List, str]:
    """
    Converts a StudyDateHour queryset to a tuple containing a list of
    hours and the date string of the initial date.
    """

    hours_list = []
    start_date_str = dates_hours_queryset[0].date.isoformat()
    for date_hour in dates_hours_queryset:
        hours = float(date_hour.hours)
        hours_list.append(hours)

    return hours_list, start_date_str


# Validate that the plans provided are suitable for forming a schedule
def validate_plans(plans: List[Plan], n_days: int) -> None:
    """
    Validates that the list of plans fractions sum to 1 and that none of the plan'
    final days are outside the number of days.
    """
    total_fraction = 0
    for plan in plans:
        total_fraction += float(plan.fraction)
        if plan.final_day > n_days - 1:
            raise IndexError(
                f"The final day of {plan.title} ({plan.final_day}) "
                f"is outside the number of days ({n_days})."
            )

    if total_fraction != 1:
        raise ValueError(f"Relative proportion does not sum to 1 ({total_fraction})")


def convert_plan_queryset_to_class_instances(
    plan_queryset: QuerySet[models.PrivatePlan], n_days: int, start_date: str
) -> List[Plan]:
    """
    Converts the plan queryset to Plan and Topic dataclass structures.
    """

    plans = []
    for plan_instance in plan_queryset:
        exam_date_str = plan_instance.exam_date.isoformat()
        final_day = n_days_difference(exam_date_str, start_date) - 1

        # Initialising a plan instance
        plan = Plan(
            id=plan_instance.id,
            title=plan_instance.title,
            final_day=final_day,
            fraction=float(plan_instance.fraction),
            required_hours=plan_instance.required_hours,
            topics=[],
        )

        # Adding the topics
        topics = []
        for topic in plan_instance.topics.all():
            topic = Topic(
                id=topic.id,
                title=topic.title,
                hours=topic.hours,
            )
            topics.append(topic)

        topics.sort(key=lambda topic: topic.id)

        plan.topics = topics
        plans.append(plan)

    # Checking if the plans are viable
    validate_plans(plans, n_days)

    return plans


def allocate_required_hours(plans: List[Plan], total_hours: float) -> None:
    """Assigned the hours required for each plan to match the total hours scheduled."""
    unallocated_hours = total_hours
    for i in range(len(plans) - 1):
        plan = plans[i]
        required_hours = round(plan.fraction * total_hours)
        plan.required_hours = required_hours
        unallocated_hours -= required_hours

    # Adding the remaining unallocated hours
    plan = plans[-1]
    plan.required_hours = unallocated_hours


def obtain_final_day(plan: Plan) -> int:
    return plan.final_day


def are_plan_hours_viable(plans: List[Plan], hours_list: List[int]) -> Dict:
    """
    Checks whether a list of plans with required hours are viable within the
    constraints provided by the study hours list.
    """

    # Order plans by final day
    ordered_plans: List[Plan] = sorted(plans, key=obtain_final_day)

    # Creating a list of the available number of hours for each course
    available_hours_list = []
    start_index = 0
    for plan in ordered_plans:
        end_index = plan.final_day + 1
        available_hours = sum(hours_list[start_index:end_index])
        available_hours_list.append(available_hours)
        start_index = end_index

    # Checking if the study schedule viable within the time constraints
    remainder = 0
    for i, plan in enumerate(ordered_plans):
        available_hours_list[i] += remainder
        remainder = available_hours_list[i] - plan.required_hours
        if remainder < 0:
            # Study schedule is not viable
            return {"is_viable": False, "id": plan.id}

    # Study schedule is viable
    return {"is_viable": True, "id": None}


def add_required_hours_field(
    plan_instances: List[models.PrivatePlan], plan_classes: List[Plan]
) -> None:
    """
    Adding the each Plan object's required hours field to the Plan model instance.
    """
    for plan_instance in plan_instances:
        for plan_class in plan_classes:
            if plan_instance.id == plan_class.id:
                plan_instance.required_hours = plan_class.required_hours
                plan_instance.save()


def format_viability_result(viability_result: Dict, plans_data: List[Dict]) -> None:
    """
    Formats the viability result object to include the title and exam date of the
    plan."""
    for plan_details in plans_data:
        if plan_details["id"] == viability_result["id"]:
            viability_result["title"] = plan_details["title"]
            viability_result["exam_date"] = plan_details["exam_date"]


# Generating the study schedule based on the user input data
def allocate_topics(plans: List[Plan], hours_list: List[int]) -> List[List[Topic]]:
    """
    Allocates the topics in each plan to each day adhering to the constraint
    of the number of hours in a day.
    """
    # Ensure immutability of original variables
    plans = deepcopy(plans)
    hours_list = hours_list.copy()

    # Order plans by their final day from closest to furthest away from start
    ordered_plans = sorted(plans, key=obtain_final_day)

    # Combine all topics into a single list
    topics = []
    for course in ordered_plans:
        for topic in course.topics:
            topics.append(deepcopy(topic))

    # Distribute topics to each day of the schedule
    schedule = [[] for _ in range(len(hours_list))]
    day = 0
    for topic in topics:
        while topic.hours > 0 and day < len(hours_list):
            if hours_list[day] > 0:
                hours_to_add = min(topic.hours, hours_list[day])
                schedule[day].append(Topic(topic.id, topic.title, hours_to_add))
                topic.hours -= hours_to_add
                hours_list[day] -= hours_to_add
            if hours_list[day] == 0:
                day += 1

    return schedule


def create_schedule_topic_instances(
    schedule: List[List[Topic]], start_date: str
) -> None:
    """
    Creates the schedule topic instances on the db based off the schedule data
    structure and start date.
    """
    date_obj = datetime.strptime(start_date, "%Y-%m-%d")
    for day in schedule:
        for topic in day:
            # Fetch the associated Topic instance from the db
            original_instance = models.Topic.objects.get(id=topic.id)
            topic_data = TopicSerializer(original_instance).data

            # Adjust the data fields
            topic_data["id"] = None
            topic_data["private_plan"] = None
            topic_data["study_date"] = date_obj.strftime("%Y-%m-%d")
            topic_data["hours"] = topic.hours

            # Save the schedule Topic instance
            serializer = TopicSerializer(data=topic_data)
            if serializer.is_valid():
                serializer.save()
            else:
                raise RuntimeError(
                    "There was an error creating the schedule Topic instance."
                )
        # Moving the date to the next day
        date_obj = date_obj + timedelta(days=1)
