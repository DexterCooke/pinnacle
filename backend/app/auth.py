from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from fastapi import Header, HTTPException, status, Depends

from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = os.getenv("SECRET_KEY", "dev-change-me")  # put in env var in prod
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_MINUTES = int(os.getenv("ACCESS_TOKEN_MINUTES", "480"))  # 8 hours

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(pw: str) -> str:
    return pwd_context.hash(pw)


def verify_password(pw: str, hashed: str) -> bool:
    return pwd_context.verify(pw, hashed)


def create_access_token(sub: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES)
    payload = {"sub": sub, "exp": exp}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if not sub:
            raise ValueError("Token missing 'sub'")
        return sub
    except JWTError as e:
        # keep the original error info for debugging
        raise ValueError(f"Invalid token: {e}") from e
    
def get_current_user(
    authorization: str = Header(...)
):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.split(" ", 1)[1]
    try:
        return decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
