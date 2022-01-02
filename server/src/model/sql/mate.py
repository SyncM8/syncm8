from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from src.model.sql.base import Base
from src.utils.helpers import usually_unique

if TYPE_CHECKING:
    from src.model.sql.user import User


class Mate(Base):
    """Mate sql model."""

    __tablename__ = "family"

    id = Column(
        String, primary_key=True, default=lambda: usually_unique(prepend="mat_")
    )
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship(User, back_populates="mates")
