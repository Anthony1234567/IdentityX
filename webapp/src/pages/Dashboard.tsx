import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import { DataTable } from "@/components/data-table";

interface TrendEntry {
  date: string;
  provider: string;
  count: number;
}

interface EventSummaryResponse {
  totalAccounts: number;
  totalLogins: number;
  totalActiveSessions: number;
  trendData: TrendEntry[];
  rawEvents: any[];
}

export default function Dashboard() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const [data, setData] = useState<EventSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/events/summary/${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch summary");
        return res.json();
      }),
      fetch(`/api/events/681970de4658807d2e443b4a`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      }),
    ])
      .then(([summaryData, rawEvents]) => {
        const sessions: Record<string, string[]> = {};

        rawEvents.sort(
          (a: any, b: any) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        for (const event of rawEvents) {
          const account = event.accountName;
          if (!account) continue;
          if (!sessions[account]) sessions[account] = [];

          if (event.type === "login") {
            sessions[account].push(event.timestamp);
          } else if (event.type === "logout" && sessions[account].length > 0) {
            sessions[account].pop();
          }
        }

        const totalActiveSessions = Object.values(sessions).reduce(
          (acc, logins) => acc + logins.length,
          0
        );

        const totalLogins = rawEvents.filter(
          (e: any) => e.type === "login"
        ).length;

        setData({
          ...summaryData,
          totalLogins,
          totalActiveSessions,
          rawEvents,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [range]);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error || !data)
    return <div className="p-6 text-red-500">{error ?? "No data"}</div>;

  // Collect all unique providers from trend data and raw events
  const allProviders = Array.from(
    new Set([
      ...data.trendData.map((entry) => entry.provider),
      ...data.rawEvents.map((entry) => entry.provider),
    ])
  ).filter(Boolean); // remove undefined/null

  // Normalize chart data so each date has all providers with default 0
  const dateToProvidersMap: Record<string, Record<string, number>> = {};
  for (const { date, provider, count } of data.trendData) {
    if (!dateToProvidersMap[date]) {
      dateToProvidersMap[date] = {};
      allProviders.forEach((p) => (dateToProvidersMap[date][p] = 0));
    }
    dateToProvidersMap[date][provider] = count;
  }

  const chartData = Object.entries(dateToProvidersMap).map(
    ([date, providers]) => ({
      date,
      ...providers,
    })
  );

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header + Filters */}
        <section className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Welcome Back</h1>
          <div className="flex gap-2">
            <ToggleGroup
              type="single"
              value={range}
              onValueChange={(val) => val && setRange(val as any)}
              variant="outline"
            >
              <ToggleGroupItem value="7d">7d</ToggleGroupItem>
              <ToggleGroupItem value="30d">30d</ToggleGroupItem>
              <ToggleGroupItem value="90d">90d</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </section>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Accounts</CardTitle>
              <CardDescription>
                {data.totalAccounts?.toLocaleString?.() ?? "0"} accounts
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Logins</CardTitle>
              <CardDescription>
                {data.totalLogins?.toLocaleString?.() ?? "0"} logins
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                {data.totalActiveSessions?.toLocaleString?.() ?? "0"} sessions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Login Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="w-full h-[300px]" config={{}}>
              <AreaChart data={chartData}>
                <defs>
                  {allProviders.map((provider) => (
                    <linearGradient
                      key={provider}
                      id={`fill-${provider}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--primary)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                />
                {allProviders.map((provider) => (
                  <Area
                    key={provider}
                    dataKey={provider}
                    type="monotone"
                    stackId="a"
                    stroke="var(--primary)"
                    fill={`url(#fill-${provider})`}
                  />
                ))}
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Raw Event Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Raw Event Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {data.rawEvents.length === 0 ? (
              <p className="text-muted-foreground">No raw events available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-border">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 text-left">Timestamp</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Provider</th>
                      <th className="px-4 py-2 text-left">Account</th>
                      <th className="px-4 py-2 text-left">IP</th>
                      <th className="px-4 py-2 text-left">Location</th>
                      <th className="px-4 py-2 text-left">Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rawEvents.map((event, idx) => (
                      <tr key={event._id || idx} className="border-t">
                        <td className="px-4 py-2">
                          {new Date(event.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">{event.type}</td>
                        <td className="px-4 py-2">{event.provider}</td>
                        <td className="px-4 py-2">{event.accountName}</td>
                        <td className="px-4 py-2">{event.ip}</td>
                        <td className="px-4 py-2">{event.location}</td>
                        <td className="px-4 py-2">{event.device}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
