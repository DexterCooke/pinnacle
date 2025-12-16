import { useState } from "react";
import { useList, useCreate } from "../api/hooks";

type Company = {
  id: number;
  name: string;
  domain?: string | null;
  created_at: string;
};

export default function Companies() {
  const { data, isLoading, error } = useList<Company>("companies", "/companies");
  const create = useCreate<{ name: string; domain?: string }, Company>("companies", "/companies");

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");

  return (
    <div>
      <h2>Companies</h2>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input
          placeholder="Company name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Domain (optional)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button
          onClick={() => {
            create.mutate({ name, domain: domain || undefined });
            setName("");
            setDomain("");
          }}
          disabled={!name || create.isPending}
        >
          Add
        </button>
      </div>

      {error ? <div style={{ color: "crimson" }}>Failed to load companies</div> : null}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th>Name</th>
              <th>Domain</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td>{c.name}</td>
                <td>{c.domain ?? ""}</td>
                <td>{new Date(c.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
