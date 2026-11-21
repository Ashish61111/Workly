from datetime import datetime
from decimal import Decimal
from typing import Literal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)

AccountType = Literal["client", "freelancer"]

AvailabilityStatus = Literal[
    "available",
    "busy",
    "unavailable",
]


class UserProfileRead(BaseModel):
    """Public account information included in a user's profile."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    first_name: str
    last_name: str
    account_type: AccountType
    phone_number: str | None
    avatar_url: str | None


class FreelancerProfileRead(BaseModel):
    """Freelancer-specific profile information."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    professional_title: str | None
    bio: str | None
    hourly_rate: Decimal | None
    currency_code: str | None
    experience_level: str | None
    location: str | None
    availability_status: AvailabilityStatus
    portfolio_url: str | None
    created_at: datetime
    updated_at: datetime


class ClientProfileRead(BaseModel):
    """Client-specific profile information."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    company_name: str | None
    company_website: str | None
    company_description: str | None
    industry: str | None
    company_size: str | None
    location: str | None
    created_at: datetime
    updated_at: datetime


class MyProfileResponse(BaseModel):
    """Complete profile response for the authenticated user."""

    user: UserProfileRead
    client_profile: ClientProfileRead | None = None
    freelancer_profile: FreelancerProfileRead | None = None


class ClientProfileUpdate(BaseModel):
    """Fields a client is allowed to update."""

    company_name: str | None = Field(
        default=None,
        max_length=160,
    )

    company_website: str | None = Field(
        default=None,
        max_length=500,
    )

    company_description: str | None = Field(
        default=None,
        max_length=5000,
    )

    industry: str | None = Field(
        default=None,
        max_length=120,
    )

    company_size: str | None = Field(
        default=None,
        max_length=50,
    )

    location: str | None = Field(
        default=None,
        max_length=160,
    )

    @field_validator(
        "company_name",
        "company_website",
        "company_description",
        "industry",
        "company_size",
        "location",
    )
    @classmethod
    def clean_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None

        return value.strip()


class FreelancerProfileUpdate(BaseModel):
    """Fields a freelancer is allowed to update."""

    professional_title: str | None = Field(
        default=None,
        max_length=160,
    )

    bio: str | None = Field(
        default=None,
        max_length=5000,
    )

    hourly_rate: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    currency_code: str | None = Field(
        default=None,
        max_length=3,
    )

    experience_level: str | None = Field(
        default=None,
        max_length=30,
    )

    location: str | None = Field(
        default=None,
        max_length=160,
    )

    availability_status: AvailabilityStatus | None = None

    portfolio_url: str | None = Field(
        default=None,
        max_length=500,
    )

    @field_validator(
        "professional_title",
        "bio",
        "experience_level",
        "location",
        "portfolio_url",
    )
    @classmethod
    def clean_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None

        return value.strip()

    @field_validator("currency_code")
    @classmethod
    def normalize_currency(
            cls,
            value: str | None,
    ) -> str | None:
        if value is None:
            return None

        value = value.strip().upper()

        if len(value) != 3:
            raise ValueError(
                "Currency code must contain exactly 3 letters."
            )

        return value

    @field_validator("availability_status")
    @classmethod
    def validate_availability(
            cls,
            value: AvailabilityStatus | None,
    ) -> AvailabilityStatus:
        if value is None:
            raise ValueError(
                "Availability status cannot be null."
            )

        return value
