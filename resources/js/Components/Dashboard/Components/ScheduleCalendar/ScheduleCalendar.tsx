import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import { Button } from '@/Components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';

dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.locale('id');

export interface CalendarEvent {
  date: string;
  title: string;
  description?: string;
}

export interface TileContentArgs {
  date: Date;
  view: 'month';
}
export type TileContentFn = (args: TileContentArgs) => React.ReactNode;

interface ScheduleCalendarProps {
  events: CalendarEvent[];
  tileContent?: TileContentFn;
  viewportOffset?: number;
}

type ViewMode = 'day' | 'week' | 'month' | 'list';

export function ScheduleCalendar({
  events,
  tileContent,
  viewportOffset = 140,
}: ScheduleCalendarProps) {
  // Responsive default view: list on small screens
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? 'list' : 'month');
  const [monthOffset, setMonthOffset] = useState(0);
  const today = dayjs();
  const month = useMemo(() => today.add(monthOffset, 'month'), [monthOffset]);

  // Adjust view on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 640 && viewMode === 'month') {
        setViewMode('list');
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [viewMode]);

  // viewport height for card
  const [vh, setVh] = useState(() => window.innerHeight);
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // prepare events grouping
  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    events.forEach(ev => {
      const d = dayjs(ev.date);
      if (d.isSame(month, 'month')) {
        const dayNum = d.date();
        map[dayNum] = map[dayNum] || [];
        map[dayNum].push(ev);
      }
    });
    return map;
  }, [events, month]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach(ev => {
      map[ev.date] = map[ev.date] || [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  // week range
  const periodStart = month.startOf('month').startOf('week')
  const periodEnd   = month.add(2, 'month').endOf('month').endOf('week')

  const periodWeeks = useMemo(() => {
    const weeks: dayjs.Dayjs[][] = [];
    let cursor = periodStart.clone();
    while (cursor.isBefore(periodEnd, 'day')) {
      weeks.push(
        Array.from({ length: 7 }, (_, i) => cursor.clone().add(i, 'day'))
      );
      cursor = cursor.add(1, 'week');
    }
    return weeks;
  }, [periodStart, periodEnd]);

  // state minggu aktif
  const [weekIndex, setWeekIndex] = useState(0);
  const currentWeek = periodWeeks[weekIndex] || [];

  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center py-4">
        <CardTitle className="text-2xl font-semibold">
          {viewMode === 'month' && month.format('MMMM YYYY')}
          {viewMode === 'week' && `Minggu: ${currentWeek[0].format('DD/MM')} – ${currentWeek[6].format('DD/MM')}`}          
          {viewMode === 'day' && today.format('DD MMMM YYYY')}
          {viewMode === 'list' && 'Daftar Jadwal'}
        </CardTitle>
        <div className="mt-2 sm:mt-0 space-x-2">
          <Button size="sm" variant={viewMode === 'day' ? 'default' : 'outline'} onClick={() => setViewMode('day')}>Hari</Button>
          {!isMobile && <Button size="sm" variant={viewMode === 'week' ? 'default' : 'outline'} onClick={() => setViewMode('week')}>Minggu</Button>}
          {!isMobile && <Button size="sm" variant={viewMode === 'month' ? 'default' : 'outline'} onClick={() => setViewMode('month')}>Bulan</Button>}
          <Button size="sm" variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')}>List</Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 flex flex-col flex-1 overflow-hidden">
        {/* Weekday header only for month on desktop */}
        {viewMode === 'month' && !isMobile && (
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium">
            {['Minggu', 'Senin', 'Selasa','Rabu','Kamis','Jumat','Sabtu'].map(d => <div key={d}>{d}</div>)}
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {/* Month View */}
          {viewMode === 'month' && !isMobile && (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: month.startOf('month').day() }).map((_, i) => <div key={`b${i}`} />)}
              {Array.from({ length: month.daysInMonth() }, (_, i) => i + 1).map(d => {
                const isToday = month.date(d).isSame(today, 'day');
                const cellDate = month.date(d).toDate();
                const hits = eventsByDay[d] || [];
                return (
                  <div key={d} className={`relative bg-white shadow-sm border rounded-lg p-2 flex flex-col overflow-visible transition-colors ${isToday ? 'ring-2 ring-blue-300' : 'hover:bg-gray-50'}`}>                  
                    <div className="text-xl font-normal text-right">{d}</div>
                    {tileContent ? tileContent({ date: cellDate, view: 'month' }) : (
                      <div className="flex-1 mt-1 overflow-auto space-y-1 text-xs">
                        {hits.map((ev, i) => <div key={i} className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 truncate" title={ev.title}>{ev.title}</div>)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Week View */}
          {viewMode === 'week' && !isMobile && (
            <div className="grid grid-cols-7 gap-2">
              {currentWeek.map(day => {
                const key = day.format('YYYY-MM-DD');
                const hits = eventsByDate[key] || [];
                return (
                  <div key={key} className="bg-white shadow-sm border rounded-lg p-2 flex flex-col">
                    <strong className="text-xs text-right">{day.format('DD/MM')}</strong>
                    <div className="flex-1 mt-1 text-xs space-y-1">
                      {hits.map((ev, i) => <div key={i} title={ev.title}>{ev.title}</div>)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Day View */}
          {viewMode === 'day' && (
            <div className="space-y-2">
              {(eventsByDate[today.format('YYYY-MM-DD')] || []).map((ev, i) => (
                <div key={i} className="bg-white shadow-sm border rounded-lg p-2">
                  <strong>{ev.title}</strong><br />{ev.description}
                </div>
              )) || <p>Tidak ada event hari ini.</p>}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-2">
              {events.sort((a, b) => a.date.localeCompare(b.date)).map((ev, i) => (
                <div key={i} className="bg-white shadow-sm border rounded-lg p-2 flex justify-between">
                  <span>{dayjs(ev.date).format('DD MMM YYYY')}</span>
                  <span>{ev.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prev/Next only on desktop and month/week/day */}
        {(!isMobile && (viewMode === 'month' || viewMode === 'week' || viewMode === 'day')) && (
          <div className="flex justify-end gap-2 mt-4">
            <Button size="sm" variant="outline" onClick={() => setMonthOffset(m => m - 1)} disabled={viewMode === 'month' && monthOffset === 0}>‹ Prev</Button>
            <Button size="sm" variant="outline" onClick={() => setMonthOffset(m => m + 1)} disabled={viewMode === 'month' && monthOffset === 2}>Next ›</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
