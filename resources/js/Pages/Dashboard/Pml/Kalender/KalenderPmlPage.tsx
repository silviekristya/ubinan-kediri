// resources/js/Pages/Dashboard/Pml/Beranda/KalenderPanenPage.tsx

import React, { useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/inertia';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/id';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { ScheduleCalendar } from '@/Components/Dashboard/Components/ScheduleCalendar/ScheduleCalendar';
import { TooltipProvider } from '@/Components/ui/tooltip';
import { TooltipCalendar } from '@/Components/Dashboard/Components/ScheduleCalendar/TooltipCalendar';
import { Card, CardHeader, CardContent } from '@/Components/ui/card';
import { WithCsrf } from '@/types';

dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.locale('id');

export default function KalenderPanenPml() {
  interface PmlPageProps extends PageProps, WithCsrf {
    events: Array<{
      date: string;      // server should send in 'YYYY-MM-DD'
      title: string;     // e.g. "Panen PCL XYZ"
      subtitle: string;  // e.g. "Lokasi ... "
    }>;
    auth: any;
    csrf_token: string;
    errors: Record<string, any>;
    flash: { success?: string; warning?: string; error?: string };
  }

  const { events: rawEvents = [] } = usePage<PmlPageProps>().props;

  // Normalize events for calendar component
  const calendarEvents = useMemo(
    () =>
      rawEvents.map(ev => ({
        date: ev.date,            // expect ISO 'YYYY-MM-DD'
        title: ev.title,
        description: ev.subtitle, // tooltip content
      })),
    [rawEvents]
  );

  return (
    <DashboardLayout>
      <Head title="Kalender Panen PML" />

      <div className="flex flex-col gap-4 w-full">
        <Card className="w-full shadow-md">
            <CardHeader className="text-base sm:text-xl font-semibold text-center">
                Kalender Panen
            </CardHeader>
            <CardContent className="p-0 overflow-visible relative">
                <TooltipProvider>
                <div className="relative p-4">
                    <ScheduleCalendar
                    events={calendarEvents}
                    tileContent={({ date, view }) => {
                        if (view !== 'month') return null;
                        const key = dayjs(date).format('DD-MM-YYYY');
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
