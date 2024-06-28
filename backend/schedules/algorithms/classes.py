from dataclasses import dataclass
from typing import List


@dataclass
class Topic:
    id: int
    title: str
    hours: float


@dataclass
class Plan:
    id: int
    title: str
    final_day: int
    fraction: float
    topics: List[Topic]
    required_hours: float = 0

    def total_hours(self) -> float:
        """Sum of all the hours from each topic."""
        total = 0
        for topic in self.topics:
            total += topic.hours
        return total
