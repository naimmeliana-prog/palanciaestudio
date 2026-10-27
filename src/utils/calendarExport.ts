/**
 * @fileoverview Utilidades de exportación de tareas y exámenes a Google Calendar (enlace directo y archivo .ics).
 */

import { CalendarEventItem } from '../types';

/**
 * Convierte fecha YYYY-MM-DD y hora HH:mm en cadena UTC compacta para iCalendar / Google Calendar.
 */
export function toGoogleCalendarDateTime(dateStr: string, timeStr: string, addMinutes = 0): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = (timeStr || '17:00').split(':').map(Number);
  const dt = new Date(Date.UTC(year, (month || 1) - 1, day || 1, hour || 17, (minute || 0) + addMinutes, 0));
  return dt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Genera una URL directa para añadir un evento individual a Google Calendar.
 */
export function buildGoogleCalendarUrl(event: CalendarEventItem): string {
  const start = toGoogleCalendarDateTime(event.date, event.time, 0);
  const end = toGoogleCalendarDateTime(event.date, event.time, event.durationMinutes || 45);
  const title = encodeURIComponent(`[${event.category} - ${event.grade}] ${event.title}`);
  const details = encodeURIComponent(
    `CEIP Palancia (Algimia de Alfara)\nCurso: ${event.grade}\nCategoría: ${event.category}\nRecompensa al completar: +${event.rewardMinutesBonus} min de estudio/juego\nNotas: ${event.notes}`
  );
  const location = encodeURIComponent('CEIP Palancia, Algimia de Alfara, Valencia');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

/**
 * Genera el contenido estándar RFC 5545 (.ics) para importar todo el cronograma en Google Calendar, Apple Calendar o Outlook.
 */
export function generateIcsCalendarContent(events: CalendarEventItem[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CEIP Palancia Estudio & Glam//Agenda Escolar ES//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:CEIP Palancia - Estudio y Exámenes',
    'X-WR-TIMEZONE:Europe/Madrid',
  ];

  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  for (const ev of events) {
    const dtStart = toGoogleCalendarDateTime(ev.date, ev.time, 0);
    const dtEnd = toGoogleCalendarDateTime(ev.date, ev.time, ev.durationMinutes || 45);
    const cleanNotes = (ev.notes || '').replace(/\r?\n/g, '\\n');

    lines.push(
      'BEGIN:VEVENT',
      `UID:${ev.id}@ceip-palancia-algimia.es`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:[${ev.category}] ${ev.title} (${ev.grade})`,
      `DESCRIPTION:Curso: ${ev.grade}\\nBonificación: +${ev.rewardMinutesBonus} min\\nNotas: ${cleanNotes}`,
      'LOCATION:CEIP Palancia\\, Algimia de Alfara (València)',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Descarga el archivo .ics generado en el navegador del usuario.
 */
export function downloadIcsFile(events: CalendarEventItem[], filename = 'cronograma-ceip-palancia.ics'): void {
  const icsContent = generateIcsCalendarContent(events);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
