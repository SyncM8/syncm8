"""Type GooglePerson."""
from dataclasses import dataclass
from typing import List


@dataclass
class GooglePerson:
    """Class to an individual contact returned by Google's People API."""

    resourceName: str
    etag: str
    metadata: object
    addresses: List[object]
    # ageRange is deprecated
    ageRanges: List[object]
    biographies: List[object]
    birthdays: List[object]
    braggingRights: List[object]
    calendarUrls: List[object]
    clientData: List[object]
    coverPhotos: List[object]
    emailAddresses: List[object]
    events: List[object]
    externalIds: List[object]
    fileAses: List[object]
    genders: List[object]
    imClients: List[object]
    interests: List[object]
    locales: List[object]
    locations: List[object]
    memberships: List[object]
    miscKeywords: List[object]
    names: List[object]
    nicknames: List[object]
    occupations: List[object]
    organizations: List[object]
    phoneNumbers: List[object]
    photos: List[object]
    relations: List[object]
    relationshipInterests: List[object]
    relationshipStatuses: List[object]
    residences: List[object]
    sipAddresses: List[object]
    skills: List[object]
    taglines: List[object]
    urls: List[object]
    userDefined: List[object]
