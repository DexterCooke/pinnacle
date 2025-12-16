from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class CompanyIn(BaseModel):
    name: str
    domain: Optional[str] = None

class CompanyOut(CompanyIn):
    id: int
    created_at: datetime
    class Config: from_attributes = True

class ContactIn(BaseModel):
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company_id: Optional[int] = None

class ContactOut(ContactIn):
    id: int
    created_at: datetime
    class Config: from_attributes = True

class DealIn(BaseModel):
    title: str
    amount_cents: int = 0
    stage: Literal["lead","qualified","proposal","won","lost"] = "lead"
    company_id: Optional[int] = None
    primary_contact_id: Optional[int] = None

class DealOut(DealIn):
    id: int
    created_at: datetime
    class Config: from_attributes = True

class ActivityIn(BaseModel):
    type: str
    subject: str
    body: Optional[str] = None
    deal_id: Optional[int] = None
    contact_id: Optional[int] = None
    due_at: Optional[datetime] = None

class ActivityOut(ActivityIn):
    id: int
    created_at: datetime
    class Config: from_attributes = True
