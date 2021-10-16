"""Test the Error util module."""

from typing import Optional, Tuple

from src.utils.error import AppError, ErrorCode, error_bounded


def test_error_bounded_exception() -> None:
    """Test error bounded decorator during exception."""

    def mock_fun() -> Tuple[Optional[AppError], bool]:
        raise Exception

    wrapper = error_bounded((AppError(ErrorCode.MONGO_ERROR, "mongo"), True))
    wrapper2 = wrapper(mock_fun)
    error, ret = wrapper2()
    assert ret
    assert error is not None
    assert error.status_code == ErrorCode.MONGO_ERROR


def test_error_bounded_no_exception() -> None:
    """Test error bounded decorator during happy case."""

    def mock_fun() -> Tuple[Optional[AppError], bool]:
        return AppError(ErrorCode.GOOGLE_API_ERROR, "google error"), False

    wrapper = error_bounded((AppError(ErrorCode.MONGO_ERROR, "mongo"), True))
    wrapper2 = wrapper(mock_fun)
    error, ret = wrapper2()
    assert not ret
    assert error is not None
    assert error.status_code == ErrorCode.GOOGLE_API_ERROR
