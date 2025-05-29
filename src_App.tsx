import { useState, useMemo } from "react";
import { Layout, Spin } from "antd";
import SidebarTree from "./components/SidebarTree";
import { useCsvData, DataRow } from "./data/useCsvData";
import PieChart from "./components/Charts/PieChart";
import BarChart from "./components/Charts/BarChart";
import { motion } from "framer-motion";

const { Sider, Content } = Layout;

export default function App() {
  const { data, loading } = useCsvData(
    "https://raw.githubusercontent.com/akarimvand/hos/refs/heads/main/data.csv"
  );
  const [selected, setSelected] = useState<{ key: string; type: string } | null>(
    null
  );

  const filteredData = useMemo(() => {
    if (!selected) return data;
    if (selected.type === "system") {
      return data.filter((row) => row.SD_System === selected.key);
    } else {
      return data.filter((row) => row.SD_Sub_System === selected.key);
    }
  }, [data, selected]);

  if (loading) return <Spin />;

  // Calculate aggregated stats
  const stats = [
    "TOTAL ITEM",
    "TOTAL DONE",
    "TOTAL PENDING",
    "TOTAL PUNCH",
    "TOTAL CLEAR PUNCH",
    "TOTAL NOT CLEAR PUNCH",
    "TOTAL HOLD POINT",
  ];

  const totals = stats.reduce((acc, key) => {
    acc[key] = filteredData.reduce((sum, curr) => sum + (curr[key] || 0), 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider theme="dark" width={270}>
        <div style={{ color: "#fff", fontSize: 24, padding: 20, fontWeight: 700, letterSpacing: 2 }}>
          SAPRA
        </div>
        <SidebarTree
          data={data}
          onSelect={(key, type) => setSelected({ key, type })}
        />
      </Sider>
      <Content style={{ padding: 40 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontWeight: 800, color: "#004d99" }}>داشبورد صنعتی SAPRA</h1>
          <div style={{ display: "flex", gap: 40, marginBottom: 30 }}>
            {/* آمار کلیدی */}
            {stats.map((stat) => (
              <motion.div
                key={stat}
                whileHover={{ scale: 1.1 }}
                style={{
                  background: "#f0f4f8",
                  borderRadius: 12,
                  padding: 16,
                  textAlign: "center",
                  boxShadow: "0 2px 8px #b1c8e6",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 600 }}>{stat.replace("TOTAL ", "")}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#1a237e" }}>{totals[stat]}</div>
              </motion.div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 40 }}>
            <PieChart data={filteredData} />
            <BarChart data={filteredData} />
          </div>
        </motion.div>
      </Content>
    </Layout>
  );
}