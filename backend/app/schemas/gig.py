from datetime import datetime
from decimal import Decimal
from typing import Literal
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
    model_validator,
)

GigCategory = Literal[
    "Logo Design",
    "Web Development",
    "UI/UX Design",
    "Video Editing",
    "Content Writing",
    "Branding",
    "Social Media",
    "Voice Over",
    "Other",
]

PackageType = Literal["basic", "standard", "premium"]

GigStatus = Literal["draft", "published", "paused"]


def validate_packages(packages):
    """Ensure all three packages exist in the correct order."""

    expected = ["basic", "standard", "premium"]
    actual = [package.package_type for package in packages]

    if actual != expected:
        raise ValueError(
            "Every gig must contain Basic, Standard and Premium "
            "packages in that order."
        )

    prices = [package.price for package in packages]

    if not prices[0] <= prices[1] <= prices[2]:
        raise ValueError(
            "Package prices must follow Basic <= Standard <= Premium."
        )


class GigPackageCreate(BaseModel):
    package_type: PackageType

    price: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
    )

    delivery_days: int = Field(
        gt=0,
        le=365,
    )

    revisions: int = Field(
        ge=0,
        le=99,
    )

    description: str = Field(
        min_length=1,
        max_length=300,
    )

    features: list[str] = Field(
        default_factory=list,
        max_length=30,
    )

    @field_validator("description")
    @classmethod
    def clean_description(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Package description cannot be empty.")

        return value

    @field_validator("features")
    @classmethod
    def clean_features(cls, value):
        return [
            feature.strip()
            for feature in value
            if feature.strip()
        ]


class GigCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=90,
    )

    category: GigCategory

    description: str = Field(
        min_length=30,
        max_length=1500,
    )

    packages: list[GigPackageCreate] = Field(
        min_length=3,
        max_length=3,
    )

    express_available: bool = False

    express_days: int | None = Field(
        default=None,
        gt=0,
        le=30,
    )

    express_fee: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    sample_name: str | None = Field(
        default=None,
        max_length=255,
    )

    sample_type: str | None = Field(
        default=None,
        max_length=100,
    )

    sample_data: str | None = Field(
        default=None,
        max_length=850_000,
    )

    @field_validator("title", "description")
    @classmethod
    def clean_text(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("This field cannot be empty.")

        return value

    @field_validator("sample_type")
    @classmethod
    def validate_sample_type(cls, value):
        if value is None:
            return None

        if not (
                value.startswith("image/")
                or value == "application/pdf"
        ):
            raise ValueError(
                "Only image and PDF samples are supported."
            )

        return value

    @model_validator(mode="after")
    def validate_gig(self):
        validate_packages(self.packages)

        if self.express_available:
            if self.express_days is None:
                raise ValueError(
                    "Express delivery days are required."
                )

            fastest_package = min(
                package.delivery_days
                for package in self.packages
            )

            if self.express_days >= fastest_package:
                raise ValueError(
                    "Express delivery must be faster than "
                    "the fastest package."
                )

        else:
            self.express_days = None
            self.express_fee = Decimal("0.00")

        sample_fields = [
            self.sample_name,
            self.sample_type,
            self.sample_data,
        ]

        if any(value is not None for value in sample_fields):
            if not all(value is not None for value in sample_fields):
                raise ValueError(
                    "Sample name, type and data must be supplied together."
                )

            expected_prefix = f"data:{self.sample_type};base64,"

            if not self.sample_data.startswith(expected_prefix):
                raise ValueError(
                    "Sample data must be a valid matching Base64 data URL."
                )

        return self


class GigUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=90,
    )

    category: GigCategory | None = None

    description: str | None = Field(
        default=None,
        min_length=30,
        max_length=1500,
    )

    packages: list[GigPackageCreate] | None = Field(
        default=None,
        min_length=3,
        max_length=3,
    )

    express_available: bool | None = None

    express_days: int | None = Field(
        default=None,
        gt=0,
        le=30,
    )

    express_fee: Decimal | None = Field(
        default=None,
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    sample_name: str | None = Field(
        default=None,
        max_length=255,
    )

    sample_type: str | None = Field(
        default=None,
        max_length=100,
    )

    sample_data: str | None = Field(
        default=None,
        max_length=850_000,
    )

    @field_validator("title", "description")
    @classmethod
    def clean_optional_text(cls, value):
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("This field cannot be empty.")

        return value

    @model_validator(mode="after")
    def validate_updated_packages(self):
        if self.packages is not None:
            validate_packages(self.packages)

        return self


class GigPackageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    gig_id: UUID
    package_type: PackageType
    price: Decimal
    delivery_days: int
    revisions: int
    description: str
    features: list[str]
    sort_order: int
    created_at: datetime
    updated_at: datetime


class GigRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    freelancer_id: UUID
    title: str
    category: GigCategory
    description: str
    status: GigStatus
    currency_code: str
    express_available: bool
    express_days: int | None
    express_fee: Decimal
    sample_name: str | None
    sample_type: str | None
    created_at: datetime
    updated_at: datetime
    packages: list[GigPackageRead]
