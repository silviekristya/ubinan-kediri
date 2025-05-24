import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/id";
import { PageProps, WithCsrf } from "@/types";
import { ScheduleCalendar } from "@/Components/Dashboard/Components/ScheduleCalendar/ScheduleCalendar";
import DashboardLayout from '@/Layouts/DashboardLayout';
import { TooltipProvider } from '@/Components/ui/tooltip';
import { TooltipCalendar } from '@/Components/Dashboard/Components/ScheduleCalendar/TooltipCalendar';


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

export default function PclDashboard() {
  const { events: rawEvents = [] } = usePage<DashboardPageProps>().props;

  const events = rawEvents.map(ev => ({
    date: ev.date,
    title: ev.title,
    description: ev.subtitle ?? "",
  }));

  return (
    <DashboardLayout>
      <Head title="Dashboard Mitra" />
      <div className="flex flex-col gap-4 w-full">
        <Card className="shadow-md">
            <CardHeader className="text-center font-semibold text-lg">
            Jadwal Panen PCL
            </CardHeader>
            <CardContent className="p-0 overflow-visible">
              <TooltipProvider>
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
              </TooltipProvider>
            </CardContent>
          </Card>
        {/* …konten lain… */}
      </div>
    </DashboardLayout>
  );
}
