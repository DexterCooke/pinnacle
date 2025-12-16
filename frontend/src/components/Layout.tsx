import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { setToken } = useAuth();
  const nav = useNavigate();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", height: "100vh" }}>
      <aside style={{ padding: 16, borderRight: "1px solid #ddd" }}>
        <h3>Pinnacle</h3>
        <nav style={{ display: "grid", gap: 8 }}>
          <Link to="/">Dashboard</Link>
          <Link to="/contacts">Contacts</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/deals">Deals</Link>
          <Link to="/activities">Activities</Link>
          <button
            onClick={() => { setToken(null); nav("/login"); }}
            style={{ marginTop: 12 }}
          >
            Logout
          </button>
        </nav>
      </aside>
      <main style={{ padding: 20, overflow: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
