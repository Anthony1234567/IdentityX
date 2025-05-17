// src/hooks/useEventSummary.ts
import { useEffect, useState } from "react";

export interface TrendEntry {
  date: string;
  provider: string;
  count: number;
}

export interface EventSummary {
  totalAccounts: number;
  totalLogins: number;
  totalActiveSessions: number;
  trendData: TrendEntry[];
  rawEvents: any[];
}

export function useEventSummary(range: "7d" | "30d" | "90d") {
  const [data, setData] = useState<EventSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/events/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch summary");
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [range]);

  return { data, loading, error };
}
