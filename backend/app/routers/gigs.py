from uuid import UUID
from decimal import Decimal

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.gig import Gig, GigPackage
from app.models.user import User
from app.schemas.gig import (
    GigCategory,
    GigCreate,
    GigPackageCreate,
    GigRead,
    GigUpdate,
)

router = APIRouter(
    prefix="/gigs",
    tags=["Freelancer Gigs"],
)


def require_freelancer(current_user: User) -> None:
    """Allow only freelancer accounts to manage gigs."""

    if current_user.account_type != "freelancer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only freelancers can manage gigs.",
        )


def get_gig_with_packages(
        db: Session,
        gig_id: UUID,
) -> Gig | None:
    """Retrieve a gig together with its packages."""

    statement = (
        select(Gig)
        .options(selectinload(Gig.packages))
        .where(Gig.id == gig_id)
    )

    return db.scalar(statement)


def get_owned_gig(
        db: Session,
        gig_id: UUID,
        current_user: User,
) -> Gig:
    """Retrieve a gig only when it belongs to the current freelancer."""

    require_freelancer(current_user)

    gig = get_gig_with_packages(db, gig_id)

    if gig is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found.",
        )

    if gig.freelancer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gig not found.",
        )

    return gig


def build_package_records(
        packages: list[GigPackageCreate],
) -> list[GigPackage]:
    """Convert package schemas into database model objects."""

    return [
        GigPackage(
            package_type=package.package_type,
            price=package.price,
            delivery_days=package.delivery_days,
            revisions=package.revisions,
            description=package.description,
            features=package.features,
            sort_order=index,
        )
        for index, package in enumerate(packages, start=1)
    ]


@router.post(
    "",
    response_model=GigRead,
    status_code=status.HTTP_201_CREATED,
)
def create_gig(
        gig_data: GigCreate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
):
    """Create a gig with Basic, Standard and Premium packages."""

    require_freelancer(current_user)

    new_gig = Gig(
        freelancer_id=current_user.id,
        title=gig_data.title,
        category=gig_data.category,
        description=gig_data.description,
        express_available=gig_data.express_available,
        express_days=gig_data.express_days,
        express_fee=gig_data.express_fee,
        sample_name=gig_data.sample_name,
        sample_type=gig_data.sample_type,
        sample_data=gig_data.sample_data,
        currency_code="INR",
        packages=build_package_records(gig_data.packages),
    )

    db.add(new_gig)

    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The gig could not be created. Check the submitted data.",
        ) from error

    saved_gig = get_gig_with_packages(db, new_gig.id)

    return saved_gig


@router.get(
    "",
    response_model=list[GigRead],
)
def get_published_gigs(
        category: GigCategory | None = None,
        search: str | None = Query(
            default=None,
            min_length=1,
            max_length=100,
        ),
        offset: int = Query(default=0, ge=0),
        limit: int = Query(default=20, ge=1, le=100),
        db: Session = Depends(get_db),
):
    """Browse published gigs with optional search and category filtering."""

    statement = (
        select(Gig)
        .options(selectinload(Gig.packages))
        .where(Gig.status == "published")
    )

    if category is not None:
        statement = statement.where(
            Gig.category == category
        )

    if search:
        search_term = f"%{search.strip()}%"

        statement = statement.where(
            Gig.title.ilike(search_term)
            | Gig.description.ilike(search_term)
        )

    statement = (
        statement
        .order_by(Gig.created_at.desc())
        .offset(offset)
        .limit(limit)
    )

    return db.scalars(statement).all()


@router.get(
    "/my-gigs",
    response_model=list[GigRead],
)
def get_my_gigs(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
):
    """Retrieve all gigs belonging to the authenticated freelancer."""

    require_freelancer(current_user)

    statement = (
        select(Gig)
        .options(selectinload(Gig.packages))
        .where(Gig.freelancer_id == current_user.id)
        .order_by(Gig.created_at.desc())
    )

    return db.scalars(statement).all()


@router.get(
    "/{gig_id}",
    response_model=GigRead,
)
def get_gig_details(
        gig_id: UUID,
        db: Session = Depends(get_db),
):
    """Retrieve details of a published gig."""

    gig = get_gig_with_packages(db, gig_id)

    if gig is None or gig.status != "published":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Published gig not found.",
        )

    return gig


@router.patch(
    "/{gig_id}",
    response_model=GigRead,
)
def update_gig(
        gig_id: UUID,
        gig_data: GigUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
):
    """Update a gig owned by the authenticated freelancer."""

    gig = get_owned_gig(db, gig_id, current_user)

    update_data = gig_data.model_dump(exclude_unset=True)

    packages_data = update_data.pop("packages", None)

    # Prepare the package delivery information.
    package_days = (
        [package.delivery_days for package in packages_data]
        if packages_data is not None
        else [package.delivery_days for package in gig.packages]
    )

    # Validate express delivery using the final package values.
    express_available = update_data.get(
        "express_available",
        gig.express_available,
    )

    express_days = update_data.get(
        "express_days",
        gig.express_days,
    )

    if express_available:
        if express_days is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Express delivery days are required.",
            )

        if express_days >= min(package_days):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Express delivery must be faster than the fastest package.",
            )

    else:
        update_data["express_days"] = None
        update_data["express_fee"] = Decimal("0.00")

    # Validate sample attachment fields.
    sample_fields = {
        "sample_name",
        "sample_type",
        "sample_data",
    }

    if sample_fields.intersection(update_data):
        sample_name = update_data.get(
            "sample_name",
            gig.sample_name,
        )

        sample_type = update_data.get(
            "sample_type",
            gig.sample_type,
        )

        sample_data = update_data.get(
            "sample_data",
            gig.sample_data,
        )

        values = [sample_name, sample_type, sample_data]

        if any(value is not None for value in values):
            if not all(value is not None for value in values):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Sample name, type and data must be provided together.",
                )

            if not (
                    sample_type.startswith("image/")
                    or sample_type == "application/pdf"
            ):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Only image and PDF samples are supported.",
                )

            expected_prefix = f"data:{sample_type};base64,"

            if not sample_data.startswith(expected_prefix):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Invalid sample data URL.",
                )

    # Apply regular gig field updates.
    for field, value in update_data.items():
        setattr(gig, field, value)

    # Replace existing packages if new packages were submitted.
    if packages_data is not None:
        gig.packages = build_package_records(packages_data)

    try:
        db.commit()

    except IntegrityError as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The gig could not be updated. Check the submitted data.",
        ) from error

    return get_gig_with_packages(db, gig_id)


@router.delete(
    "/{gig_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_gig(
        gig_id: UUID,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
):
    """Delete a gig owned by the authenticated freelancer."""

    gig = get_owned_gig(db, gig_id, current_user)

    db.delete(gig)
    db.commit()

    return None
