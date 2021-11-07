"""Type NewFamily."""
from dataclasses import dataclass
from typing import List


@dataclass
class NewFamily:
    """Class to represent a new Family."""

    name: str
    sync_interval_days: int


UNASSIGNED_FAMILY = NewFamily("Unassigned", 3650)  # Auto-assigned to 10-year interval


STARTER_FAMILIES: List[NewFamily] = [
    NewFamily("Biweekly", 14),
    NewFamily("Monthly", 28),
    NewFamily("Quarterly", 91),
    NewFamily("Yearly", 365),
]
