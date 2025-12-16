import { useMemo, useState } from "react";
import { useList, useCreate } from "../api/hooks";

type Deal = {
  id: number;
  title: string;
  amount_cents: number;
  stage: string;
  company_id: number;
  primary_contact_id: number;
  created_at: string;
};

const STAGES = ["lead", "qualified", "proposal", "negotiation", "won", "lost"] as const;

export default function Deals() {
  const { data, isLoading, error } = useList<Deal>("deals", "/deals");

  const create = useCreate<
    { title: string; amount_cents: number; stage: string; company_id: number; primary_contact_id: number },
    Deal
  >("deals", "/deals");

  const [title, setTitle] = useState("");
  const [stage, setStage] = useState<string>(STAGES[0]);
  const [amountDollars, setAmountDollars] = useState<string>("");

  // v1: simple numeric inputs for required foreign keys
  const [companyId, setCompanyId] = useState<string>("1");
  const [primaryContactId, setPrimaryContactId] = useState<string>("1");

  const deals = useMemo(() => data ?? [], [data]);

  return (
    <div>
      <h2>Deals</h2>

      <div style={{ display: "flex", gap: 8, margin: "12px 0", alignItems: "center", flexWrap: "wrap" }}>
        <input
          placeholder="Deal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: 260 }}
        />

        <select value={stage} onChange={(e) => setStage(e.target.value)}>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          placeholder="Amount ($)"
          value={amountDollars}
          onChange={(e) => setAmountDollars(e.target.value)}
          style={{ width: 140 }}
          inputMode="decimal"
        />

        <input
          placeholder="Company ID"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          style={{ width: 120 }}
          inputMode="numeric"
        />

        <input
          placeholder="Primary Contact ID"
          value={primaryContactId}
          onChange={(e) => setPrimaryContactId(e.target.value)}
          style={{ width: 160 }}
          inputMode="numeric"
        />

        <button
          onClick={() => {
            const dollars = amountDollars.trim() ? Number(amountDollars) : 0;
            const amount_cents = Math.round(dollars * 100);

            create.mutate({
              title,
              stage,
              amount_cents,
              company_id: Number(companyId),
              primary_contact_id: Number(primaryContactId),
            });

            setTitle("");
            setAmountDollars("");
            setStage(STAGES[0]);
          }}
          disabled={!title || create.isPending}
        >
          Add
        </button>
      </div>

      {error ? <div style={{ color: "crimson" }}>Failed to load deals</div> : null}

      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th>Title</th>
              <th>Stage</th>
              <th>Amount</th>
              <th>Company</th>
              <th>Primary Contact</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d) => (
              <tr key={d.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td>{d.title}</td>
                <td>{d.stage}</td>
                <td>${(d.amount_cents / 100).toFixed(2)}</td>
                <td>{d.company_id}</td>
                <td>{d.primary_contact_id}</td>
                <td>{new Date(d.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
