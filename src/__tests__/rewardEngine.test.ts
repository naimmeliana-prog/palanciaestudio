/**
 * @fileoverview Pruebas unitarias con Vitest para garantizar la estabilidad del motor de recompensas
 * (Tiempo de Juego = Tiempo de Estudio × Factor X), exportación a Google Calendar y enlaces de looks.
 */

import { describe, expect, it } from 'vitest';
import { DEFAULT_MAKEUP_CONFIG } from '../data/curriculumData';
import { CourseGrade, SubjectId, TaskCategory } from '../types';
import {
  buildGoogleCalendarUrl,
  generateIcsCalendarContent,
} from '../utils/calendarExport';
import {
  calculateEarnedPlaySeconds,
  computeRewardBalance,
  formatDurationClock,
} from '../utils/rewardEngine';
import {
  buildShareableLookUrl,
  parseSharedLookFromQuery,
} from '../utils/shareLook';

describe('Motor de Recompensas de Estudio y Control Parental (rewardEngine)', () => {
  it('calcula correctamente Tiempo de Juego = Tiempo de Estudio × Factor X', () => {
    expect(calculateEarnedPlaySeconds(600, 1.5)).toBe(900); // 10 min estudio * 1.5 = 15 min juego
    expect(calculateEarnedPlaySeconds(1200, 0.5)).toBe(600); // 20 min estudio * 0.5 = 10 min juego
    expect(calculateEarnedPlaySeconds(0, 2.0)).toBe(0);
    expect(calculateEarnedPlaySeconds(-50, 1.5)).toBe(0);
  });

  it('bloquea automáticamente la app de maquillaje cuando el tiempo llega a 0', () => {
    const result = computeRewardBalance({
      totalStudiedSeconds: 300, // 5 min
      multiplierFactorX: 1.0, // = 300s ganados
      manualBonusSeconds: 0,
      completedTasksBonusSeconds: 0,
      consumedPlaySeconds: 300, // 300s gastados
      dailyMaxPlayMinutes: 60,
      instantLockOverride: false,
    });

    expect(result.availablePlaySeconds).toBe(0);
    expect(result.isLocked).toBe(true);
    expect(result.lockReason).toBe('NO_TIME_REMAINING');
  });

  it('respeta el bloqueo instantáneo activado por la madre', () => {
    const result = computeRewardBalance({
      totalStudiedSeconds: 1800,
      multiplierFactorX: 2.0,
      manualBonusSeconds: 600,
      completedTasksBonusSeconds: 0,
      consumedPlaySeconds: 0,
      dailyMaxPlayMinutes: 120,
      instantLockOverride: true,
    });

    expect(result.isLocked).toBe(true);
    expect(result.availablePlaySeconds).toBe(0);
    expect(result.lockReason).toBe('PARENT_OVERRIDE');
  });

  it('aplica el límite máximo diario configurado por la madre', () => {
    const result = computeRewardBalance({
      totalStudiedSeconds: 3600, // 60 min
      multiplierFactorX: 2.0, // 120 min ganados
      manualBonusSeconds: 0,
      completedTasksBonusSeconds: 0,
      consumedPlaySeconds: 1800, // 30 min consumidos
      dailyMaxPlayMinutes: 30, // Límite diario de 30 min
      instantLockOverride: false,
    });

    expect(result.isLocked).toBe(true);
    expect(result.lockReason).toBe('DAILY_LIMIT_REACHED');
  });

  it('formatea correctamente el reloj tabular MM:SS y HH:MM:SS', () => {
    expect(formatDurationClock(65)).toBe('01:05');
    expect(formatDurationClock(3661)).toBe('01:01:01');
  });
});

describe('Exportación de Cronograma a Google Calendar (.ics y URL)', () => {
  const sampleEvent = {
    id: 'test-ev-1',
    title: 'Examen Tema 1 Matemáticas',
    subjectId: SubjectId.MATEMATICAS,
    grade: CourseGrade.FOURTH,
    category: TaskCategory.EXAM,
    date: '2026-11-05',
    time: '09:30',
    durationMinutes: 45,
    completed: false,
    rewardMinutesBonus: 15,
    notes: 'Repasar divisiones de dos cifras.',
  };

  it('genera una URL válida de Google Calendar con los datos del examen', () => {
    const url = buildGoogleCalendarUrl(sampleEvent);
    expect(url).toContain('https://calendar.google.com/calendar/render?action=TEMPLATE');
    expect(url).toContain('Examen%20Tema%201%20Matem%C3%A1ticas');
  });

  it('genera contenido iCalendar (.ics) estándar RFC 5545', () => {
    const ics = generateIcsCalendarContent([sampleEvent]);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('SUMMARY:[Examen] Examen Tema 1 Matemáticas (4º Primaria)');
    expect(ics).toContain('END:VCALENDAR');
  });
});

describe('Codificación y Decodificación de Looks para Redes Sociales', () => {
  it('codifica y recupera una combinación de maquillaje desde el enlace directo', () => {
    const customConfig = {
      ...DEFAULT_MAKEUP_CONFIG,
      lipColor: '#DB2777',
      eyeshadowColor: '#38BDF8',
      eyelinerStyle: 'graphic' as const,
    };

    const url = buildShareableLookUrl('Look Fiesta Palancia', customConfig, 'https://example.com/');
    const queryPart = url.split('?')[1];
    const parsed = parseSharedLookFromQuery(`?${queryPart}`, DEFAULT_MAKEUP_CONFIG);

    expect(parsed).not.toBeNull();
    expect(parsed?.name).toBe('Look Fiesta Palancia');
    expect(parsed?.config.lipColor).toBe('#DB2777');
    expect(parsed?.config.eyeshadowColor).toBe('#38BDF8');
    expect(parsed?.config.eyelinerStyle).toBe('graphic');
  });
});
