from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.profile import ClientProfile, FreelancerProfile
from app.models.user import User
from app.schemas.profile import (
    ClientProfileRead,
    ClientProfileUpdate,
    FreelancerProfileRead,
    FreelancerProfileUpdate,
    MyProfileResponse,
)

router = APIRouter(
    prefix="/profiles",
    tags=["Profiles"],
)


def build_profile_response(user: User) -> MyProfileResponse:
    """Build the complete profile response for a user."""

    return MyProfileResponse(
        user=user,
        client_profile=user.client_profile,
        freelancer_profile=user.freelancer_profile,
    )


@router.get(
    "/me",
    response_model=MyProfileResponse,
)
def get_my_profile(
        current_user: User = Depends(get_current_user),
):
    """Retrieve the authenticated user's profile."""

    return build_profile_response(current_user)


@router.patch(
    "/me/client",
    response_model=MyProfileResponse,
)
def update_client_profile(
        profile_data: ClientProfileUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
):
    """Create or update the authenticated client's profile."""

    if current_user.account_type != "client":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only client accounts can update client profiles.",
        )

    profile = current_user.client_profile

    if profile is None:
        profile = ClientProfile()
        current_user.client_profile = profile

    update_data = profile_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(profile, field, value)

    try:
        db.commit()
        db.refresh(profile)

    except Exception:
        db.rollback()
        raise

    return build_profile_response(current_user)


@router.patch(
    "/me/freelancer",
    response_model=MyProfileResponse,
)
def update_freelancer_profile(
        profile_data: FreelancerProfileUpdate,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
):
    """Create or update the authenticated freelancer's profile."""

    if current_user.account_type != "freelancer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only freelancer accounts can update freelancer profiles.",
        )

    profile = current_user.freelancer_profile

    if profile is None:
        profile = FreelancerProfile()
        current_user.freelancer_profile = profile

    update_data = profile_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(profile, field, value)

    try:
        db.commit()
        db.refresh(profile)

    except Exception:
        db.rollback()
        raise

    return build_profile_response(current_user)
