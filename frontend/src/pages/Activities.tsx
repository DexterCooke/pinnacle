import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";

type ActivityType = "note" | "call" | "email" | "task" | "meeting";

type Activity = {
  id: number;
  type: ActivityType;
  subject?: string | null;
  body?: string | null;
  created_at: string;
  company_id?: number | null;
  contact_id?: number | null;
  deal_id?: number | null;
};

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function Activities() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // form state
  const [type, setType] = useState<ActivityType>("note");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const canAdd = useMemo(() => {
    // allow empty subject, but require something in body for sanity
    return body.trim().length > 0;
  }, [body]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get<Activity[]>("/activities");
      // newest first
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setItems(sorted);
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        "Failed to load activities";
      setErr(String(msg));
    } finally {
      setLoading(false);
    }
  }

  async function add() {
    if (!canAdd) return;

    setErr(null);
    try {
      await api.post("/activities", {
        type,
        subject: subject.trim() ? subject.trim() : null,
        body: body.trim(),
        // optional linking fields; keep null for now
        company_id: null,
        contact_id: null,
        deal_id: null,
      });

      // reset form
      setSubject("");
      setBody("");
      setType("note");

      // refresh list
      await load();
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        JSON.stringify(e?.response?.data) ||
        e?.message ||
        "Failed to add activity";
      setErr(String(msg));
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1>Activities</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <select value={type} onChange={(e) => setType(e.target.value as ActivityType)}>
          <option value="note">note</option>
          <option value="call">call</option>
          <option value="email">email</option>
          <option value="meeting">meeting</option>
          <option value="task">task</option>
        </select>

        <input
          placeholder="Subject (optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ width: 260 }}
        />

        <input
          placeholder="Details"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ width: 420 }}
        />

        <button type="button" onClick={add} disabled={!canAdd}>
          Add
        </button>
      </div>

      {err && (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          {err}
        </div>
      )}

      {loading ? (
        <div>Loading…</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th style={{ padding: "8px 6px" }}>Type</th>
              <th style={{ padding: "8px 6px" }}>Subject</th>
              <th style={{ padding: "8px 6px" }}>Details</th>
              <th style={{ padding: "8px 6px" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td style={{ padding: 10 }} colSpan={4}>
                  No activities yet.
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px 6px" }}>{a.type}</td>
                  <td style={{ padding: "8px 6px" }}>{a.subject ?? ""}</td>
                  <td style={{ padding: "8px 6px" }}>{a.body ?? ""}</td>
                  <td style={{ padding: "8px 6px" }}>{fmtDate(a.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
