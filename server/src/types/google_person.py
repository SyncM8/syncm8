"""Type GooglePerson."""
from dataclasses import dataclass


@dataclass
class GooglePerson:
    """Class for holding relevant data for a person object from Google's API."""

    name: str
    email: str
    profilePictureURL: str

