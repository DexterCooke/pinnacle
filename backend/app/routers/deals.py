from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..deps import get_db, current_user
from ..models import Deal
from ..schemas import DealIn, DealOut

router = APIRouter(prefix="/deals", tags=["deals"])

@router.get("", response_model=list[DealOut])
def list_deals(db: Session = Depends(get_db), _=Depends(current_user)):
    return db.scalars(select(Deal).order_by(Deal.created_at.desc())).all()

@router.post("", response_model=DealOut)
def create_deal(payload: DealIn, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = Deal(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/{deal_id}", response_model=DealOut)
def get_deal(deal_id: int, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = db.get(Deal, deal_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.put("/{deal_id}", response_model=DealOut)
def update_deal(deal_id: int, payload: DealIn, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = db.get(Deal, deal_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in payload.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{deal_id}")
def delete_deal(deal_id: int, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = db.get(Deal, deal_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(obj)
    db.commit()
    return {"ok": True}
