// resources/js/Pages/Dashboard/Mitra/Beranda/KalenderPanenPage.tsx

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

export default function KalenderPanenMitra() {
    interface MitraPageProps extends PageProps {
        events: Array<{
            date: string;
            title: string;
            subtitle: string;
        }>;
        csrf_token: string;
        auth: any;
    }
    const { events: rawEvents = [] } = usePage<MitraPageProps>().props;

    const calendarEvents = useMemo(
        () =>
        rawEvents.map(ev => ({
            date: ev.date, // format date to YYYY-MM-DD
            title: ev.title,
            description: ev.subtitle,       // gunakan subtitle sebagai description
        })),
        [rawEvents]
    );

    return (
        <DashboardLayout>
        <Head title="Kalender Panen Mitra" />

        <div className="w-full shadow-md">
            <Card className="w-full shadow-md">
            <CardHeader className="text-base sm:text-xl font-semibold text-center">
                Kalender Panen
            </CardHeader>
            <CardContent className="p-0 overflow-visible relative">
                <TooltipProvider>
                <div className="relative p4">
                    <ScheduleCalendar
                    events={calendarEvents}
                    tileContent={({ date, view }) => {
                        // hanya show tooltip di bulan
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
