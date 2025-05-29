import { PieChart as RPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { DataRow } from "../../data/useCsvData";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B71C1C", "#6A1B9A"];

export default function PieChart({ data }: { data: DataRow[] }) {
  // توزیع بر اساس discipline
  const disciplines = Array.from(
    data.reduce((acc, row) => {
      acc.set(row.discipline, (acc.get(row.discipline) || 0) + row["TOTAL ITEM"]);
      return acc;
    }, new Map<string, number>())
  ).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width={400} height={300}>
      <RPieChart>
        <Pie data={disciplines} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110}>
          {disciplines.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RPieChart>
    </ResponsiveContainer>
  );
}