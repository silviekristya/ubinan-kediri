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
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/Components/ui/tooltip';
import { TooltipCalendar } from '@/Components/Dashboard/Components/ScheduleCalendar/TooltipCalendar';

dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.locale("id");

interface CalendarEvent {
  date: string;
  title: string;
  description: string;
}

interface RawEvent {
  date: string;
  nama_lok: string;
  pml: string;
  pcl: string;
}

interface DashboardPageProps extends PageProps<{ events: RawEvent[] }>, WithCsrf {
  [key: string]: any; 
}

export default function AdminDashboard() {
  const { events: rawEvents = [] } = usePage<DashboardPageProps>().props;

  const calendarEvents: CalendarEvent[] = rawEvents.map(ev => ({
    date: ev.date,
    title: `Lokasi Panen: ${ev.nama_lok}`,
    description: `PML: ${ev.pml}\nPCL: ${ev.pcl}`,
  }));

  return (
    <DashboardLayout>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-4 w-full">
        <Card className="w-full shadow-md">
          <CardHeader className="text-base sm:text-xl font-semibold text-center">
            Jadwal Panen
          </CardHeader>
          {/* Tambahkan `relative` di sini */}
          <CardContent className="p-0 overflow-visible">
            {/* Bungkus kalender dengan satu TooltipProvider */}
            <TooltipProvider>
              <div
                className="relative px-4 py-2"
              >                
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
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
