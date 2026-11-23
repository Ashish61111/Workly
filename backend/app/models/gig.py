import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    JSON,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    Uuid,
    func,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Gig(Base):
    __tablename__ = "gigs"

    __table_args__ = (
        CheckConstraint(
            "status IN ('draft', 'published', 'paused')",
            name="ck_gigs_status",
        ),
        CheckConstraint(
            "express_fee >= 0",
            name="ck_gigs_express_fee",
        ),
        CheckConstraint(
            "express_available = false OR "
            "(express_days IS NOT NULL AND express_days > 0)",
            name="ck_gigs_express_days",
        ),
        Index(
            "ix_gigs_freelancer_created",
            "freelancer_id",
            "created_at",
        ),
        Index(
            "ix_gigs_category_status",
            "category",
            "status",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    freelancer_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(90),
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(80),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        String(1500),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="published",
        server_default=text("'published'"),
        nullable=False,
    )

    currency_code: Mapped[str] = mapped_column(
        String(3),
        default="INR",
        server_default=text("'INR'"),
        nullable=False,
    )

    express_available: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default=text("false"),
        nullable=False,
    )

    express_days: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    express_fee: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=Decimal("0.00"),
        server_default=text("0"),
        nullable=False,
    )

    sample_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    sample_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    sample_data: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    packages: Mapped[list["GigPackage"]] = relationship(
        back_populates="gig",
        cascade="all, delete-orphan",
        order_by="GigPackage.sort_order",
    )

    freelancer = relationship("User")


class GigPackage(Base):
    __tablename__ = "gig_packages"

    __table_args__ = (
        UniqueConstraint(
            "gig_id",
            "package_type",
            name="uq_gig_package_type",
        ),
        CheckConstraint(
            "package_type IN ('basic', 'standard', 'premium')",
            name="ck_gig_package_type",
        ),
        CheckConstraint(
            "price > 0",
            name="ck_gig_package_price",
        ),
        CheckConstraint(
            "delivery_days > 0",
            name="ck_gig_package_delivery",
        ),
        CheckConstraint(
            "revisions >= 0",
            name="ck_gig_package_revisions",
        ),
        CheckConstraint(
            "sort_order BETWEEN 1 AND 3",
            name="ck_gig_package_sort_order",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    gig_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("gigs.id", ondelete="CASCADE"),
        nullable=False,
    )

    package_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    delivery_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    revisions: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
    )

    features: Mapped[list[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    sort_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    gig: Mapped["Gig"] = relationship(
        back_populates="packages",
    )
