"""Helper module for app errors."""
from enum import Enum
from functools import wraps
from typing import Any, Callable, TypedDict, TypeVar, cast


class ErrorCode(Enum):
    """Enum class to distinguish app errors."""

    EXPIRED_GOOGLE_TOKEN = 0
    INVALID_AUDIENCE_GOOGLE_TOKEN = 1
    NO_GOOGLE_ID_GOOGLE_TOKEN = 2
    GOOGLE_API_ERROR = 3
    MONGO_ERROR = 4

    def __repr__(self) -> str:
        """Return string repr."""
        return self.name


class AppErrorDictType(TypedDict):
    """Return type for AppError get_dict_repr."""

    status_code: str
    error_details: str


class AppError:
    """Records details about errors."""

    def __init__(self, status_code: ErrorCode, error_details: str) -> None:
        """Intialize error details object."""
        self.status_code = status_code
        self.error_details = error_details

    def get_dict_repr(self) -> AppErrorDictType:
        """
        Get dictionary representation of error details.

        Use for sending error details over http.
        """
        return {
            "status_code": self.status_code.name,
            "error_details": self.error_details,
        }


F = TypeVar("F", bound=Callable[..., Any])


def error_bounded(error_ret: Any) -> Callable[[F], F]:
    """Decorate functions in order to record and log exceptions."""

    def decorator_error_bounded(fn: F) -> F:
        @wraps(decorator_error_bounded)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            try:
                return fn(*args, **kwargs)
            except Exception as err:
                # If spitting errors here, means it is error with 3rd party
                # resource that our app code cannot be expected to recover from
                # TODO: 3rd party logging
                # TODO: logging using python's error logger
                print(err)
                return error_ret

        return cast(F, wrapper)

    return cast(Callable[[F], F], decorator_error_bounded)
