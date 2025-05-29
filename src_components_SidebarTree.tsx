import { Tree } from "antd";
import type { DataRow } from "../data/useCsvData";

type Props = {
  data: DataRow[];
  onSelect: (key: string, type: "system" | "subsystem") => void;
};

export default function SidebarTree({ data, onSelect }: Props) {
  const treeData = Array.from(
    data.reduce((acc, row) => {
      if (!acc.has(row.SD_System)) {
        acc.set(row.SD_System, {
          title: row.SD_System_Name,
          key: row.SD_System,
          children: [],
        });
      }
      acc.get(row.SD_System)!.children.push({
        title: row.SD_Subsystem_Name,
        key: row.SD_Sub_System,
      });
      return acc;
    }, new Map())
  ).map(([_, value]) => value);

  return (
    <Tree
      treeData={treeData}
      onSelect={(keys, e) => {
        const type = e.node.children ? "system" : "subsystem";
        onSelect(keys[0] as string, type);
      }}
      style={{ direction: "rtl", width: 250 }}
    />
  );
}