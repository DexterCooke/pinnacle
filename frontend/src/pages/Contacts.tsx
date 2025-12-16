import { useState } from "react";
import { useList, useCreate } from "../api/hooks";

type Contact = {
  id: number;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  company_id?: number | null;
};

export default function Contacts() {
  const { data, isLoading } = useList<Contact>("contacts", "/contacts");
  const create = useCreate<Partial<Contact>, Contact>("contacts", "/contacts");

  const [first_name, setFirst] = useState("");
  const [last_name, setLast] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div>
      <h2>Contacts</h2>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input placeholder="First" value={first_name} onChange={(e) => setFirst(e.target.value)} />
        <input placeholder="Last" value={last_name} onChange={(e) => setLast(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button
          onClick={() => create.mutate({ first_name, last_name, email })}
          disabled={create.isPending || !first_name || !last_name}
        >
          Add
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th>Name</th><th>Email</th><th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.email ?? ""}</td>
                <td>{c.phone ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
