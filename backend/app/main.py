from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from app.routers.gigs import router as gigs_router
from app.db.database import check_database_connection
from app.routers.auth import router as auth_router
from app.routers.profiles import router as profiles_router

app = FastAPI(
    title="Workly API",
    description="Backend API for the Workly freelance marketplace",
    version="0.4.0",
)

# React frontend configuration.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers.
app.include_router(auth_router)
app.include_router(profiles_router)
app.include_router(gigs_router)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Workly API",
        "status": "running",
        "version": "0.4.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "workly-api",
    }


@app.get("/health/database")
def database_health_check():
    try:
        check_database_connection()

        return {
            "status": "ok",
            "service": "workly-database",
            "database": "workly_db",
            "connection": "successful",
        }

    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to the Workly database.",
        ) from error
