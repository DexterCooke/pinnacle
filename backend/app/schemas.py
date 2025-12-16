from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


# -----------------------------
# Auth
# -----------------------------

class UserCreate(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# -----------------------------
# Contacts
# -----------------------------

class ContactBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company_id: Optional[int] = None


class ContactCreate(ContactBase):
    pass


class ContactOut(ContactBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# -----------------------------
# Companies
# -----------------------------

class CompanyBase(BaseModel):
    name: str
    domain: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyOut(CompanyBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# -----------------------------
# Deals
# -----------------------------

class DealStage(str, Enum):
    lead = "lead"
    qualified = "qualified"
    proposal = "proposal"
    won = "won"
    lost = "lost"


class DealBase(BaseModel):
    title: str
    amount_cents: int
    stage: DealStage
    company_id: int
    primary_contact_id: Optional[int] = None


class DealCreate(DealBase):
    pass


class DealOut(DealBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# -----------------------------
# Activities
# -----------------------------

class ActivityType(str, Enum):
    call = "call"
    email = "email"
    meeting = "meeting"
    task = "task"


class ActivityBase(BaseModel):
    type: ActivityType
    note: Optional[str] = None
    due_at: Optional[datetime] = None
    deal_id: Optional[int] = None
    contact_id: Optional[int] = None


class ActivityCreate(ActivityBase):
    pass


class ActivityOut(ActivityBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# -----------------------------
# Backwards-compat aliases
# (keeps routers happy)
# -----------------------------

ContactIn = ContactCreate
CompanyIn = CompanyCreate
DealIn = DealCreate
ActivityIn = ActivityCreate
