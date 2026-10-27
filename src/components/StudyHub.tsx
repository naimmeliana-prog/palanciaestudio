/**
 * @fileoverview Aula de Estudio Interactiva (4º a 6º de Primaria - CEIP Palancia, Algimia de Alfara).
 * Incluye cronómetro de estudio conectado al multiplicador "X", resúmenes, apuntes, fórmulas,
 * trucos mnemotécnicos, preguntas trampa de examen, preguntas difíciles paso a paso y test autoevaluable.
 */

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle2,
  Compass,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { CourseGrade, SubjectCurriculum, SubjectId, TopicUnit } from '../types';
import { calculateEarnedPlaySeconds, formatDurationClock } from '../utils/rewardEngine';

interface StudyHubProps {
  curriculum: SubjectCurriculum[];
  selectedGrade: CourseGrade;
  onSelectGrade: (grade: CourseGrade) => void;
  multiplierFactorX: number;
  onRecordStudySession: (
    subjectId: SubjectId,
    unitId: string,
    grade: CourseGrade,
    studiedSeconds: number,
    quizScore?: number
  ) => void;
  onOpenMakeupStudio: () => void;
  availablePlayFormatted: string;
}

export const StudyHub: React.FC<StudyHubProps> = ({
  curriculum,
  selectedGrade,
  onSelectGrade,
  multiplierFactorX,
  onRecordStudySession,
  onOpenMakeupStudio,
  availablePlayFormatted,
}) => {
  const courses = [CourseGrade.FOURTH, CourseGrade.FIFTH, CourseGrade.SIXTH];
  const subjectsForGrade = curriculum.filter((item) => item.grade === selectedGrade);

  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>(
    subjectsForGrade[0]?.id || SubjectId.MATEMATICAS
  );

  const activeSubject =
    subjectsForGrade.find((s) => s.id === selectedSubjectId) || subjectsForGrade[0];

  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    activeSubject?.units[0]?.id || ''
  );

  useEffect(() => {
    const firstSub = curriculum.find((item) => item.grade === selectedGrade);
    if (firstSub) {
      setSelectedSubjectId(firstSub.id);
      setSelectedUnitId(firstSub.units[0]?.id || '');
    }
  }, [selectedGrade, curriculum]);

  useEffect(() => {
    if (activeSubject && activeSubject.units.length > 0) {
      const exists = activeSubject.units.some((u) => u.id === selectedUnitId);
      if (!exists) {
        setSelectedUnitId(activeSubject.units[0].id);
      }
    }
  }, [activeSubject, selectedUnitId]);

  const activeUnit: TopicUnit | undefined =
    activeSubject?.units.find((u) => u.id === selectedUnitId) || activeSubject?.units[0];

  // Estado del cronómetro de estudio en directo
  const [isStudying, setIsStudying] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Estado de respuestas del mini-test de la unidad
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [revealedTrapIds, setRevealedTrapIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isStudying) return;
    const interval = window.setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isStudying]);

  const handleSaveStudyTime = () => {
    if (sessionSeconds <= 0 || !activeSubject || !activeUnit) return;
    setIsStudying(false);
    onRecordStudySession(activeSubject.id, activeUnit.id, selectedGrade, sessionSeconds);
    setSessionSeconds(0);
  };

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!activeUnit || !activeSubject) return;
    setQuizSubmitted(true);
    const totalQuestions = activeUnit.quiz.length;
    let correctCount = 0;
    for (const q of activeUnit.quiz) {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    }
    // Si acierta preguntas, otorgamos 3 minutos (180 s) de estudio extra por pregunta acertada
    if (correctCount > 0) {
      onRecordStudySession(
        activeSubject.id,
        activeUnit.id,
        selectedGrade,
        correctCount * 180,
        Math.round((correctCount / Math.max(1, totalQuestions)) * 100)
      );
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const toggleTrapSolution = (trapId: string) => {
    setRevealedTrapIds((prev) => ({ ...prev, [trapId]: !prev[trapId] }));
  };

  const previewEarnedSeconds = calculateEarnedPlaySeconds(sessionSeconds, multiplierFactorX);

  return (
    <div className="space-y-8">
      {/* Cabecera Editorial y Cronómetro de Recompensas */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span>CEIP Palancia · Algimia de Alfara</span>
              <span aria-hidden="true">·</span>
              <span>Plan de Estudio 4º a 6º de Primaria</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Factor Madre X = {multiplierFactorX}x</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Aprende cada tema sin caer en preguntas trampa y suma minutos para tu Estudio Glam
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
              Elige tu curso actual (4º, 5º o 6º de Primaria), activa el cronómetro mientras lees los
              resúmenes y trucos mnemotécnicos, y multiplica tu tiempo de estudio por{' '}
              <strong className="font-mono tabular-nums text-stone-900">{multiplierFactorX}</strong>{' '}
              para desbloquear el estudio de maquillaje en realidad aumentada.
            </p>
          </div>

          {/* Selector interactivo de Curso (4º, 5º, 6º Primaria) */}
          <div className="pt-6 mt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
              {courses.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => onSelectGrade(grade)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedGrade === grade
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>

            <div className="text-xs text-stone-500">
              <span>Saldo actual Glam AR: </span>
              <strong className="font-mono tabular-nums text-rose-700 font-semibold">
                {availablePlayFormatted}
              </strong>
            </div>
          </div>
        </div>

        {/* Cronómetro Activo de Estudio */}
        <div className="lg:col-span-5 bg-stone-900 text-stone-50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Cronómetro de Estudio en Vivo</span>
              <span className="font-mono tabular-nums">
                1 min estudio = {multiplierFactorX} min Glam AR
              </span>
            </div>
            <div className="pt-2 flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xs text-stone-400">Tiempo estudiado ahora</p>
                <p className="text-3xl sm:text-4xl font-mono font-bold tabular-nums tracking-tight text-white mt-1">
                  {formatDurationClock(sessionSeconds)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-rose-300">Recompensa generada (×{multiplierFactorX})</p>
                <p className="text-2xl sm:text-3xl font-mono font-semibold tabular-nums text-rose-400 mt-1">
                  +{formatDurationClock(previewEarnedSeconds)}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-stone-800 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsStudying((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isStudying
                  ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                  : 'bg-rose-600 text-white hover:bg-rose-500'
              }`}
            >
              {isStudying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar Estudio</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Iniciar Estudio</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={sessionSeconds === 0}
              onClick={handleSaveStudyTime}
              className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0"
            >
              Guardar y Canjear Minutos
            </button>

            <button
              type="button"
              onClick={() => {
                setIsStudying(false);
                onRecordStudySession(
                  activeSubject?.id || SubjectId.MATEMATICAS,
                  activeUnit?.id || 'demo',
                  selectedGrade,
                  300
                );
              }}
              title="Registrar bloque rápido de 5 minutos de repaso completado"
              className="px-3 py-2.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white border border-stone-700 hover:border-stone-500 transition-colors whitespace-nowrap shrink-0"
            >
              +5 min RepasoCompletado
            </button>
          </div>
        </div>
      </section>

      {/* Selector de Asignaturas del Curso Seleccionado */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-stone-900">
            Asignaturas de {selectedGrade}
          </h2>
          {activeSubject && (
            <p className="text-xs text-stone-500">
              <span>{activeSubject.valencianName}</span>
              <span aria-hidden="true"> · </span>
              <span>{activeSubject.teacherNote}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-200/70 rounded-xl">
          {subjectsForGrade.map((subject) => {
            const isSelected = subject.id === activeSubject?.id;
            return (
              <button
                key={`${subject.grade}-${subject.id}`}
                type="button"
                onClick={() => {
                  setSelectedSubjectId(subject.id);
                  setSelectedUnitId(subject.units[0]?.id || '');
                  handleResetQuiz();
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-white/60'
                }`}
              >
                {subject.name}
              </button>
            );
          })}
        </div>

        {/* Selector de Unidades dentro de la Asignatura */}
        {activeSubject && activeSubject.units.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {activeSubject.units.map((unit) => (
              <button
                key={unit.id}
                type="button"
                onClick={() => {
                  setSelectedUnitId(unit.id);
                  handleResetQuiz();
                }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  unit.id === activeUnit?.id
                    ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
                }`}
              >
                Unidad {unit.unitNumber}: {unit.title}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Contenido Completo de la Unidad Seleccionada */}
      {activeUnit && (
        <div className="space-y-8">
          {/* Bloque 1: Resumen, Apuntes Esenciales y Fórmulas Importantes */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <BookOpen className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Unidad {activeUnit.unitNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    Tiempo recomendado: {activeUnit.recommendedMinutes} min
                  </span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900">
                  {activeUnit.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">{activeUnit.summary}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-stone-900">
                  Apuntes Claros para el Examen
                </h4>
                <ul className="space-y-3">
                  {activeUnit.detailedNotes.map((note, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-stone-700 leading-relaxed flex items-start gap-3"
                    >
                      <span className="font-mono text-xs font-semibold text-rose-600 mt-0.5 tabular-nums shrink-0">
                        0{idx + 1}.
                      </span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-3">
                <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-stone-700" />
                  <span>Consejos de Estudio en Clase y Casa</span>
                </h4>
                <div className="space-y-2">
                  {activeUnit.studyTips.map((tip, idx) => (
                    <p key={idx} className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      • {tip}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Fórmulas Importantes y Trucos Mnemotécnicos */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm font-semibold text-stone-900">
                  Fórmulas y Reglas de Oro Imprescindibles
                </h4>
                <div className="space-y-3">
                  {activeUnit.importantFormulas.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5"
                    >
                      <p className="text-xs font-medium text-stone-500">{item.label}</p>
                      <p className="font-mono text-sm sm:text-base font-semibold text-stone-900 tabular-nums">
                        {item.formula}
                      </p>
                      <p className="text-xs text-stone-600 leading-relaxed">{item.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Trucos para Memorizar Fácilmente</span>
                </h4>
                <div className="space-y-3">
                  {activeUnit.memoryTricks.map((trick, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs sm:text-sm text-stone-800 leading-relaxed"
                    >
                      {trick}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Bloque 2: Preguntas Trampa en Exámenes y Preguntas Difíciles Recurrentes */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Preguntas Trampa */}
            <div className="lg:col-span-6 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Alerta de Examen · CEIP Palancia</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900">
                  Preguntas Trampa en Exámenes (¡No piques!)
                </h3>
              </div>

              <div className="space-y-4">
                {activeUnit.trapQuestions.map((trap) => {
                  const isRevealed = Boolean(revealedTrapIds[trap.id]);
                  return (
                    <div
                      key={trap.id}
                      className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3"
                    >
                      <p className="text-sm font-semibold text-stone-900 leading-snug">
                        {trap.question}
                      </p>
                      <p className="text-xs text-red-700 leading-relaxed">
                        <strong>Fallo habitual:</strong> {trap.commonMistake}
                      </p>

                      <button
                        type="button"
                        onClick={() => toggleTrapSolution(trap.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
                      >
                        {isRevealed ? 'Ocultar Solución' : 'Ver Cómo Resolver la Trampa'}
                      </button>

                      {isRevealed && (
                        <div className="pt-2 border-t border-stone-200 space-y-1.5 text-xs text-stone-700">
                          <p className="text-emerald-800 font-medium">
                            <strong>Cómo abordarla:</strong> {trap.correctApproach}
                          </p>
                          <p className="font-mono tabular-nums text-stone-600">
                            Resolución: {trap.exampleSolution}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preguntas Difíciles Recurrentes Paso a Paso */}
            <div className="lg:col-span-6 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-rose-700 font-medium">
                  <Brain className="w-4 h-4 shrink-0" />
                  <span>Método Paso a Paso</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900">
                  Preguntas Difíciles Recurrentes y Cómo Abordarlas
                </h3>
              </div>

              <div className="space-y-4">
                {activeUnit.hardQuestions.map((hard) => (
                  <div
                    key={hard.id}
                    className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3"
                  >
                    <h4 className="text-sm font-semibold text-stone-900">{hard.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed italic">
                      “{hard.statement}”
                    </p>
                    <ol className="space-y-1.5">
                      {hard.stepByStep.map((step, i) => (
                        <li key={i} className="text-xs text-stone-800 leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                    <p className="pt-2 border-t border-stone-200 text-xs font-semibold text-rose-800">
                      Regla clave: {hard.goldenRule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bloque 3: Mini-Test Interactivo con Recompensa Directa */}
          <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-stone-900">
                  Reto Rápido de Comprobación
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Cada respuesta acertada suma automáticamente 3 minutos de estudio (+{' '}
                  <span className="font-mono tabular-nums">
                    {Math.round(3 * multiplierFactorX)} min
                  </span>{' '}
                  de Estudio Glam AR).
                </p>
              </div>

              <div className="flex items-center gap-3">
                {quizSubmitted && (
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reintentar Reto</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenMakeupStudio}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ir a Estudio Glam AR</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeUnit.quiz.map((q, qIdx) => {
                const selectedOpt = quizAnswers[q.id];
                return (
                  <div key={q.id} className="space-y-3">
                    <p className="text-sm font-semibold text-stone-900">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isPicked = selectedOpt === optIdx;
                        const isRight = q.correctIndex === optIdx;

                        let btnClass =
                          'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-400';
                        if (quizSubmitted) {
                          if (isRight) {
                            btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                          } else if (isPicked && !isRight) {
                            btnClass = 'border-red-400 bg-red-50 text-red-900';
                          }
                        } else if (isPicked) {
                          btnClass = 'border-stone-900 bg-stone-900 text-white font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectQuizOption(q.id, optIdx)}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-colors flex items-center justify-between gap-2 ${btnClass}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isRight && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <p className="text-xs text-stone-600 bg-stone-100 p-3 rounded-lg leading-relaxed">
                        <strong>Explicación:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length === 0}
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0"
                >
                  Comprobar Respuestas y Sumar Recompensa
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
