from typing import List, Dict, Tuple
from datetime import datetime
from copy import deepcopy
import math

from .classes import Topic, Plan


# Utilities
def n_days_difference(date: str, reference_date: str) -> int:
    """Determine the number of days between an input date and a reference date."""
    date_format = "%Y-%m-%d"

    date = datetime.strptime(date, date_format)
    reference_date = datetime.strptime(reference_date, date_format)

    date_difference = date - reference_date
    return date_difference.days


# Converting to data types that are
def convert_dates_to_hours_list(dates_hours: List[Dict]) -> Tuple[List, str]:
    """
    Converts a list of dictionaries containing a date field and an hours field to
    a dictionary containing a list of hours and the date string of the initial date.
    """

    def date_hour_to_ms(date_hour: Dict) -> float:
        date_str = date_hour["date"]
        date_format = "%Y-%m-%d"
        dt = datetime.strptime(date_str, date_format)
        return dt.timestamp()

    # Sort from nearest in time to furthest away
    sorted_dates_hours = sorted(dates_hours, key=date_hour_to_ms)

    hours_list = []
    start_date = sorted_dates_hours[0]["date"]
    for date_hour in sorted_dates_hours:
        hours = float(date_hour["hours"])
        hours_list.append(hours)

    return hours_list, start_date


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


def convert_dicts_to_plan_objects(
    data: List[Dict], n_days: int, start_date: str
) -> List[Plan]:
    """
    Converts the serialized list of dictionaries representation of plans and topics to
    the Plan and Topic dataclass structure. These are then used in the scheduling
    algorithm functions.
    """

    plans = []
    for plan_details in data:
        final_day = n_days_difference(plan_details["exam_date"], start_date) - 1

        # Initialising a plan instance
        plan = Plan(
            id=plan_details["id"],
            title=plan_details["title"],
            final_day=final_day,
            fraction=float(plan_details["fraction"]),
            topics=[],
        )

        # Adding the topics
        topics = []
        for topic_details in plan_details["topics"]:
            topic = Topic(
                id=topic_details["id"],
                title=topic_details["title"],
                hours=topic_details["hours"],
            )
            topics.append(topic)

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


def add_required_hours_field(data: List[Dict], plans: List[Plan]) -> None:
    """
    Adding the each Plan object required hours field to the relevant data
    dictionary.
    """
    for plan in plans:
        for plan_details in data:
            if plan.id == plan_details["id"]:
                plan_details["required_hours"] = plan.required_hours


def format_viability_result(viability_result: Dict, plans_data: List[Dict]) -> None:
    """
    Formats the viability result object to include the title and exam date of the
    plan."""
    for plan_details in plans_data:
        if plan_details["id"] == viability_result["id"]:
            viability_result["title"] = plan_details["title"]
            viability_result["exam_date"] = plan_details["exam_date"]
