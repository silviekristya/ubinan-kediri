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

interface ScheduleCalendarProps {
  events: CalendarEvent[];
  tileContent?: (args: { date: Date; view: 'month' }) => React.ReactNode;
}

type ViewMode = 'day' | 'week' | 'month' | 'list';

export function ScheduleCalendar({ events, tileContent }: ScheduleCalendarProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? 'list' : 'month');
  const [monthOffset, setMonthOffset] = useState(0);
  const [weekIndex, setWeekIndex] = useState(0);
  
  // Fixed period: start of current month to end of next 2 months
  const periodStart = useMemo(() => dayjs().startOf('month'), []);
  const periodEnd = useMemo(() => dayjs().startOf('month').add(2, 'month').endOf('month'), []);

  // Calculate initial dayIndex to start at today
  const initialDayIndex = useMemo(() => {
    const idx = dayjs().diff(periodStart, 'day');
    return idx < 0 ? 0 : idx;
  }, [periodStart]);
  const [dayIndex, setDayIndex] = useState(initialDayIndex);

  // Clamp monthOffset between 0 and 2
  useEffect(() => {
    setMonthOffset(prev => Math.max(0, Math.min(prev, 2)));
  }, [monthOffset]);

  // Current month view
  const currentMonth = useMemo(
    () => periodStart.clone().add(monthOffset, 'month'),
    [periodStart, monthOffset]
  );

  // Group events by day number in current month
  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    events.forEach(ev => {
      const d = dayjs(ev.date);
      if (d.isSame(currentMonth, 'month')) {
        (map[d.date()] = map[d.date()] || []).push(ev);
      }
    });
    return map;
  }, [events, currentMonth]);

  // Group events by full date string
  const eventsByDate = useMemo(() => {
    return events.reduce((acc, ev) => {
      (acc[ev.date] = acc[ev.date] || []).push(ev);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);
  }, [events]);

  // Build weekly chunks covering full period
  const periodWeeks = useMemo(() => {
    const weeks: dayjs.Dayjs[][] = [];
    let cursor = periodStart.clone().startOf('week');
    while (cursor.isBefore(periodEnd) || cursor.isSame(periodEnd, 'day')) {
      weeks.push(
        Array.from({ length: 7 }, (_, i) => cursor.clone().add(i, 'day'))
      );
      cursor = cursor.add(1, 'week');
    }
    return weeks;
  }, [periodStart, periodEnd]);

  // Clamp indexes
  useEffect(() => {
    setWeekIndex(idx => Math.max(0, Math.min(idx, periodWeeks.length - 1)));
  }, [periodWeeks]);

  useEffect(() => {
    const totalDays = periodEnd.diff(periodStart, 'day') + 1;
    setDayIndex(idx => Math.max(0, Math.min(idx, totalDays - 1)));
  }, [periodStart, periodEnd]);

  // Current day for day view
  const currentDay = useMemo(
    () => periodStart.clone().add(dayIndex, 'day'),
    [periodStart, dayIndex]
  );

  // Render
  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center py-4">
        <CardTitle className="text-2xl font-semibold">
          {viewMode === 'month' && currentMonth.format('MMMM YYYY')}
          {viewMode === 'week' && `${periodWeeks[weekIndex][0].format('DD/MM')} – ${periodWeeks[weekIndex][6].format('DD/MM')}`}
          {viewMode === 'day' && currentDay.format('DD MMMM YYYY')}
          {viewMode === 'list' && 'Daftar Jadwal'}
        </CardTitle>
        <div className="space-x-2 mt-2 sm:mt-0">
          <Button size="sm" variant={viewMode === 'day' ? 'default' : 'outline'} onClick={() => setViewMode('day')}>Hari</Button>
          {!isMobile && <Button size="sm" variant={viewMode === 'week' ? 'default' : 'outline'} onClick={() => { setViewMode('week'); setWeekIndex(0); }}>Minggu</Button>}
          {!isMobile && <Button size="sm" variant={viewMode === 'month' ? 'default' : 'outline'} onClick={() => setViewMode('month')}>Bulan</Button>}
          <Button size="sm" variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')}>List</Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 overflow-hidden px-4">
        {/* Month header */}
        {viewMode === 'month' && !isMobile && (
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium">
            {['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'].map(d => <div key={d}>{d}</div>)}
          </div>
        )}
        <div className="flex-1 overflow-auto space-y-4">
          {/* Month View */}
          {viewMode === 'month' && !isMobile && (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: currentMonth.startOf('month').day() }).map((_, i) => <div key={i} />)}
              {Array.from({ length: currentMonth.daysInMonth() }, (_, idx) => idx + 1).map(dayNum => (
                <div key={dayNum} className={`relative bg-white shadow-sm border rounded-lg p-2 flex flex-col ${currentMonth.date(dayNum).isSame(dayjs(), 'day') ? 'ring-2 ring-blue-300' : 'hover:bg-gray-50'}`}>                  
                  <div className="text-right text-xl font-normal">{dayNum}</div>
                  {tileContent?.({ date: currentMonth.date(dayNum).toDate(), view: 'month' }) || (
                    <div className="flex-1 mt-1 overflow-auto space-y-1 text-xs">
                      {(eventsByDay[dayNum] || []).map((ev,i) => (
                        <div key={i} className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 truncate" title={ev.title}>{ev.title}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Weekly View */}
          {viewMode === 'week' && !isMobile && (
            <>
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium">
                {['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {periodWeeks[weekIndex].map(day => (
                  <div key={day.format()} className="bg-white shadow-sm border rounded-lg p-2 flex flex-col">
                    <strong className="text-xs text-right">{day.format('DD/MM')}</strong>
                    <div className="flex-1 mt-1 text-xs space-y-1">
                      {(eventsByDate[day.format('YYYY-MM-DD')] || []).map((ev,i) => <div key={i}>{ev.title}</div>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => setWeekIndex(w => w - 1)} disabled={weekIndex === 0}>‹ Prev Minggu</Button>
                <Button size="sm" variant="outline" onClick={() => setWeekIndex(w => w + 1)} disabled={weekIndex === periodWeeks.length - 1}>Next Minggu ›</Button>
              </div>
            </>
          )}
          {/* Day View */}
          {viewMode === 'day' && (
            <>
              <div className="space-y-2">
                {(eventsByDate[currentDay.format('YYYY-MM-DD')] || []).map((ev,i) => (
                  <div key={i} className="bg-white shadow-sm border rounded-lg p-2"><strong>{ev.title}</strong><br />{ev.description}</div>
                ))}
                {!eventsByDate[currentDay.format('YYYY-MM-DD')]?.length && <p>Tidak ada event pada hari ini.</p>}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => setDayIndex(d => d - 1)} disabled={dayIndex === 0}>‹ Prev Hari</Button>
                <Button size="sm" variant="outline" onClick={() => setDayIndex(d => d + 1)} disabled={dayIndex === periodEnd.diff(periodStart, 'day')}>Next Hari ›</Button>
              </div>
            </>
          )}
          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-2">
              {events.sort((a,b) => a.date.localeCompare(b.date)).map((ev,i) => (
                <div key={i} className="bg-white shadow-sm border rounded-lg p-2 flex justify-between"><span>{dayjs(ev.date).format('DD MMM YYYY')}</span><span>{ev.title}</span></div>
              ))}
            </div>
          )}
        </div>
        {/* Prev/Next Month Controls */}
        {(!isMobile && viewMode === 'month') && (
          <div className="flex justify-end gap-2 mt-4">
            <Button size="sm" variant="outline" onClick={() => { setMonthOffset(m => m - 1); setWeekIndex(0); setDayIndex(initialDayIndex); }} disabled={monthOffset === 0}>‹ Prev Bulan</Button>
            <Button size="sm" variant="outline" onClick={() => { setMonthOffset(m => m + 1); setWeekIndex(0); setDayIndex(initialDayIndex); }} disabled={monthOffset === 2}>Next Bulan ›</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
