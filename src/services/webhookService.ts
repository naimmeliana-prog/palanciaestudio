/**
 * @fileoverview Servicio de sincronización en tiempo real mediante Webhooks para actualizar temarios,
 * fechas de exámenes o avisos de CEIP Palancia sin recargar la página.
 */

import {
  CalendarEventItem,
  CourseGrade,
  SubjectId,
  TaskCategory,
  TopicUnit,
  WebhookPayloadEvent,
} from '../types';

export interface IncomingCurriculumWebhook {
  source: WebhookPayloadEvent['source'];
  action: WebhookPayloadEvent['action'];
  courseGrade: CourseGrade;
  subjectId: SubjectId;
  summary: string;
  newEvent?: Omit<CalendarEventItem, 'id' | 'completed'>;
  newUnitTip?: {
    unitId?: string;
    tip: string;
    trapQuestion?: {
      question: string;
      commonMistake: string;
      correctApproach: string;
      exampleSolution: string;
    };
  };
}

/**
 * Envía un evento de webhook al endpoint del servidor (si está activo) o lo procesa localmente
 * para garantizar funcionamiento tanto en servidor Express como en despliegues estáticos en Vercel.
 */
export async function dispatchCurriculumWebhook(
  payload: IncomingCurriculumWebhook
): Promise<WebhookPayloadEvent> {
  const eventRecord: WebhookPayloadEvent = {
    id: `wh-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    source: payload.source,
    action: payload.action,
    summary: payload.summary,
    courseGrade: payload.courseGrade,
    subjectId: payload.subjectId,
  };

  try {
    const response = await fetch('/api/webhooks/curriculum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.event) {
        return data.event as WebhookPayloadEvent;
      }
    }
  } catch {
    // En entorno estático (Vercel SPA) o sin backend intermedio, resolvemos directamente en cliente
  }

  return eventRecord;
}

/**
 * Plantillas de sincronización rápida de Aules GVA / ITACA Web Família para probar o recibir cambios del colegio.
 */
export const PRESET_SCHOOL_WEBHOOKS: {
  label: string;
  payload: IncomingCurriculumWebhook;
}[] = [
  {
    label: 'Aules GVA: Nuevo truco de examen en Matemáticas 4º (Fracciones equivalentes)',
    payload: {
      source: 'Aules GVA Sync',
      action: 'UPDATE_SYLLABUS',
      courseGrade: CourseGrade.FOURTH,
      subjectId: SubjectId.MATEMATICAS,
      summary: 'Actualizado temario de Matemáticas 4º: Añadida pregunta trampa sobre fracciones equivalentes con producto en cruz.',
      newUnitTip: {
        tip: 'Actualización Aules GVA: Para comprobar si dos fracciones son equivalentes rápido en el examen, multiplica en cruz (numerador 1 × denominador 2 = denominador 1 × numerador 2).',
        trapQuestion: {
          question: '¿Son equivalentes las fracciones 2/3 y 4/6 aunque tengan números distintos?',
          commonMistake: 'Decir que no son iguales porque el 4 y el 6 son números mayores.',
          correctApproach: 'Multiplicar en cruz: 2 × 6 = 12 y 3 × 4 = 12. Como dan lo mismo, representan exactamente la misma cantidad de tarta.',
          exampleSolution: '2/3 = 4/6 porque 2 × 6 = 12 y 3 × 4 = 12.',
        },
      },
    },
  },
  {
    label: 'ITACA Web Família: Nuevo control de Valencià 4º (Pronoms i apostrofació)',
    payload: {
      source: 'ITACA Web Família',
      action: 'NEW_EXAM_DATE',
      courseGrade: CourseGrade.FOURTH,
      subjectId: SubjectId.VALENCIA,
      summary: 'Sincronizada nueva fecha de control de Valencià desde ITACA Web Família (+20 min de recompensa).',
      newEvent: {
        title: 'Control Oficial ITACA: Dictat i Apostrofació del Palància',
        subjectId: SubjectId.VALENCIA,
        grade: CourseGrade.FOURTH,
        category: TaskCategory.EXAM,
        date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
        time: '10:00',
        durationMinutes: 45,
        rewardMinutesBonus: 20,
        notes: 'Sincronizado automáticamente vía Webhook desde ITACA Web Família CEIP Palancia.',
      },
    },
  },
  {
    label: 'CEIP Palancia: Actualización de Sintaxis y Morfología para 6º Primaria',
    payload: {
      source: 'CEIP Palancia Webhook',
      action: 'UPDATE_SYLLABUS',
      courseGrade: CourseGrade.SIXTH,
      subjectId: SubjectId.CASTELLANO,
      summary: 'Nuevo apunte en Lengua 6º: Diferencia entre voz activa y voz pasiva para el examen trimestral.',
      newUnitTip: {
        tip: 'Sincronización Docente CEIP Palancia: En la voz pasiva el verbo lleva siempre "SER + Participio" (fue construido) y el complemento empieza por "por" (Complemento Agente).',
      },
    },
  },
];

/**
 * Aplica en inmutable una actualización de temario recibida por webhook a la unidad correspondiente.
 */
export function applyWebhookToUnit(
  unit: TopicUnit,
  update: NonNullable<IncomingCurriculumWebhook['newUnitTip']>
): TopicUnit {
  const updatedTips = [update.tip, ...unit.studyTips];
  const updatedTraps = update.trapQuestion
    ? [
        {
          id: `trap-wh-${Date.now()}`,
          ...update.trapQuestion,
        },
        ...unit.trapQuestions,
      ]
    : unit.trapQuestions;

  return {
    ...unit,
    studyTips: updatedTips,
    trapQuestions: updatedTraps,
  };
}
