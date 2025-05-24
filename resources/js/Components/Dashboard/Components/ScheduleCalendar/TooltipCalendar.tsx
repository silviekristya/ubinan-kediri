import React from 'react';
import { usePage } from '@inertiajs/react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/Components/ui/tooltip';
import { CalendarEvent } from './ScheduleCalendar';

interface TooltipCalendarProps {
  hits: CalendarEvent[];
  palette?: string[];
}

export function TooltipCalendar({
  hits,
  palette = [
    'bg-purple-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-orange-500',
  ],
}: TooltipCalendarProps) {
  const { auth } = usePage().props as any;
  const role: string = auth.user.role;
  const isMitra: boolean = !!auth.user.mitra;
  const isPml: boolean = auth.user.pegawai?.is_pml;

  // Tentukan kelas bentuk berdasarkan role
  const getShapeClass = () => {
    if (role === 'ADMIN') return 'rounded-full';
    if (isMitra) return 'transform rotate-45';
    return 'rounded-md';
  };
  const shapeClass = getShapeClass();

  // Buat dot; jika PML, isi teks di dalam kotak
  const dots = hits.slice(0, palette.length).map((h, i) => {
    const baseClasses = `${palette[i]} ${shapeClass}`;
    if (isPml) {
      return (
        <span
          key={i}
          className={`${baseClasses} w-full flex p-1 items-center justify-center`}
        >
          <span className="text-[8px] text-white leading-tight text-center whitespace-nowrap overflow-hidden text-ellipsis">
            {h.title}
          </span>
        </span>
      );
    }
    // Admin dan Mitra/role lain
    const size = isMitra ? 'w-4 h-4' : 'w-4 h-4';
    return <span key={i} className={`${baseClasses} ${size}`} />;
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className="absolute bottom-2 left-2 flex space-x-1 pointer-events-auto"
        >
          {dots}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="start" className="bg-gray-800 text-white p-2 rounded text-xs">
        {hits.map((h, i) => (
          <div key={i}>
            <strong>{h.title}</strong><br/>
            {h.description?.split('\n').map((line, j) => (
              <React.Fragment key={j}>{line}<br/></React.Fragment>
            ))}
          </div>
        ))}
      </TooltipContent>
    </Tooltip>
  );
}
