from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine

# Import routers explicitly (recommended: avoids __init__.py export issues)
from .routers.auth import router as auth_router
from .routers.contacts import router as contacts_router
from .routers.companies import router as companies_router
from .routers.deals import router as deals_router
from .routers.activities import router as activities_router

# Create tables (fine for dev; use Alembic for prod)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(contacts_router)
app.include_router(companies_router)
app.include_router(deals_router)
app.include_router(activities_router)

@app.get("/health")
def health():
    return {"ok": True}
