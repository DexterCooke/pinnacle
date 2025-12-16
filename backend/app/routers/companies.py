from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from ..deps import get_db, current_user
from ..models import Company
from ..schemas import CompanyIn, CompanyOut

router = APIRouter(
    prefix="/companies",
    tags=["companies"],
    dependencies=[Depends(current_user)],
)


@router.get("", response_model=list[CompanyOut])
def list_companies(db: Session = Depends(get_db)):
    return db.scalars(select(Company).order_by(Company.created_at.desc())).all()

@router.post("", response_model=CompanyOut)
def create_company(payload: CompanyIn, db: Session = Depends(get_db)):
    obj = Company(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/{company_id}", response_model=CompanyOut)
def get_company(company_id: int, db: Session = Depends(get_db)):
    obj = db.get(Company, company_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.put("/{company_id}", response_model=CompanyOut)
def update_company(company_id: int, payload: CompanyIn, db: Session = Depends(get_db)):
    obj = db.get(Company, company_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in payload.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{company_id}")
def delete_company(company_id: int, db: Session = Depends(get_db)):
    obj = db.get(Company, company_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(obj)
    db.commit()
    return {"ok": True}
