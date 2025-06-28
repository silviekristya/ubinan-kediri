// resources/js/Pages/Dashboard/Admin/Beranda/Dashboard.tsx

import React, { useMemo } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/id";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { PageProps, WithCsrf } from "@/types";
// import { ScheduleCalendar } from "@/Components/Dashboard/Components/ScheduleCalendar/ScheduleCalendar";
// import {
//   Tooltip,
//   TooltipProvider,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/Components/ui/tooltip";
// import { TooltipCalendar } from "@/Components/Dashboard/Components/ScheduleCalendar/TooltipCalendar";
import { Progress } from "@/Components/ui/progress";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  Legend,
} from "recharts";

dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.locale("id");

interface RawEvent {
  date: string;
  nama_lok: string;
  pml: string;
  pcl: string;
}

interface DashboardPageProps
  extends PageProps<{
    events: RawEvent[];
    progress: Record<string, { label: string; done: number; total: number }>;
    productivityChart: Record<string, any>[];
  }>,
    WithCsrf {
  [key: string]: unknown;
}

export default function AdminDashboard() {
  const {
    events: rawEvents = [],
    progress = {},
    productivityChart = [],
  } = usePage<DashboardPageProps>().props;

  // Prepare calendar events
  const calendarEvents = useMemo(
    () =>
      rawEvents.map((ev) => ({
        date: ev.date,
        title: `Lokasi Panen: ${ev.nama_lok}`,
        description: `PML: ${ev.pml}\nPCL: ${ev.pcl}`,
      })),
    [rawEvents]
  );

  // Collect kecamatan keys for the chart
  const kecamatans = useMemo(() => {
    const keys = new Set<string>();
    productivityChart.forEach((row) => {
      Object.keys(row).forEach((k) => {
        if (k !== "subround") keys.add(k);
      });
    });
    return Array.from(keys);
  }, [productivityChart]);

  return (
    <DashboardLayout>
      <Head title="Dashboard" />

      <div className="flex flex-col gap-6 w-full">
        {/* Calendar */}
        <Card className="shadow">
          <CardHeader className="text-center font-semibold text-lg">
            Jadwal Panen
          </CardHeader>
          <CardContent className="p-0 overflow-visible relative">
            {/* <TooltipProvider>
              <div className="relative px-4 py-2">
                <ScheduleCalendar
                  events={calendarEvents}
                  tileContent={({ date, view }) => {
                    if (view !== 'month') return null;
                    const key = dayjs(date).format('YYYY-MM-DD');
                    const hits = calendarEvents.filter(e => e.date === key);
                    if (!hits.length) return null;
                    return <TooltipCalendar hits={hits} />;
                  }}
                />
              </div>
            </TooltipProvider> */}
            <div className="mb-6 justify-center text-center">
              <Link
                href={route('dashboard.kalender')}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Lihat Jadwal Panen
              </Link>
            </div>
          </CardContent>
        </Card>
        

        {/* Progress bars side-by-side (two columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(progress).map(([key, { label, done, total }]) => {
            const percent = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <Card key={key} className="shadow">
                <CardHeader className="font-medium text-base">
                  {label} Progress
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <span>{done} / {total}</span>
                    <span>{percent}%</span>
                  </div>
                  <Progress value={percent} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 3) Productivity Chart */}
        <Card className="shadow">
          <CardHeader className="text-center font-semibold text-lg">
            Produktivitas per Kecamatan per Subround
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={productivityChart}>
                <XAxis dataKey="subround" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <RechartTooltip />
                <Legend />
                {kecamatans.map((kec) => (
                  <Line
                    key={kec}
                    type="monotone"
                    dataKey={kec}
                    connectNulls
                    strokeWidth={2}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
