from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from app.core.dependencies import get_current_user
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.db.database import get_db
from app.models.user import User
from app.models.profile import ClientProfile, FreelancerProfile
from app.schemas.auth import (
    TokenResponse,
    UserLogin,
    UserPublic,
    UserRegister,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
        user_data: UserRegister,
        db: Session = Depends(get_db),
):
    """Register a new Workly user and create their profile."""

    existing_user = db.scalar(
        select(User).where(User.email == user_data.email)
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    new_user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        account_type=user_data.account_type,
    )

    # Automatically create the selected account profile.
    if user_data.account_type == "client":
        new_user.client_profile = ClientProfile()

    elif user_data.account_type == "freelancer":
        new_user.freelancer_profile = FreelancerProfile()

    db.add(new_user)

    try:
        db.commit()
        db.refresh(new_user)

    except IntegrityError as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        ) from error

    access_token = create_access_token(
        subject=str(new_user.id)
    )

    return TokenResponse(
        access_token=access_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=new_user,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login_user(
        login_data: UserLogin,
        db: Session = Depends(get_db),
):
    """Authenticate a user and return an access token."""

    user = db.scalar(
        select(User).where(User.email == login_data.email)
    )

    if (
            user is None
            or not verify_password(
        login_data.password,
        user.hashed_password,
    )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        subject=str(user.id)
    )

    return TokenResponse(
        access_token=access_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user,
    )


@router.get(
    "/me",
    response_model=UserPublic,
)
def get_my_account(
        current_user: User = Depends(get_current_user),
):
    """Return the currently authenticated user's details."""

    return current_user
