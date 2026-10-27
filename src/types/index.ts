/**
 * @fileoverview Definiciones de tipos estrictos para Palancia Estudio & Glam (CEIP Palancia, 4º a 6º Primaria).
 */

export enum CourseGrade {
  FOURTH = '4º Primaria',
  FIFTH = '5º Primaria',
  SIXTH = '6º Primaria',
}

export enum SubjectId {
  MATEMATICAS = 'matematicas',
  CASTELLANO = 'castellano',
  VALENCIA = 'valencia',
  MEDI = 'medi',
  INGLES = 'ingles',
  ARTISTICA = 'artistica',
}

export enum TaskCategory {
  HOMEWORK = 'Deberes',
  EXAM = 'Examen',
  PROJECT = 'Proyecto',
  STUDY_SESSION = 'Estudio',
}

export interface TrapQuestion {
  id: string;
  question: string;
  commonMistake: string;
  correctApproach: string;
  exampleSolution: string;
}

export interface HardQuestionGuide {
  id: string;
  title: string;
  statement: string;
  stepByStep: string[];
  goldenRule: string;
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicUnit {
  id: string;
  unitNumber: number;
  title: string;
  summary: string;
  detailedNotes: string[];
  importantFormulas: { label: string; formula: string; meaning: string }[];
  memoryTricks: string[];
  studyTips: string[];
  trapQuestions: TrapQuestion[];
  hardQuestions: HardQuestionGuide[];
  quiz: QuizItem[];
  recommendedMinutes: number;
}

export interface SubjectCurriculum {
  id: SubjectId;
  name: string;
  valencianName: string;
  teacherNote: string;
  grade: CourseGrade;
  units: TopicUnit[];
}

export interface CalendarEventItem {
  id: string;
  title: string;
  subjectId: SubjectId;
  grade: CourseGrade;
  category: TaskCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  completed: boolean;
  rewardMinutesBonus: number;
  notes: string;
}

export interface MakeupConfig {
  lipColor: string;
  lipOpacity: number;
  lipGloss: boolean;
  eyeshadowColor: string;
  eyeshadowOpacity: number;
  eyelinerStyle: 'none' | 'natural' | 'winged' | 'graphic';
  blushColor: string;
  blushOpacity: number;
  highlighter: boolean;
  irisColor: string;
  browIntensity: number;
  faceSticker: 'none' | 'stars' | 'hearts' | 'butterflies' | 'pearls';
  skinTone: string;
  /** Calibración de puntos faciales en porcentaje (0-100) para fotos subidas o cámara AR */
  faceCalibration: {
    eyeLeftX: number;
    eyeRightX: number;
    eyesY: number;
    cheeksY: number;
    lipsY: number;
    scale: number;
  };
}

export interface SavedMakeupLook {
  id: string;
  name: string;
  createdAt: string;
  config: MakeupConfig;
  authorNote: string;
  customPhotoDataUrl?: string;
}

export interface BeautyTutorialStep {
  stepNumber: number;
  zone: 'eyes' | 'lips' | 'cheeks' | 'stickers' | 'prep';
  instruction: string;
  arTip: string;
  recommendedSetting: Partial<MakeupConfig>;
}

export interface BeautyTutorial {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  difficulty: 'Fácil' | 'Intermedio' | 'Creativo';
  steps: BeautyTutorialStep[];
}

export interface ParentSettings {
  username: string;
  passwordHash: string;
  multiplierFactorX: number;
  manualBonusSeconds: number;
  dailyMaxPlayMinutes: number;
  instantLockOverride: boolean;
  warningThresholdsSeconds: number[];
  autoSyncWebhooks: boolean;
}

export interface StudySessionRecord {
  id: string;
  subjectId: SubjectId;
  unitId: string;
  grade: CourseGrade;
  studiedSeconds: number;
  earnedPlaySeconds: number;
  quizScore?: number;
  completedAt: string;
}

export interface WebhookPayloadEvent {
  id: string;
  timestamp: string;
  source: 'Aules GVA Sync' | 'ITACA Web Família' | 'CEIP Palancia Webhook' | 'Docente Manual';
  action: 'UPDATE_SYLLABUS' | 'NEW_EXAM_DATE' | 'NEW_HOMEWORK' | 'MULTIPLIER_UPDATE';
  summary: string;
  courseGrade: CourseGrade;
  subjectId: SubjectId;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent' | 'reward';
  createdAt: string;
  read: boolean;
}
