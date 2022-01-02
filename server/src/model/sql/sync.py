"""Sync sql model."""
from typing import TYPE_CHECKING
from sqlalchemy import DATETIME, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from src.model.sql.base import Base
from src.utils.helpers import usually_unique

if TYPE_CHECKING:
    from src.model.sql.user import User


class Sync(Base):
    """Sync sql model."""

    __tablename__ = "family"

    id = Column(
        String, primary_key=True, default=lambda: usually_unique(prepend="syn_")
    )
    timestamp = Column(DATETIME, nullable=False)
    title = Column(String, nullable=False)
    details = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship(User, back_populates="syncs")
