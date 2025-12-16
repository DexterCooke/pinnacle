import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [err, setErr] = useState<string | null>(null);
  const { setToken } = useAuth();
  const nav = useNavigate();

  async function submit() {
    setErr(null);
    try {
      if (mode === "register") {
        const res = await api.post("/auth/register", { email, password });
        setToken(res.data.access_token);
        nav("/");
      } else {
        const form = new URLSearchParams();
        form.set("username", email);
        form.set("password", password);
        const res = await api.post("/auth/login", form, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        setToken(res.data.access_token);
        nav("/");
      }
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto" }}>
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      <div style={{ display: "grid", gap: 10 }}>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <div style={{ color: "crimson" }}>{err}</div>}
        <button onClick={submit}>{mode === "login" ? "Login" : "Create account"}</button>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
          Switch to {mode === "login" ? "register" : "login"}
        </button>
      </div>
    </div>
  );
}
