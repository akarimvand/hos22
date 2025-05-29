import { BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { DataRow } from "../../data/useCsvData";

export default function BarChart({ data }: { data: DataRow[] }) {
  // توزیع آمار بر اساس discipline
  const disciplines = Array.from(
    data.reduce((acc, row) => {
      acc.set(row.discipline, {
        name: row.discipline,
        DONE: (acc.get(row.discipline)?.DONE || 0) + row["TOTAL DONE"],
        PENDING: (acc.get(row.discipline)?.PENDING || 0) + row["TOTAL PENDING"],
        PUNCH: (acc.get(row.discipline)?.PUNCH || 0) + row["TOTAL PUNCH"],
      });
      return acc;
    }, new Map<string, any>())
  ).map(([_, value]) => value);

  return (
    <ResponsiveContainer width={500} height={300}>
      <RBarChart data={disciplines}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="DONE" fill="#4caf50" />
        <Bar dataKey="PENDING" fill="#fbc02d" />
        <Bar dataKey="PUNCH" fill="#b71c1c" />
      </RBarChart>
    </ResponsiveContainer>
  );
}