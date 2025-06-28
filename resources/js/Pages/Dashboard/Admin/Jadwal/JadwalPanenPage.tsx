// resources/js/Pages/Dashboard/Admin/JadwalPanen/Index.tsx

import React, { useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/id';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { ScheduleCalendar } from "@/Components/Dashboard/Components/ScheduleCalendar/ScheduleCalendar";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/Components/ui/tooltip";
import { TooltipCalendar } from "@/Components/Dashboard/Components/ScheduleCalendar/TooltipCalendar";
import { Card, CardHeader, CardContent } from "@/Components/ui/card";
import { PageProps } from '@/types';


dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.locale('id');

export default function JadwalPanen() {
  interface CustomPageProps extends PageProps {
    events: Array<{ date: string; nama_lok: string; pml: string; pcl: string }>;
  }

  const { events: rawEvents = [] } = usePage<CustomPageProps>().props;

  const calendarEvents = useMemo(
    () =>
      rawEvents.map(ev => ({
        date: ev.date,
        title: `Lokasi Panen: ${ev.nama_lok}`,
        description: `PML: ${ev.pml}\nPCL: ${ev.pcl}`,
      })),
    [rawEvents]
  );

  return (
    <DashboardLayout>
      <Head title="Jadwal Panen" />

      <div className="p-4">
         <Card className="shadow">
            <CardHeader className="text-center font-semibold text-lg">
                Jadwal Panen
            </CardHeader>
            <CardContent className="p-0 overflow-visible relative">
                <TooltipProvider>
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
                </TooltipProvider>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
