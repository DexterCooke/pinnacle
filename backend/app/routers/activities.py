from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..deps import get_db, current_user
from ..models import Activity
from ..schemas import ActivityIn, ActivityOut

router = APIRouter(prefix="/activities", tags=["activities"])

@router.get("", response_model=list[ActivityOut])
def list_activities(db: Session = Depends(get_db), _=Depends(current_user)):
    return db.scalars(select(Activity).order_by(Activity.created_at.desc())).all()

@router.post("", response_model=ActivityOut)
def create_activity(payload: ActivityIn, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = Activity(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/{activity_id}", response_model=ActivityOut)
def get_activity(activity_id: int, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = db.get(Activity, activity_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.put("/{activity_id}", response_model=ActivityOut)
def update_activity(activity_id: int, payload: ActivityIn, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = db.get(Activity, activity_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in payload.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db), _=Depends(current_user)):
    obj = db.get(Activity, activity_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(obj)
    db.commit()
    return {"ok": True}
