/**
 * @fileoverview Calendario Interactivo Personalizado para CEIP Palancia (4º a 6º de Primaria).
 * Organiza deberes, exámenes y proyectos con exportación directa a Google Calendar (.ics y URL)
 * y bonificación automática de tiempo de estudio/recompensa al completar entregas.
 */

import React, { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Download,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  CalendarEventItem,
  CourseGrade,
  SubjectId,
  TaskCategory,
} from '../types';
import {
  buildGoogleCalendarUrl,
  downloadIcsFile,
} from '../utils/calendarExport';

interface CalendarPlannerProps {
  events: CalendarEventItem[];
  selectedGrade: CourseGrade;
  multiplierFactorX: number;
  onToggleComplete: (eventId: string) => void;
  onAddEvent: (newEvent: Omit<CalendarEventItem, 'id' | 'completed'>) => void;
  onDeleteEvent: (eventId: string) => void;
  onSendReminderNotification: (event: CalendarEventItem) => void;
}

const SUBJECT_NAMES: Record<SubjectId, string> = {
  [SubjectId.MATEMATICAS]: 'Matemáticas',
  [SubjectId.CASTELLANO]: 'Castellano: Lengua',
  [SubjectId.VALENCIA]: 'Valencià: Llengua',
  [SubjectId.MEDI]: 'Coneixement del Medi',
  [SubjectId.INGLES]: 'Inglés (English)',
  [SubjectId.ARTISTICA]: 'Artística y Música',
};

