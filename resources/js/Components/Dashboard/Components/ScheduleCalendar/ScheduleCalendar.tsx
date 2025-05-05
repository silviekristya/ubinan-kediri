import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { Button } from '@/Components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/Components/ui/card';

interface Event { date: string; title: string; }

export function ScheduleCalendar({ events }: { events: Event[] }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = dayjs();
  const month = useMemo(() => today.add(monthOffset, 'month'), [monthOffset]);

  // Siapkan padding kosong sampai weekday pertama + array tanggal
  const blanks = Array.from({ length: month.startOf('month').day() }, () => null);
  const days = Array.from({ length: month.daysInMonth() }, (_, i) => i + 1);

  // Kelompokkan events per hari
  const eventsByDay = useMemo(() => {
    const map: Record<number, Event[]> = {};
    events.forEach(ev => {
      const d = dayjs(ev.date);
      if (d.isSame(month, 'month')) {
        map[d.date()] = (map[d.date()] || []).concat(ev);
      }
    });
    return map;
  }, [events, month]);

  return (
    <Card className="w-full">
      {/* Header with month title centered */}
      <CardHeader className="flex justify-center py-4">
        <CardTitle className="text-2xl font-semibold">
          {month.format('MMMM YYYY')}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4">
        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {blanks.map((_, i) => (
            <div key={i} className="h-20" />
          ))}
          {days.map(d => {
            const isToday = month.date(d).isSame(today, 'day');
            return (
              <div
                key={d}
                className={
                  `border rounded-lg p-2 flex flex-col h-20 overflow-hidden transition-colors
                   ${isToday ? 'ring-2 ring-blue-300' : 'hover:bg-gray-50'}`
                }
              >
                <div className="text-xs font-semibold text-right">{d}</div>
                <div className="flex-1 overflow-auto space-y-1 text-xs">
                  {(eventsByDay[d] || []).map((ev, i) => (
                    <div
                      key={i}
                      className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 truncate"
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation buttons at bottom right */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMonthOffset(m => m - 1)}
            disabled={monthOffset === 0}
          >
            ‹ Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setMonthOffset(m => m + 1)}
            disabled={monthOffset === 2}
          >
            Next ›
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
