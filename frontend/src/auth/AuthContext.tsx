import React, { createContext, useContext, useMemo, useState } from "react";

type Auth = { token: string | null; setToken: (t: string | null) => void };
const Ctx = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, _setToken] = useState<string | null>(localStorage.getItem("token"));
  const setToken = (t: string | null) => {
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
    _setToken(t);
  };
  const value = useMemo(() => ({ token, setToken }), [token]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("AuthProvider missing");
  return v;
};
