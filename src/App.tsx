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
  const [selected, setSelected] = useState<{ key: string; type: string } | null>(null);

  const filteredData = useMemo(() => {
    if (!selected) return data;
    if (selected.type === "system") {
      return data.filter((row) => row.SD_System === selected.key);
    } else {
      return data.filter((row) => row.SD_Sub_System === selected.key);
    }
  }, [data, selected]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin size="large" />
    </div>
  );

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
      <Sider theme="dark" width={270} style={{ paddingTop: 0, background: "#001529" }}>
        <div style={{
          color: "#fff",
          fontSize: 24,
          padding: 20,
          fontWeight: 700,
          letterSpacing: 2,
          textAlign: "center"
        }}>
          SAPRA
        </div>
        <SidebarTree
          data={data}
          onSelect={(key, type) => setSelected({ key, type })}
        />
      </Sider>
      <Content style={{ padding: 40, background: "#f3f6fa" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 style={{ fontWeight: 800, color: "#004d99", marginBottom: 24, textAlign: "right" }}>داشبورد صنعتی SAPRA</h1>
          <div style={{
            display: "flex",
            gap: 24,
            marginBottom: 36,
            flexWrap: "wrap",
            justifyContent: "start"
          }}>
            {/* آمار کلیدی */}
            {stats.map((stat) => (
              <motion.div
                key={stat}
                whileHover={{ scale: 1.08 }}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "18px 28px",
                  textAlign: "center",
                  boxShadow: "0 2px 8px #b1c8e623",
                  minWidth: 130
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600, color: "#666" }}>{stat.replace("TOTAL ", "")}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#1a237e" }}>{totals[stat]}</div>
              </motion.div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            <PieChart data={filteredData} />
            <BarChart data={filteredData} />
          </div>
        </motion.div>
      </Content>
    </Layout>
  );
}