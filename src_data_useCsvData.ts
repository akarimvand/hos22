import { useEffect, useState } from "react";
import Papa from "papaparse";

export interface DataRow {
  SD_System: string;
  SD_System_Name: string;
  SD_Sub_System: string;
  SD_Subsystem_Name: string;
  discipline: string;
  "TOTAL ITEM": number;
  "TOTAL DONE": number;
  "TOTAL PENDING": number;
  "TOTAL PUNCH": number;
  "TOTAL CLEAR PUNCH": number;
  "TOTAL NOT CLEAR PUNCH": number;
  "TOTAL HOLD POINT": number;
}

export function useCsvData(url: string) {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        Papa.parse<DataRow>(text, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            setData(result.data as DataRow[]);
            setLoading(false);
          },
        });
      });
  }, [url]);

  return { data, loading };
}