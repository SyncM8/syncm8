"""Type GooglePerson."""
from dataclasses import dataclass
from typing import List


@dataclass
class GooglePerson:
    """Class to an individual contact returned by Google's People API."""

    resourceName: str
    etag: str
    metadata: object
    addresses: List
    # ageRange is deprecated
    ageRanges: List
    biographies: List
    birthdays: List
    braggingRights: List
    calendarUrls: List
    clientData: List
    coverPhotos: List
    emailAddresses: List
    events: List
    externalIds: List
    fileAses: List
    genders: List
    imClients: List
    interests: List
    locales: List
    locations: List
    memberships: List
    miscKeywords: List
    names: List
    nicknames: List
    occupations: List
    organizations: List
    phoneNumbers: List
    photos: List
    relations: List
    relationshipInterests: List
    relationshipStatuses: List
    residences: List
    sipAddresses: List
    skills: List
    taglines: List
    urls: List
    userDefined: List