export const CalendarPlanner: React.FC<CalendarPlannerProps> = ({
  events,
  selectedGrade,
  multiplierFactorX,
  onToggleComplete,
  onAddEvent,
  onDeleteEvent,
  onSendReminderNotification,
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | TaskCategory>('ALL');
  const [filterGrade, setFilterGrade] = useState<'ALL' | CourseGrade>('ALL');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');

  // Estado del formulario para añadir deberes o examen
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState<SubjectId>(SubjectId.MATEMATICAS);
  const [grade, setGrade] = useState<CourseGrade>(selectedGrade);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.HOMEWORK);
  const [date, setDate] = useState('2026-10-31');
  const [time, setTime] = useState('17:30');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [rewardMinutesBonus, setRewardMinutesBonus] = useState(10);
  const [notes, setNotes] = useState('');

  const filteredEvents = useMemo(() => {
    return events
      .filter((ev) => (filterCategory === 'ALL' ? true : ev.category === filterCategory))
      .filter((ev) => (filterGrade === 'ALL' ? true : ev.grade === filterGrade))
      .filter((ev) => (selectedDateFilter ? ev.date === selectedDateFilter : true))
      .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  }, [events, filterCategory, filterGrade, selectedDateFilter]);

  // Fechas únicas con eventos para la vista de calendario rápido
  const upcomingDates = useMemo(() => {
    const map = new Map<string, { count: number; hasExam: boolean }>();
    for (const ev of events) {
      const prev = map.get(ev.date) || { count: 0, hasExam: false };
      map.set(ev.date, {
        count: prev.count + 1,
        hasExam: prev.hasExam || ev.category === TaskCategory.EXAM,
      });
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [events]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddEvent({
      title: title.trim(),
      subjectId,
      grade,
      category,
      date,
      time,
      durationMinutes: Number(durationMinutes) || 30,
      rewardMinutesBonus: Number(rewardMinutesBonus) || 10,
      notes: notes.trim() || 'Repasar apuntes y preguntas trampa antes de empezar.',
    });
    setTitle('');
    setNotes('');
  };

  const pendingCount = events.filter((e) => !e.completed).length;
  const completedCount = events.filter((e) => e.completed).length;

  return (
    <div className="space-y-8">
      {/* Encabezado y Exportación a Google Calendar */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <span>Agenda Escolar Interactiva</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{pendingCount} entregas pendientes</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{completedCount} completadas</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Calendario de Deberes, Proyectos y Exámenes Diarios
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Marca cada tarea o examen como completado para sumar sus minutos de bonificación
            multiplicados por{' '}
            <strong className="font-mono tabular-nums">{multiplierFactorX}x</strong> al Estudio de
            Maquillaje, o exporta todo tu cronograma a Google Calendar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => downloadIcsFile(filteredEvents)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Agenda (.ics Google Calendar)</span>
          </button>
        </div>
      </section>

      {/* Selector Visual de Fechas Clave del Calendario */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-rose-600" />
            <span>Fechas Clave en el Calendario Escolar</span>
          </h2>
          {selectedDateFilter && (
            <button
              type="button"
              onClick={() => setSelectedDateFilter('')}
              className="text-xs font-medium text-rose-700 hover:text-rose-900 transition-colors whitespace-nowrap shrink-0"
            >
              Mostrar todas las fechas
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {upcomingDates.map(([dateKey, info]) => {
            const isSelected = selectedDateFilter === dateKey;
            return (
              <button
                key={dateKey}
                type="button"
                onClick={() =>
                  setSelectedDateFilter((prev) => (prev === dateKey ? '' : dateKey))
                }
                className={`p-3 rounded-xl border text-left transition-colors ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : info.hasExam
                    ? 'border-rose-300 bg-rose-50/50 text-stone-900 hover:border-rose-400'
                    : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300'
                }`}
              >
                <p className="font-mono text-xs font-semibold tabular-nums">{dateKey}</p>
                <p
                  className={`text-xs mt-1 ${
                    isSelected ? 'text-stone-300' : 'text-stone-600'
                  }`}
                >
                  {info.count} {info.count === 1 ? 'evento' : 'eventos'}
                  {info.hasExam ? ' · Examen' : ''}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grilla Principal: Lista de Eventos + Formulario de Nueva Entrega */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lista filtrable de Deberes y Exámenes */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-lg">
              {(
                ['ALL', TaskCategory.HOMEWORK, TaskCategory.EXAM, TaskCategory.PROJECT] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    filterCategory === cat
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat === 'ALL' ? 'Todos' : cat}
                </button>
              ))}
            </div>

            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value as 'ALL' | CourseGrade)}
              aria-label="Filtrar por curso"
              className="px-3 py-1.5 text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
            >
              <option value="ALL">4º a 6º (Todos)</option>
              <option value={CourseGrade.FOURTH}>{CourseGrade.FOURTH}</option>
              <option value={CourseGrade.FIFTH}>{CourseGrade.FIFTH}</option>
              <option value={CourseGrade.SIXTH}>{CourseGrade.SIXTH}</option>
            </select>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-medium text-stone-700">
                No hay deberes ni exámenes en este filtro.
              </p>
              <p className="text-xs text-stone-500">
                Usa el formulario de la derecha para añadir una nueva fecha o limpia el filtro.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((ev) => {
                const googleUrl = buildGoogleCalendarUrl(ev);
                const totalPlayReward = Math.round(ev.rewardMinutesBonus * multiplierFactorX);
                return (
                  <div
                    key={ev.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      ev.completed
                        ? 'bg-stone-50/70 border-stone-200 opacity-75'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => onToggleComplete(ev.id)}
                          aria-label={
                            ev.completed ? 'Marcar como pendiente' : 'Marcar como completado'
                          }
                          className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors shrink-0"
                        >
                          {ev.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                            <span className="font-semibold text-stone-800">{ev.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{SUBJECT_NAMES[ev.subjectId]}</span>
                            <span aria-hidden="true">·</span>
                            <span>{ev.grade}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {ev.date} a las {ev.time}
                            </span>
                          </div>

                          <h3
                            className={`text-sm font-semibold ${
                              ev.completed
                                ? 'line-through text-stone-500'
                                : 'text-stone-900'
                            }`}
                          >
                            {ev.title}
                          </h3>

                          <p className="text-xs text-stone-600 leading-relaxed">{ev.notes}</p>

                          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
                            <span className="font-mono tabular-nums text-rose-700 font-medium">
                              Recompensa: +{ev.rewardMinutesBonus} min estudio (+{totalPlayReward}{' '}
                              min Glam AR)
                            </span>

                            <a
                              href={googleUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-950 underline underline-offset-2 whitespace-nowrap shrink-0"
                            >
                              <span>Añadir a Google Calendar</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              type="button"
                              onClick={() => onSendReminderNotification(ev)}
                              className="text-stone-600 hover:text-stone-950 underline underline-offset-2 whitespace-nowrap shrink-0"
                            >
                              Probar Aviso Push
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteEvent(ev.id)}
                        aria-label="Eliminar tarea"
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Formulario para Planificar Nuevo Examen o Deberes */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
          <div className="space-y-1 border-b border-stone-100 pb-4">
            <h2 className="font-display text-lg font-bold text-stone-900">
              Añadir Deberes o Fecha de Examen
            </h2>
            <p className="text-xs text-stone-500">
              Organiza tu semana en el CEIP Palancia y define la bonificación al terminar.
            </p>
          </div>

          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Título de la tarea o examen
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Examen Tema 2 Fracciones / Redacción en Valencià"
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Asignatura
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value as SubjectId)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl bg-white"
                >
                  {Object.entries(SUBJECT_NAMES).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl bg-white"
                >
                  <option value={TaskCategory.HOMEWORK}>Deberes diarios</option>
                  <option value={TaskCategory.EXAM}>Examen / Control</option>
                  <option value={TaskCategory.PROJECT}>Proyecto / Trabajo</option>
                  <option value={TaskCategory.STUDY_SESSION}>Sesión de repaso</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Curso
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as CourseGrade)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl bg-white"
                >
                  <option value={CourseGrade.FOURTH}>{CourseGrade.FOURTH}</option>
                  <option value={CourseGrade.FIFTH}>{CourseGrade.FIFTH}</option>
                  <option value={CourseGrade.SIXTH}>{CourseGrade.SIXTH}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Duración estimada (min): <span className="font-mono">{durationMinutes}</span>
                </label>
                <input
                  type="range"
                  min={15}
                  max={90}
                  step={5}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full accent-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bonus estudio (min): <span className="font-mono">+{rewardMinutesBonus}</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={rewardMinutesBonus}
                  onChange={(e) => setRewardMinutesBonus(Number(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Notas o temas que entran
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Páginas 42-45 del libro, repasar preguntas trampa..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar en el Calendario</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
