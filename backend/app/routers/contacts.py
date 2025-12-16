from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..deps import get_db, current_user
from ..models import Contact
from ..schemas import ContactIn, ContactOut

router = APIRouter(prefix="/contacts", tags=["contacts"])

@router.get("", response_model=list[ContactOut])
def list_contacts(db: Session = Depends(get_db), _=Depends(current_user)):
    return db.scalars(select(Contact).order_by(Contact.created_at.desc())).all()

@router.post("", response_model=ContactOut)
def create_contact(payload: ContactIn, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = Contact(**payload.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.get("/{contact_id}", response_model=ContactOut)
def get_contact(contact_id: int, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = db.get(Contact, contact_id)
    if not obj:
        raise HTTPException(404, "Not found")
    return obj

@router.put("/{contact_id}", response_model=ContactOut)
def update_contact(contact_id: int, payload: ContactIn, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = db.get(Contact, contact_id)
    if not obj:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump().items():
        setattr(obj, k, v)
    db.commit(); db.refresh(obj)
    return obj

@router.delete("/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = db.get(Contact, contact_id)
    if not obj:
        raise HTTPException(404, "Not found")
    db.delete(obj); db.commit()
    return {"ok": True}
