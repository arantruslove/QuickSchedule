from dataclasses import dataclass
from typing import List
from ortools.sat.python import cp_model


@dataclass
class Topic:
    id: int
    title: str
    hours: float
    # Assigned when used in OR Tools scheduling
    assigned_day: cp_model.IntVar | int = None


@dataclass
class Plan:
    id: int
    title: str
    final_day: int
    fraction: float
    required_hours: float
    topics: List[Topic]

    def total_hours(self) -> float:
        """Sum of all the hours from each topic."""
        total = 0
        for topic in self.topics:
            total += topic.hours
        return total
