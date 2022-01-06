"""Some docstring."""
from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

# from src.model.sql.base import Base
from src.utils.helpers import usually_unique

if TYPE_CHECKING:
    from src.model.sql.family import Family
    from src.model.sql.mate import Mate
    from src.model.sql.sync import Sync

# Base = declarative_base()


class User(Base):
    """User sql model."""

    __tablename__ = "user"

    id = Column(
        String, primary_key=True, default=lambda: usually_unique(prepend="usr_")
    )
    first_name = Column(String, nullable=False)
    last_name = Column(String)
    picture_url = Column(String)
    email = Column(String)
    unassigned_family = Column(String, ForeignKey("family.id"))
    families = relationship("Family", back_populates="user")
    mates = relationship("Mate", back_populates="user")
    syncs = relationship("Sync", back_populates="user")
