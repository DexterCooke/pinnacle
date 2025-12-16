import { useState } from "react";
import { useList, useCreate } from "../api/hooks";

type Activity = {
  id: number;
  type: string;          // "call" | "email" | "note" | etc
  subject?: string | null;
  body?: string | null;
  contact_id?: number | null;
  company_id?: number | null;
  deal_id?: number | null;
  created_at: string;
};

export default function Activities() {
  const { data, isLoading, error } = useList<Activity>("activities", "/activities");
  const create = useCreate<
    { type: string; subject?: string; body?: string },
    Activity
  >("activities", "/activities");

  const [type, setType] = useState("note");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  return (
    <div>
      <h2>Activities</h2>

      <div style={{ display: "flex", gap: 8, margin: "12px 0", alignItems: "center" }}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="note">note</option>
          <option value="call">call</option>
          <option value="email">email</option>
          <option value="task">task</option>
        </select>

        <input
          placeholder="Subject (optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ width: 240 }}
        />

        <input
          placeholder="Details (optional)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ width: 320 }}
        />

        <button
          onClick={() => {
            create.mutate({
              type,
              subject: subject || undefined,
              body: body || undefined,
            });
            setSubject("");
            setBody("");
          }}
          disabled={create.isPending}
        >
          Add
        </button>
      </div>

      {error ? <div style={{ color: "crimson" }}>Failed to load activities</div> : null}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th>Type</th>
              <th>Subject</th>
              <th>Details</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((a) => (
              <tr key={a.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td>{a.type}</td>
                <td>{a.subject ?? ""}</td>
                <td>{a.body ?? ""}</td>
                <td>{new Date(a.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
