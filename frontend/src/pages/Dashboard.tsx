import { useMemo } from "react";
import { useList } from "../api/hooks";

type Company = {
  id: number;
  name: string;
  domain?: string | null;
  created_at: string;
};

type Contact = {
  id: number;
  first_name: string;
  last_name: string;
  email?: string | null;
  company_id?: number | null;
  created_at: string;
};

type Deal = {
  id: number;
  name: string;
  amount?: number | null;
  stage?: string | null;
  created_at: string;
};

type Activity = {
  id: number;
  type: string;
  subject?: string | null;
  body?: string | null;
  created_at: string;
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        minWidth: 180,
      }}
    >
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function Dashboard() {
  const companies = useList<Company>("companies", "/companies");
  const contacts = useList<Contact>("contacts", "/contacts");
  const deals = useList<Deal>("deals", "/deals");
  const activities = useList<Activity>("activities", "/activities");

  const isLoading =
    companies.isLoading || contacts.isLoading || deals.isLoading || activities.isLoading;

  const recentActivities = useMemo(() => {
    const list = activities.data ?? [];
    return [...list]
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, 8);
  }, [activities.data]);

  const recentDeals = useMemo(() => {
    const list = deals.data ?? [];
    return [...list]
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, 5);
  }, [deals.data]);

  const anyError = companies.error || contacts.error || deals.error || activities.error;

  return (
    <div>
      <h2>Dashboard</h2>

      {anyError ? (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          One or more API calls failed. Check your backend and auth token.
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <StatCard label="Companies" value={(companies.data ?? []).length} />
        <StatCard label="Contacts" value={(contacts.data ?? []).length} />
        <StatCard label="Deals" value={(deals.data ?? []).length} />
        <StatCard label="Activities" value={(activities.data ?? []).length} />
      </div>

      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
            {recentActivities.length === 0 ? (
              <div style={{ color: "#666" }}>No activity yet. Log a note or call.</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {recentActivities.map((a) => (
                  <li key={a.id} style={{ marginBottom: 8 }}>
                    <div>
                      <b>{a.type}</b>
                      {a.subject ? `: ${a.subject}` : ""}
                    </div>
                    {a.body ? <div style={{ color: "#444" }}>{a.body}</div> : null}
                    <div style={{ fontSize: 12, color: "#777" }}>{formatWhen(a.created_at)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Recent Deals</h3>
            {recentDeals.length === 0 ? (
              <div style={{ color: "#666" }}>No deals yet. Add your first deal.</div>
            ) : (
              <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                    <th>Name</th>
                    <th>Stage</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeals.map((d) => (
                    <tr key={d.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                      <td>{d.name}</td>
                      <td>{d.stage ?? ""}</td>
                      <td>{d.amount ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
