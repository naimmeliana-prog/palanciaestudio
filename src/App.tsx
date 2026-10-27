/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarPlanner } from './components/CalendarPlanner';
import { MakeupStudio } from './components/MakeupStudio';
import { ActiveTab, Navbar } from './components/Navbar';
import { NotificationCenter } from './components/NotificationCenter';
import { ParentPortal } from './components/ParentPortal';
import { StudyHub } from './components/StudyHub';
import {
  CURRICULUM_DATA,
  DEFAULT_MAKEUP_CONFIG,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_SAVED_LOOKS,
} from './data/curriculumData';
import {
  applyWebhookToUnit,
  dispatchCurriculumWebhook,
  IncomingCurriculumWebhook,
} from './services/webhookService';
import {
  AppNotification,
  CalendarEventItem,
  CourseGrade,
  MakeupConfig,
  ParentSettings,
  SavedMakeupLook,
  StudySessionRecord,
  SubjectCurriculum,
  SubjectId,
  WebhookPayloadEvent,
} from './types';
import {
  calculateEarnedPlaySeconds,
  computeRewardBalance,
  formatDurationClock,
} from './utils/rewardEngine';
import { parseSharedLookFromQuery } from './utils/shareLook';

const STORAGE_KEYS = {
  PARENT_SETTINGS: 'palancia_parent_settings_v1',
  STUDIED_SECONDS: 'palancia_studied_seconds_v1',
  CONSUMED_SECONDS: 'palancia_consumed_seconds_v1',
  CALENDAR_EVENTS: 'palancia_calendar_events_v1',
  SAVED_LOOKS: 'palancia_saved_looks_v1',
  STUDY_HISTORY: 'palancia_study_history_v1',
};

