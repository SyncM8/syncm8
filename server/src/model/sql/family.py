"""Family sql model."""
from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from src.model.sql.base import Base

# if TYPE_CHECKING:
from src.model.sql.user import User
from src.utils.helpers import usually_unique


class Family(Base):
    """Family sql model."""

    __tablename__ = "family"

    id = Column(
        String, primary_key=True, default=lambda: usually_unique(prepend="fam_")
    )
    sync_interval_days = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship(User, back_populates="families")
