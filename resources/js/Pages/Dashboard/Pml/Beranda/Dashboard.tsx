import React from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/id";
import { PageProps, WithCsrf } from "@/types";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { ScheduleCalendar } from "@/Components/Dashboard/Components/ScheduleCalendar/ScheduleCalendar";
import { TooltipProvider } from "@/Components/ui/tooltip";
import { TooltipCalendar } from "@/Components/Dashboard/Components/ScheduleCalendar/TooltipCalendar";


dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.locale("id");

interface Event {
  date: string;
  title: string;
  subtitle?: string;
}

interface DashboardPageProps extends PageProps<{ events: Event[] }>, WithCsrf {
  [key: string]: any; 
}

export default function PmlDashboard() {
  const { events: rawEvents = [] } = usePage<DashboardPageProps>().props;

  const events = rawEvents.map(ev => ({
    date: ev.date,
    title: ev.title,
    description: ev.subtitle ?? "",
  }));

  return (
    <DashboardLayout>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-4 w-full">
        <Card className="w-full shadow-md">
          <CardHeader className="text-base sm:text-xl font-semibold text-center">
            Jadwal Panen
          </CardHeader>
          <CardContent className="p-0 overflow-visible">
            {/* <TooltipProvider>
              <div className="relative p-4">
                <ScheduleCalendar
                  events={events}
                  tileContent={({ date, view }) => {
                    if (view !== "month") return null;
                    const key = dayjs(date).format("YYYY-MM-DD");
                    const hits = events.filter(e => e.date === key);
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
        {/* …konten lain… */}
      </div>
    </DashboardLayout>
  );
}