const DEFAULT_PARENT_SETTINGS: ParentSettings = {
  username: 'madre',
  passwordHash: 'palancia2026',
  multiplierFactorX: 1.5,
  manualBonusSeconds: 600, // 10 minutos iniciales de bienvenida para probar el Estudio Glam AR
  dailyMaxPlayMinutes: 90,
  instantLockOverride: false,
  warningThresholdsSeconds: [300, 120, 60, 15],
  autoSyncWebhooks: true,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('study');
  const [selectedGrade, setSelectedGrade] = useState<CourseGrade>(CourseGrade.FOURTH);

  // Temario reactivo sincronizable mediante Webhooks en tiempo real
  const [curriculum, setCurriculum] = useState<SubjectCurriculum[]>(CURRICULUM_DATA);

  // Configuración Parental persistente
  const [parentSettings, setParentSettings] = useState<ParentSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARENT_SETTINGS);
      return saved ? { ...DEFAULT_PARENT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_PARENT_SETTINGS;
    } catch {
      return DEFAULT_PARENT_SETTINGS;
    }
  });

  const [isParentAuthenticated, setIsParentAuthenticated] = useState(false);

  // Tiempo estudiado y consumido
  const [totalStudiedSeconds, setTotalStudiedSeconds] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(STORAGE_KEYS.STUDIED_SECONDS)) || 600; // 10 min estudiados iniciales
    } catch {
      return 600;
    }
  });

  const [consumedPlaySeconds, setConsumedPlaySeconds] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(STORAGE_KEYS.CONSUMED_SECONDS)) || 0;
    } catch {
      return 0;
    }
  });

  // Eventos del calendario interactivo
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR_EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
    } catch {
      return INITIAL_CALENDAR_EVENTS;
    }
  });

  // Configuración actual y galería de maquillaje
  const [makeupConfig, setMakeupConfig] = useState<MakeupConfig>(DEFAULT_MAKEUP_CONFIG);
  const [savedLooks, setSavedLooks] = useState<SavedMakeupLook[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_LOOKS);
      return saved ? JSON.parse(saved) : INITIAL_SAVED_LOOKS;
    } catch {
      return INITIAL_SAVED_LOOKS;
    }
  });

  const [studyHistory, setStudyHistory] = useState<StudySessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [webhookLogs, setWebhookLogs] = useState<WebhookPayloadEvent[]>([]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-welcome',
      title: 'Bienvenida a Palancia Estudio & Glam',
      message:
        'Tienes un examen de Castellano (Agudas, Llanas y Esdrújulas) esta semana. ¡Estudia con el cronómetro para multiplicar tu tiempo de maquillaje AR!',
      severity: 'info',
      createdAt: 'Hoy',
      read: false,
    },
  ]);

  const [browserPermission, setBrowserPermission] = useState<
    NotificationPermission | 'unsupported'
  >(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  });

  // Persistencia en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PARENT_SETTINGS, JSON.stringify(parentSettings));
    } catch {
      // Ignorar errores de almacenamiento privado
    }
  }, [parentSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDIED_SECONDS, String(totalStudiedSeconds));
    } catch {
      // Ignorar
    }
  }, [totalStudiedSeconds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONSUMED_SECONDS, String(consumedPlaySeconds));
    } catch {
      // Ignorar
    }
  }, [consumedPlaySeconds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(calendarEvents));
    } catch {
      // Ignorar
    }
  }, [calendarEvents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_LOOKS, JSON.stringify(savedLooks));
    } catch {
      // Ignorar
    }
  }, [savedLooks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_HISTORY, JSON.stringify(studyHistory));
    } catch {
      // Ignorar
    }
  }, [studyHistory]);

  // Si se abre un enlace compartido de redes sociales (?look=...), cargamos la combinación
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const shared = parseSharedLookFromQuery(window.location.search, DEFAULT_MAKEUP_CONFIG);
    if (shared) {
      setMakeupConfig(shared.config);
      setActiveTab('makeup');
      pushAppNotification(
        `Look compartido cargado: ${shared.name}`,
        'Se ha aplicado automáticamente la combinación de maquillaje del enlace directo.',
        'reward'
      );
    }
  }, []);

  // Bonificación acumulada por deberes y exámenes completados en el calendario (multiplicada por Factor X)
  const completedTasksBonusSeconds = useMemo(() => {
    const bonusMinutes = calendarEvents
      .filter((ev) => ev.completed)
      .reduce((acc, ev) => acc + (ev.rewardMinutesBonus || 0), 0);
    return calculateEarnedPlaySeconds(bonusMinutes * 60, parentSettings.multiplierFactorX);
  }, [calendarEvents, parentSettings.multiplierFactorX]);

  // Cálculo en tiempo real del saldo de juego y bloqueo
  const rewardBalance = useMemo(() => {
    return computeRewardBalance({
      totalStudiedSeconds,
      multiplierFactorX: parentSettings.multiplierFactorX,
      manualBonusSeconds: parentSettings.manualBonusSeconds,
      completedTasksBonusSeconds,
      consumedPlaySeconds,
      dailyMaxPlayMinutes: parentSettings.dailyMaxPlayMinutes,
      instantLockOverride: parentSettings.instantLockOverride,
    });
  }, [
    totalStudiedSeconds,
    parentSettings.multiplierFactorX,
    parentSettings.manualBonusSeconds,
    completedTasksBonusSeconds,
    consumedPlaySeconds,
    parentSettings.dailyMaxPlayMinutes,
    parentSettings.instantLockOverride,
  ]);

  const notifiedThresholdsRef = useRef<Set<number>>(new Set());

  const pushAppNotification = (
    title: string,
    message: string,
    severity: AppNotification['severity'] = 'info'
  ) => {
    const nowTime = new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        message,
        severity,
        createdAt: nowTime,
        read: false,
      },
      ...prev,
    ]);

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(title, { body: message, icon: '/favicon.svg' });
      } catch {
        // Ignorar en contextos donde Notification constructor requiera ServiceWorker
      }
    }
  };

  // Descuento segundo a segundo mientras la alumna usa activamente el Estudio de Maquillaje y Belleza
  useEffect(() => {
    if (activeTab !== 'makeup' || rewardBalance.isLocked) return;

    const timer = window.setInterval(() => {
      setConsumedPlaySeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeTab, rewardBalance.isLocked]);

  // Avisos automáticos de tiempo restante antes del bloqueo automático (5 min, 2 min, 1 min, 15 seg y 0 seg)
  useEffect(() => {
    if (activeTab !== 'makeup') return;
    const rem = rewardBalance.availablePlaySeconds;
    const thresholds = [300, 120, 60, 15];

    for (const t of thresholds) {
      if (rem === t && !notifiedThresholdsRef.current.has(t)) {
        notifiedThresholdsRef.current.add(t);
        const label = t >= 60 ? `${t / 60} min` : `${t} segundos`;
        pushAppNotification(
          `Aviso de bloqueo próximo (${label} restantes)`,
          `Quedan ${label} de uso en el Estudio de Maquillaje antes del bloqueo automático. Guarda tu look favorito.`,
          'warning'
        );
      }
    }

    if (rem === 0 && !notifiedThresholdsRef.current.has(0)) {
      notifiedThresholdsRef.current.add(0);
      pushAppNotification(
        'Tiempo agotado · Bloqueo Automático Activado',
        'El Estudio de Maquillaje se ha bloqueado automáticamente. Estudia un tema o completa tus deberes para ganar más tiempo.',
        'urgent'
      );
    }
  }, [activeTab, rewardBalance.availablePlaySeconds]);

  const handleRequestBrowserPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setBrowserPermission(perm);
    if (perm === 'granted') {
      pushAppNotification(
        'Notificaciones Push Activadas',
        'Te avisaremos de las fechas de exámenes del CEIP Palancia y del tiempo restante antes del bloqueo.',
        'info'
      );
    }
  };

  const handleRecordStudySession = (
    subjectId: SubjectId,
    unitId: string,
    grade: CourseGrade,
    studiedSeconds: number,
    quizScore?: number
  ) => {
    const earned = calculateEarnedPlaySeconds(
      studiedSeconds,
      parentSettings.multiplierFactorX
    );
    setTotalStudiedSeconds((prev) => prev + studiedSeconds);
    const record: StudySessionRecord = {
      id: `ses-${Date.now()}`,
      subjectId,
      unitId,
      grade,
      studiedSeconds,
      earnedPlaySeconds: earned,
      quizScore,
      completedAt: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setStudyHistory((prev) => [record, ...prev]);

    pushAppNotification(
      `¡Sesión de estudio registrada! (+${formatDurationClock(earned)} Glam AR)`,
      `Has estudiado ${formatDurationClock(studiedSeconds)} en ${grade}. Con el factor ${
        parentSettings.multiplierFactorX
      }x sumas ${formatDurationClock(earned)} de maquillaje AR.`,
      'reward'
    );
  };

  const handleToggleCalendarEvent = (eventId: string) => {
    setCalendarEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const nextCompleted = !ev.completed;
        if (nextCompleted) {
          const playBonus = Math.round(
            ev.rewardMinutesBonus * parentSettings.multiplierFactorX
          );
          pushAppNotification(
            `¡Tarea completada! +${playBonus} min para el Estudio Glam`,
            `Has completado "${ev.title}" (${ev.grade}).`,
            'reward'
          );
        }
        return { ...ev, completed: nextCompleted };
      })
    );
  };

  const handleAddCalendarEvent = (
    newEvent: Omit<CalendarEventItem, 'id' | 'completed'>
  ) => {
    const created: CalendarEventItem = {
      ...newEvent,
      id: `ev-${Date.now()}`,
      completed: false,
    };
    setCalendarEvents((prev) => [...prev, created]);
    pushAppNotification(
      `Nueva fecha en Agenda: ${created.title}`,
      `Programado para el ${created.date} a las ${created.time} (${created.grade}).`,
      'info'
    );
  };

  const handleDeleteCalendarEvent = (eventId: string) => {
    setCalendarEvents((prev) => prev.filter((ev) => ev.id !== eventId));
  };

  const handleParentLogin = (username: string, passwordPlain: string): boolean => {
    if (
      username.toLowerCase() === parentSettings.username.toLowerCase() &&
      passwordPlain === parentSettings.passwordHash
    ) {
      setIsParentAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleTriggerWebhook = async (payload: IncomingCurriculumWebhook) => {
    const eventLog = await dispatchCurriculumWebhook(payload);
    setWebhookLogs((prev) => [eventLog, ...prev]);

    if (payload.action === 'NEW_EXAM_DATE' && payload.newEvent) {
      handleAddCalendarEvent(payload.newEvent);
    }

    if (payload.action === 'UPDATE_SYLLABUS' && payload.newUnitTip) {
      const tipUpdate = payload.newUnitTip;
      setCurriculum((prev) =>
        prev.map((sub) => {
          if (
            sub.grade !== payload.courseGrade ||
            sub.id !== payload.subjectId
          ) {
            return sub;
          }
          return {
            ...sub,
            units: sub.units.map((u, idx) =>
              idx === 0 ? applyWebhookToUnit(u, tipUpdate) : u
            ),
          };
        })
      );
    }

    pushAppNotification(
      `Webhook Sincronizado · ${payload.source}`,
      payload.summary,
      'info'
    );
  };

  const availablePlayFormatted = formatDurationClock(
    rewardBalance.availablePlaySeconds
  );

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        availablePlayFormatted={availablePlayFormatted}
        isLocked={rewardBalance.isLocked}
      />

      {/* Navegación móvil compacta */}
      <div className="md:hidden flex items-center justify-around gap-1 px-3 py-2 bg-white border-b border-stone-200 text-xs font-medium">
        {(
          [
            { id: 'study', label: 'Temario' },
            { id: 'calendar', label: 'Agenda' },
            { id: 'makeup', label: 'Glam AR' },
            { id: 'parent', label: 'Madre' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-stone-900 text-white font-semibold'
                : 'text-stone-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <NotificationCenter
        notifications={notifications}
        onDismiss={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onClearAll={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        browserPermission={browserPermission}
        onRequestBrowserPermission={handleRequestBrowserPermission}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'study' && (
          <StudyHub
            curriculum={curriculum}
            selectedGrade={selectedGrade}
            onSelectGrade={setSelectedGrade}
            multiplierFactorX={parentSettings.multiplierFactorX}
            onRecordStudySession={handleRecordStudySession}
            onOpenMakeupStudio={() => setActiveTab('makeup')}
            availablePlayFormatted={availablePlayFormatted}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarPlanner
            events={calendarEvents}
            selectedGrade={selectedGrade}
            multiplierFactorX={parentSettings.multiplierFactorX}
            onToggleComplete={handleToggleCalendarEvent}
            onAddEvent={handleAddCalendarEvent}
            onDeleteEvent={handleDeleteCalendarEvent}
            onSendReminderNotification={(ev) =>
              pushAppNotification(
                `Recordatorio Escolar: ${ev.title}`,
                `Fecha: ${ev.date} a las ${ev.time} (${ev.grade}). Recompensa: +${ev.rewardMinutesBonus} min.`,
                ev.category === 'Examen' ? 'urgent' : 'warning'
              )
            }
          />
        )}

        {activeTab === 'makeup' && (
          <MakeupStudio
            availablePlaySeconds={rewardBalance.availablePlaySeconds}
            isLocked={rewardBalance.isLocked}
            lockReason={rewardBalance.lockReason}
            multiplierFactorX={parentSettings.multiplierFactorX}
            config={makeupConfig}
            onChangeConfig={setMakeupConfig}
            savedLooks={savedLooks}
            onSaveLook={(newLook) => {
              const created: SavedMakeupLook = {
                ...newLook,
                id: `look-${Date.now()}`,
                createdAt: new Date().toISOString().slice(0, 10),
              };
              setSavedLooks((prev) => [created, ...prev]);
              pushAppNotification(
                `Look guardado en tu galería: "${created.name}"`,
                'Puedes volver a aplicarlo o compartirlo con tu enlace directo cuando quieras.',
                'reward'
              );
            }}
            onDeleteLook={(id) =>
              setSavedLooks((prev) => prev.filter((item) => item.id !== id))
            }
            onGoToStudy={() => setActiveTab('study')}
            onGoToParentPortal={() => setActiveTab('parent')}
          />
        )}

        {activeTab === 'parent' && (
          <ParentPortal
            isAuthenticated={isParentAuthenticated}
            onLogin={handleParentLogin}
            onLogout={() => setIsParentAuthenticated(false)}
            settings={parentSettings}
            onUpdateSettings={setParentSettings}
            totalStudiedSeconds={totalStudiedSeconds}
            availablePlaySeconds={rewardBalance.availablePlaySeconds}
            consumedPlaySeconds={consumedPlaySeconds}
            onResetConsumedTime={() => {
              setConsumedPlaySeconds(0);
              notifiedThresholdsRef.current.clear();
            }}
            studyHistory={studyHistory}
            webhookLogs={webhookLogs}
            onTriggerWebhook={handleTriggerWebhook}
          />
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white py-6 px-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <p>
            Palancia Estudio &amp; Glam · Diseñado para Primaria (4º a 6º) · CEIP Palancia (Algimia
            de Alfara, València)
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://familia.edu.gva.es/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900 transition-colors"
            >
              ITACA Web Família
            </a>
            <a
              href="https://aules.edu.gva.es/primaria/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900 transition-colors"
            >
              Aules GVA
            </a>
            <a
              href="https://classroom.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900 transition-colors"
            >
              Google Classroom
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
