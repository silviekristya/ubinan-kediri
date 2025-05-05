import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/id";
import { PageProps, WithCsrf } from "@/types";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { ScheduleCalendar } from "@/Components/Dashboard/Components/ScheduleCalendar/ScheduleCalendar";

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

export default function DashboardPage() {
  const { events: rawEvents = [] } = usePage<DashboardPageProps>().props;

  const events = rawEvents.map(ev => ({
    date: ev.date,
    title: ev.title,
    description: ev.subtitle,
  }));

  return (
    <DashboardLayout>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-4 w-full">
        <Card className="w-full shadow-md">
          <CardHeader className="text-base sm:text-xl font-semibold text-center">
            Jadwal Panen
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4">
              <ScheduleCalendar events={events} />
            </div>
          </CardContent>
        </Card>
        {/* …konten lain… */}
      </div>
    </DashboardLayout>
  );
}
