"""Event Action Types for Event Log."""
from enum import Enum


class EventActionType(Enum):
    """Action type for Event."""

    USER_SIGN_UP = "user_sign_up"
    USER_SIGN_IN = "user_sign_in"
