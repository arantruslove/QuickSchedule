from typing import List, Dict, Tuple
from datetime import datetime, timedelta
from copy import deepcopy
from django.db.models.query import QuerySet
from ortools.sat.python import cp_model


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
) -> Tuple[List[int], str]:
    """
    Converts a StudyDateHour queryset to a tuple containing a list of
    hours and the date string of the initial date.
    """

    hours_list = []
    start_date_str = dates_hours_queryset[0].date.isoformat()
    for date_hour in dates_hours_queryset:
        hours = float(date_hour.hours)
        hours_list.append(int(hours))

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


def split_topics_to_single_hours(plans: List[Plan]) -> List[Plan]:
    """
    Splits Topics that are longer than one hour to individual Topics of one hour each.
    """
    plans = deepcopy(plans)

    for plan in plans:
        split_topics = []
        for topic in plan.topics:
            while topic.hours > 0:
                split_topic: Topic = deepcopy(topic)
                split_topic.hours = 1
                split_topics.append(split_topic)
                topic.hours -= 1
        plan.topics = split_topics
    return plans


def add_assigned_day_to_topics(
    plans: List[Plan], model: cp_model.CpModel, n_days: int
) -> None:
    """Adds the assigned_day OR Tool IntVar to each Topic in the plans."""
    id = 1  # Unique identifier for variable names
    for plan in plans:
        for topic in plan.topics:
            topic.assigned_day = model.new_int_var(0, n_days - 1, str(id))
            id += 1


def add_constraints(
    plans: List[Plan], model: cp_model.CpModel, n_topics_per_day: List[int]
) -> None:
    """
    Adds the necessary constraints to the scheduling model, ensuring that:
    1) The Topics are assigned to days in the correct order.
    2) The last Topic of each Plan is on or before the respective Plan's final day.
    3) The number of Topics assigned to a given day is equal to the required number of
       Topics for that day.
    """
    for plan in plans:
        topics = plan.topics
        # Constraining order of topics
        for i in range(len(topics) - 1):
            current = topics[i]
            next = topics[i + 1]
            model.add(current.assigned_day <= next.assigned_day)

        # Ensuring that the the last topic is on or before the final day
        last_topic = topics[-1]
        model.add(last_topic.assigned_day <= plan.final_day)

    # Adding indicators to check if a topic is scheduled on a specific day
    indicators = [
        {
            str(topic.assigned_day): model.new_bool_var(f"{topic.title}_on_day_{day}")
            for plan in plans
            for topic in plan.topics
        }
        for day in range(len(n_topics_per_day))
    ]

    # Setting binary indicators for use in constraining the number of topics on a given
    # day
    for day_num in range(len(indicators)):
        for id, indicator in indicators[day_num].items():
            for plan in plans:
                for topic in plan.topics:
                    if id == str(topic.assigned_day):
                        model.add(topic.assigned_day == day_num).only_enforce_if(
                            indicator
                        )
                        model.add(topic.assigned_day != day_num).only_enforce_if(
                            indicator.Not()
                        )

    # Constraining such that the number of topics on each day matches the target
    for day_indicators, n_topics in zip(indicators, n_topics_per_day):
        model.add(sum(day_indicators.values()) == int(n_topics))


def convert_assigned_days_to_ints(plans: List[Plan], solver: cp_model.CpSolver) -> None:
    """Converts the IntVar type to integer after the model has been solved."""
    for plan in plans:
        for topic in plan.topics:
            topic.assigned_day = solver.value(topic.assigned_day)


def format_to_topic_list(plans: List[Plan], n_days: int) -> List[List[Topic]]:
    """
    Converts the list of Plans to a list of sublists where each sublist corresponds
    to a day in the study schedule and contains Topics for that day.
    """
    topics_list = [[] for _ in range(n_days)]
    for plan in plans:
        for topic in plan.topics:
            day_num = topic.assigned_day
            todays_topics = topics_list[day_num]
            is_topic_in_day = False
            for assigned_topic in todays_topics:
                if assigned_topic.id == topic.id:
                    assigned_topic.hours += 1
                    is_topic_in_day = True
                    break
            if not is_topic_in_day:
                todays_topics.append(deepcopy(topic))
    return topics_list


def create_schedule(
    plans: List[Plan], n_topics_per_day: List[int]
) -> List[List[Topic]]:
    model = cp_model.CpModel()

    # Preparing Plan and Topic formats for compatibility in the scheduling algorithm
    # Assigning the optimizable OR Tools assigned_day field to each Topic
    topic_split_plans = split_topics_to_single_hours(plans)
    n_days = len(n_topics_per_day)
    add_assigned_day_to_topics(topic_split_plans, model, n_days)

    # Carry out the constrained optimisation
    add_constraints(topic_split_plans, model, n_topics_per_day)
    model.maximize(0)  # Currently not optimising anything but this can be changed
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status != 4:
        raise Exception(
            f"The solver was not able to find a feasible solution. Error code: {status} "
        )

    # Reformatting and obtaining the schedule
    convert_assigned_days_to_ints(topic_split_plans, solver)
    schedule = format_to_topic_list(topic_split_plans, n_days)

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
