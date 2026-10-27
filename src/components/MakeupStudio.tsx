/**
 * @fileoverview Estudio de Maquillaje y Belleza en Realidad Aumentada ("Palancia Glam Studio").
 * - Controlado por el tiempo de recompensa (Tiempo de Estudio × Factor X).
 * - Soporta 3 modos sin abrir páginas externas:
 *   1) Modelo HD Interactiva
 *   2) Cámara Selfie en Tiempo Real (WebRTC getUserMedia + filtro AR superpuesto + captura de foto)
 *   3) Subir Foto Propia desde el dispositivo con calibrador facial AR
 * - Incluye tutoriales interactivos paso a paso, galería de looks guardados y enlaces directos para compartir en redes sociales.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  Clock,
  Copy,
  Heart,
  Lock,
  RotateCcw,
  Share2,
  Sparkles,
  Upload,
  UserCheck,
} from 'lucide-react';
import {
  AR_BEAUTY_TUTORIALS,
  DEFAULT_MAKEUP_CONFIG,
} from '../data/curriculumData';
import {
  BeautyTutorial,
  MakeupConfig,
  SavedMakeupLook,
} from '../types';
import { formatDurationClock } from '../utils/rewardEngine';
import {
  buildShareableLookUrl,
  getSocialShareLinks,
} from '../utils/shareLook';

interface MakeupStudioProps {
  availablePlaySeconds: number;
  isLocked: boolean;
  lockReason: 'NONE' | 'NO_TIME_REMAINING' | 'PARENT_OVERRIDE' | 'DAILY_LIMIT_REACHED';
  multiplierFactorX: number;
  config: MakeupConfig;
  onChangeConfig: (newConfig: MakeupConfig) => void;
  savedLooks: SavedMakeupLook[];
  onSaveLook: (look: Omit<SavedMakeupLook, 'id' | 'createdAt'>) => void;
  onDeleteLook: (id: string) => void;
  onGoToStudy: () => void;
  onGoToParentPortal: () => void;
}

type StudioCanvasMode = 'model' | 'camera' | 'photo';

const LIP_PALETTE = [
  { name: 'Rosa Coral', hex: '#F43F5E' },
  { name: 'Cereza Glam', hex: '#E11D48' },
  { name: 'Fucsia València', hex: '#DB2777' },
  { name: 'Malva Dulce', hex: '#A855F7' },
  { name: 'Melocotón Brillo', hex: '#FB7185' },
  { name: 'Cacao Nude', hex: '#B45309' },
];

const EYESHADOW_PALETTE = [
  { name: 'Lavanda Mágica', hex: '#C084FC' },
  { name: 'Oro Sol Palancia', hex: '#FDBA74' },
  { name: 'Rosa Cuarzo', hex: '#F472B6' },
  { name: 'Turquesa Mar', hex: '#38BDF8' },
  { name: 'Esmeralda Calderona', hex: '#34D399' },
  { name: 'Bronce Suave', hex: '#D97706' },
];

const BLUSH_PALETTE = [
  { name: 'Pétalo Rosa', hex: '#FB7185' },
  { name: 'Melocotón Sol', hex: '#FB923C' },
  { name: 'Frambuesa Suave', hex: '#E11D48' },
  { name: 'Malva Rosado', hex: '#E879F9' },
];

const SKIN_TONES = [
  { name: 'Porcelana Cálida', hex: '#FDEBD0' },
  { name: 'Mediterráneo Claro', hex: '#F5CBA7' },
  { name: 'Dorado Sol', hex: '#E59866' },
  { name: 'Canela Suave', hex: '#CA6F1E' },
];

export const MakeupStudio: React.FC<MakeupStudioProps> = ({
  availablePlaySeconds,
  isLocked,
  lockReason,
  multiplierFactorX,
  config,
  onChangeConfig,
  savedLooks,
  onSaveLook,
  onDeleteLook,
  onGoToStudy,
  onGoToParentPortal,
}) => {
  const [canvasMode, setCanvasMode] = useState<StudioCanvasMode>('model');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Tutorial AR guiado activo
  const [selectedTutorial, setSelectedTutorial] = useState<BeautyTutorial>(
    AR_BEAUTY_TUTORIALS[0]
  );
  const [completedTutorialSteps, setCompletedTutorialSteps] = useState<Record<string, boolean>>({});
  const [activeArZoneHighlight, setActiveArZoneHighlight] = useState<string | null>(null);

  // Guardar Look y Compartir en Redes Sociales
  const [lookNameInput, setLookNameInput] = useState('');
  const [lookNoteInput, setLookNoteInput] = useState('');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Apagar cámara si se bloquea el tiempo o se cambia de modo
  useEffect(() => {
    if (isLocked || canvasMode !== 'camera') {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
    }
  }, [isLocked, canvasMode]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startLiveArCamera = async () => {
    setCameraError(null);
    setCanvasMode('camera');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          'Tu navegador no permite abrir la cámara directamente aquí. Puedes usar "Subir Mi Foto" o la Modelo HD.'
        );
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 800 } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError(
        'No se pudo acceder a la cámara web. Revisa el permiso del navegador o sube una foto tuya para maquillarla.'
      );
    }
  };

  const captureSelfieFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Espejo horizontal natural para selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCustomPhotoUrl(dataUrl);
    setCanvasMode('photo');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomPhotoUrl(reader.result);
        setCanvasMode('photo');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyTutorialStep = (
    tutorialId: string,
    stepNumber: number,
    zone: string,
    recommendedSetting: Partial<MakeupConfig>
  ) => {
    onChangeConfig({
      ...config,
      ...recommendedSetting,
    });
    setCompletedTutorialSteps((prev) => ({
      ...prev,
      [`${tutorialId}-${stepNumber}`]: true,
    }));
    setActiveArZoneHighlight(zone);
    window.setTimeout(() => {
      setActiveArZoneHighlight(null);
    }, 1800);
  };

  const handleSaveCurrentLook = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = lookNameInput.trim() || `Look Glam ${savedLooks.length + 1}`;
    onSaveLook({
      name: cleanName,
      authorNote:
        lookNoteInput.trim() || 'Creado en el Estudio AR después de mi sesión de estudio.',
      config,
      customPhotoDataUrl: customPhotoUrl || undefined,
    });
    setLookNameInput('');
    setLookNoteInput('');
  };

  const shareUrl = buildShareableLookUrl(
    lookNameInput.trim() || 'Mi Look Palancia Glam',
    config
  );
  const socialLinks = getSocialShareLinks(
    lookNameInput.trim() || 'Mi Look Palancia Glam',
    shareUrl
  );

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShareLink(true);
      window.setTimeout(() => setCopiedShareLink(false), 2500);
    } catch {
      setCopiedShareLink(true);
    }
  };

  // Pantalla de bloqueo automático cuando el tiempo llega a 00:00 o por bloqueo parental
  if (isLocked) {
    return (
      <section className="max-w-3xl mx-auto my-8 bg-white border border-stone-200 rounded-2xl p-8 sm:p-12 text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-rose-700">
            Bloqueo Automático del Estudio de Maquillaje y Belleza
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            {lockReason === 'PARENT_OVERRIDE'
              ? 'Tu madre ha pausado temporalmente el Estudio Glam'
              : lockReason === 'DAILY_LIMIT_REACHED'
              ? 'Has alcanzado el tiempo máximo diario de juego configurado por mamá'
              : '¡Tu tiempo de juego ha llegado a 00:00!'}
          </h1>
          <p className="text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Recuerda cómo funciona tu recompensa en el CEIP Palancia: cada minuto que estudies o
            cada tarea que completes se multiplica por{' '}
            <strong className="font-mono tabular-nums text-stone-900">
              {multiplierFactorX}x
            </strong>{' '}
            en minutos de maquillaje y belleza AR.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onGoToStudy}
            className="px-5 py-3 text-xs sm:text-sm font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors whitespace-nowrap shrink-0"
          >
            Ir al Temario y Ganar Tiempo de Juego
          </button>
          <button
            type="button"
            onClick={onGoToParentPortal}
            className="px-5 py-3 text-xs sm:text-sm font-semibold rounded-xl border border-stone-300 text-stone-800 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
          >
            Acceso Madre (Ajustar Tiempo / Factor X)
          </button>
        </div>
      </section>
    );
  }

  const { faceCalibration } = config;
  const isLowTimeWarning = availablePlaySeconds <= 120;

  return (
    <div className="space-y-8">
      {/* Barra Superior del Estudio con Contador en Tiempo Real y Alerta Pre-Bloqueo */}
      <section
        className={`rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4 transition-colors ${
          isLowTimeWarning
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Palancia Glam AR Studio</span>
            <span aria-hidden="true">·</span>
            <span>Realidad Aumentada en Tiempo Real</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">
            Estudio Interactivo de Maquillaje, Fotos y Tutoriales AR
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-stone-900 text-white flex items-center gap-3">
            <Clock className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <p className="text-[11px] text-stone-400 leading-none">
                Tiempo restante antes del bloqueo
              </p>
              <p className="font-mono text-lg font-bold tabular-nums tracking-tight mt-0.5">
                {formatDurationClock(availablePlaySeconds)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChangeConfig(DEFAULT_MAKEUP_CONFIG)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-stone-950 border border-stone-200 rounded-xl bg-stone-50 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Maquillaje</span>
          </button>
        </div>
      </section>

      {/* Zona Principal en 2 Columnas: Espejo AR Interactivo (Izquierda) + Controles de Maquillaje y Tutoriales (Derecha) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Espejo AR en Tiempo Real */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
          {/* Selector de Modo de Rostro: Modelo HD, Cámara Selfie en Vivo, o Subir Mi Foto */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => setCanvasMode('model')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  canvasMode === 'model'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Modelo Estudio</span>
              </button>

              <button
                type="button"
                onClick={startLiveArCamera}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  canvasMode === 'camera'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Hacerme Foto / AR Vivo</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  canvasMode === 'photo'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Usar Foto Mía</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {canvasMode === 'camera' && isCameraActive && (
              <button
                type="button"
                onClick={captureSelfieFromCamera}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors whitespace-nowrap shrink-0"
              >
                Capturar Selfie
              </button>
            )}
          </div>

          {cameraError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              {cameraError}
            </div>
          )}

          {/* Marco del Espejo de Belleza con Superposición Vectorial AR */}
          <div className="relative mx-auto w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-stone-200 bg-gradient-to-b from-rose-50/70 via-stone-50 to-amber-50/40 shadow-inner">
            {/* Capa 1: Vídeo de Cámara en Vivo o Foto Subida por la Usuaria */}
            {canvasMode === 'camera' && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />
            )}

            {canvasMode === 'photo' && customPhotoUrl && (
              <img
                src={customPhotoUrl}
                alt="Foto personal para maquillaje AR"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Capa 2: Lienzo Facial SVG con Maquillaje en Realidad Aumentada */}
            <svg
              viewBox="0 0 300 400"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                transform: `scale(${faceCalibration.scale / 100})`,
                transformOrigin: 'center center',
              }}
            >
              <defs>
                <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={config.blushColor} stopOpacity={config.blushOpacity} />
                  <stop offset="100%" stopColor={config.blushColor} stopOpacity="0" />
                </radialGradient>
                <radialGradient id="eyeGrad" cx="50%" cy="50%" r="55%">
                  <stop
                    offset="0%"
                    stopColor={config.eyeshadowColor}
                    stopOpacity={config.eyeshadowOpacity}
                  />
                  <stop offset="100%" stopColor={config.eyeshadowColor} stopOpacity="0" />
                </radialGradient>
                <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Si estamos en modo "Modelo Estudio" (o aún no hay foto subida), dibujamos el rostro base HD */}
              {(canvasMode === 'model' || (canvasMode === 'photo' && !customPhotoUrl)) && (
                <g>
                  {/* Cabello castaño mediterráneo */}
                  <path
                    d="M45 180 C35 70, 95 25, 150 25 C205 25, 265 70, 255 180 C265 270, 250 350, 225 385 L75 385 C50 350, 35 270, 45 180 Z"
                    fill="#3E2723"
                  />
                  {/* Cuello y hombros */}
                  <rect x="118" y="295" width="64" height="75" rx="20" fill={config.skinTone} />
                  <path
                    d="M55 395 C65 340, 110 335, 150 335 C190 335, 235 340, 245 395 Z"
                    fill="#E11D48"
                  />
                  {/* Óvalo facial simétrico */}
                  <path
                    d="M78 155 C78 92, 110 64, 150 64 C190 64, 222 92, 222 155 C222 232, 185 304, 150 308 C115 304, 78 232, 78 155 Z"
                    fill={config.skinTone}
                  />
                  {/* Flequillo suave natural */}
                  <path
                    d="M76 145 C90 85, 135 72, 150 72 C165 72, 210 85, 224 145 C205 100, 175 88, 150 88 C125 88, 95 100, 76 145 Z"
                    fill="#4E342E"
                  />
                  {/* Nariz delicada */}
                  <path
                    d="M150 175 L146 218 Q150 224 154 218 Z"
                    fill="rgba(0,0,0,0.08)"
                  />
                  {/* Esclerótica e iris de los ojos en modo Modelo */}
                  <ellipse
                    cx={faceCalibration.eyeLeftX * 3}
                    cy={faceCalibration.eyesY * 4}
                    rx="18"
                    ry="10"
                    fill="#FFFFFF"
                  />
                  <ellipse
                    cx={faceCalibration.eyeRightX * 3}
                    cy={faceCalibration.eyesY * 4}
                    rx="18"
                    ry="10"
                    fill="#FFFFFF"
                  />
                </g>
              )}

              {/* CAPA AR 1: Sombra de Ojos (Eyeshadow) */}
              <ellipse
                cx={faceCalibration.eyeLeftX * 3}
                cy={faceCalibration.eyesY * 4 - 9}
                rx="26"
                ry="16"
                fill="url(#eyeGrad)"
              />
              <ellipse
                cx={faceCalibration.eyeRightX * 3}
                cy={faceCalibration.eyesY * 4 - 9}
                rx="26"
                ry="16"
                fill="url(#eyeGrad)"
              />

              {/* CAPA AR 2: Color de Iris / Lentillas Cosméticas */}
              <circle
                cx={faceCalibration.eyeLeftX * 3}
                cy={faceCalibration.eyesY * 4}
                r="7.5"
                fill={config.irisColor}
                fillOpacity={canvasMode === 'model' ? 0.95 : 0.55}
              />
              <circle
                cx={faceCalibration.eyeRightX * 3}
                cy={faceCalibration.eyesY * 4}
                r="7.5"
                fill={config.irisColor}
                fillOpacity={canvasMode === 'model' ? 0.95 : 0.55}
              />
              {canvasMode === 'model' && (
                <>
                  <circle
                    cx={faceCalibration.eyeLeftX * 3}
                    cy={faceCalibration.eyesY * 4}
                    r="3.5"
                    fill="#1C1917"
                  />
                  <circle
                    cx={faceCalibration.eyeRightX * 3}
                    cy={faceCalibration.eyesY * 4}
                    r="3.5"
                    fill="#1C1917"
                  />
                  {/* Brillo pupilar */}
                  <circle
                    cx={faceCalibration.eyeLeftX * 3 - 2.5}
                    cy={faceCalibration.eyesY * 4 - 2.5}
                    r="1.8"
                    fill="#FFFFFF"
                  />
                  <circle
                    cx={faceCalibration.eyeRightX * 3 - 2.5}
                    cy={faceCalibration.eyesY * 4 - 2.5}
                    r="1.8"
                    fill="#FFFFFF"
                  />
                </>
              )}

              {/* CAPA AR 3: Delineado de Ojos (Eyeliner) */}
              {config.eyelinerStyle !== 'none' && (
                <g stroke="#1C1917" fill="none" strokeLinecap="round">
                  {/* Ojo izquierdo */}
                  <path
                    d={`M ${faceCalibration.eyeLeftX * 3 - 19} ${faceCalibration.eyesY * 4} Q ${
                      faceCalibration.eyeLeftX * 3
                    } ${faceCalibration.eyesY * 4 - 13} ${faceCalibration.eyeLeftX * 3 + 18} ${
                      faceCalibration.eyesY * 4
                    }`}
                    strokeWidth={config.eyelinerStyle === 'natural' ? '2.2' : '3.5'}
                  />
                  {/* Ojo derecho */}
                  <path
                    d={`M ${faceCalibration.eyeRightX * 3 - 18} ${faceCalibration.eyesY * 4} Q ${
                      faceCalibration.eyeRightX * 3
                    } ${faceCalibration.eyesY * 4 - 13} ${faceCalibration.eyeRightX * 3 + 19} ${
                      faceCalibration.eyesY * 4
                    }`}
                    strokeWidth={config.eyelinerStyle === 'natural' ? '2.2' : '3.5'}
                  />
                  {/* Rabillo Alado (Winged) o Gráfico */}
                  {(config.eyelinerStyle === 'winged' || config.eyelinerStyle === 'graphic') && (
                    <>
                      <path
                        d={`M ${faceCalibration.eyeLeftX * 3 - 18} ${faceCalibration.eyesY * 4} L ${
                          faceCalibration.eyeLeftX * 3 - 27
                        } ${faceCalibration.eyesY * 4 - 8}`}
                        strokeWidth="3"
                      />
                      <path
                        d={`M ${faceCalibration.eyeRightX * 3 + 18} ${
                          faceCalibration.eyesY * 4
                        } L ${faceCalibration.eyeRightX * 3 + 27} ${faceCalibration.eyesY * 4 - 8}`}
                        strokeWidth="3"
                      />
                    </>
                  )}
                  {config.eyelinerStyle === 'graphic' && (
                    <>
                      <path
                        d={`M ${faceCalibration.eyeLeftX * 3 - 25} ${
                          faceCalibration.eyesY * 4 - 9
                        } Q ${faceCalibration.eyeLeftX * 3} ${faceCalibration.eyesY * 4 - 22} ${
                          faceCalibration.eyeLeftX * 3 + 14
                        } ${faceCalibration.eyesY * 4 - 12}`}
                        strokeWidth="1.8"
                      />
                      <path
                        d={`M ${faceCalibration.eyeRightX * 3 + 25} ${
                          faceCalibration.eyesY * 4 - 9
                        } Q ${faceCalibration.eyeRightX * 3} ${faceCalibration.eyesY * 4 - 22} ${
                          faceCalibration.eyeRightX * 3 - 14
                        } ${faceCalibration.eyesY * 4 - 12}`}
                        strokeWidth="1.8"
                      />
                    </>
                  )}
                </g>
              )}

              {/* CAPA AR 4: Cejas Definidas */}
              <path
                d={`M ${faceCalibration.eyeLeftX * 3 - 20} ${faceCalibration.eyesY * 4 - 22} Q ${
                  faceCalibration.eyeLeftX * 3
                } ${faceCalibration.eyesY * 4 - 30} ${faceCalibration.eyeLeftX * 3 + 18} ${
                  faceCalibration.eyesY * 4 - 21
                }`}
                stroke="#3E2723"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                strokeOpacity={config.browIntensity}
              />
              <path
                d={`M ${faceCalibration.eyeRightX * 3 - 18} ${faceCalibration.eyesY * 4 - 21} Q ${
                  faceCalibration.eyeRightX * 3
                } ${faceCalibration.eyesY * 4 - 30} ${faceCalibration.eyeRightX * 3 + 20} ${
                  faceCalibration.eyesY * 4 - 22
                }`}
                stroke="#3E2723"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                strokeOpacity={config.browIntensity}
              />

              {/* CAPA AR 5: Colorete (Blush) e Iluminador Solar */}
              <ellipse
                cx={faceCalibration.eyeLeftX * 3 - 12}
                cy={faceCalibration.cheeksY * 4}
                rx="26"
                ry="18"
                fill="url(#blushGrad)"
              />
              <ellipse
                cx={faceCalibration.eyeRightX * 3 + 12}
                cy={faceCalibration.cheeksY * 4}
                rx="26"
                ry="18"
                fill="url(#blushGrad)"
              />

              {config.highlighter && (
                <>
                  <ellipse
                    cx={faceCalibration.eyeLeftX * 3 - 16}
                    cy={faceCalibration.cheeksY * 4 - 12}
                    rx="14"
                    ry="5"
                    transform={`rotate(-18 ${faceCalibration.eyeLeftX * 3 - 16} ${
                      faceCalibration.cheeksY * 4 - 12
                    })`}
                    fill="url(#highlightGrad)"
                  />
                  <ellipse
                    cx={faceCalibration.eyeRightX * 3 + 16}
                    cy={faceCalibration.cheeksY * 4 - 12}
                    rx="14"
                    ry="5"
                    transform={`rotate(18 ${faceCalibration.eyeRightX * 3 + 16} ${
                      faceCalibration.cheeksY * 4 - 12
                    })`}
                    fill="url(#highlightGrad)"
                  />
                </>
              )}

              {/* CAPA AR 6: Labios y Efecto Gloss */}
              <g transform={`translate(150, ${faceCalibration.lipsY * 4})`}>
                {/* Labio superior e inferior */}
                <path
                  d="M -26 0 Q -13 -11 0 -4 Q 13 -11 26 0 Q 14 15 0 15 Q -14 15 -26 0 Z"
                  fill={config.lipColor}
                  fillOpacity={config.lipOpacity}
                />
                {/* Línea comisura suave */}
                <path
                  d="M -24 0 Q 0 3 24 0"
                  stroke="rgba(0,0,0,0.22)"
                  strokeWidth="1.2"
                  fill="none"
                />
                {/* Brillo Gloss 3D */}
                {config.lipGloss && (
                  <ellipse
                    cx="0"
                    cy="6"
                    rx="11"
                    ry="3"
                    fill="#FFFFFF"
                    fillOpacity="0.65"
                  />
                )}
              </g>

              {/* CAPA AR 7: Stickers y Gemas Faciales */}
              {config.faceSticker === 'stars' && (
                <g fill="#FBBF24" stroke="#FEF08A" strokeWidth="0.8">
                  <text x="72" y={faceCalibration.cheeksY * 4 - 6} fontSize="16">
                    ✦
                  </text>
                  <text x="60" y={faceCalibration.cheeksY * 4 + 10} fontSize="12">
                    ★
                  </text>
                  <text x="214" y={faceCalibration.cheeksY * 4 - 6} fontSize="16">
                    ✦
                  </text>
                  <text x="228" y={faceCalibration.cheeksY * 4 + 10} fontSize="12">
                    ★
                  </text>
                </g>
              )}

              {config.faceSticker === 'hearts' && (
                <g fill="#E11D48">
                  <text x="70" y={faceCalibration.cheeksY * 4} fontSize="15">
                    ♥
                  </text>
                  <text x="216" y={faceCalibration.cheeksY * 4} fontSize="15">
                    ♥
                  </text>
                </g>
              )}

              {config.faceSticker === 'butterflies' && (
                <g fill="#A855F7">
                  <text x="65" y={faceCalibration.cheeksY * 4 - 4} fontSize="16">
                    🦋
                  </text>
                  <text x="212" y={faceCalibration.cheeksY * 4 - 4} fontSize="16">
                    🦋
                  </text>
                </g>
              )}

              {config.faceSticker === 'pearls' && (
                <g fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1">
                  <circle cx="76" cy={faceCalibration.eyesY * 4 - 16} r="3" />
                  <circle cx="68" cy={faceCalibration.eyesY * 4 - 6} r="2.5" />
                  <circle cx="224" cy={faceCalibration.eyesY * 4 - 16} r="3" />
                  <circle cx="232" cy={faceCalibration.eyesY * 4 - 6} r="2.5" />
                </g>
              )}

              {/* Guía luminosa temporal cuando aplica un paso del Tutorial AR */}
              {activeArZoneHighlight && (
                <rect
                  x="20"
                  y="20"
                  width="260"
                  height="360"
                  rx="24"
                  fill="none"
                  stroke="#E11D48"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
              )}
            </svg>
          </div>

          {/* Calibrador de Puntos Faciales AR (Especialmente útil cuando sube su propia foto o usa cámara) */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-stone-800">
                Ajuste Fino de Puntos Faciales AR (Ojos, Pómulos y Labios)
              </p>
              <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                Escala: {faceCalibration.scale}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">
                  Altura Ojos ({faceCalibration.eyesY}%)
                </label>
                <input
                  type="range"
                  min={32}
                  max={55}
                  value={faceCalibration.eyesY}
                  onChange={(e) =>
                    onChangeConfig({
                      ...config,
                      faceCalibration: {
                        ...faceCalibration,
                        eyesY: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-rose-600"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">
                  Altura Pómulos ({faceCalibration.cheeksY}%)
                </label>
                <input
                  type="range"
                  min={45}
                  max={65}
                  value={faceCalibration.cheeksY}
                  onChange={(e) =>
                    onChangeConfig({
                      ...config,
                      faceCalibration: {
                        ...faceCalibration,
                        cheeksY: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-rose-600"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">
                  Altura Labios ({faceCalibration.lipsY}%)
                </label>
                <input
                  type="range"
                  min={58}
                  max={78}
                  value={faceCalibration.lipsY}
                  onChange={(e) =>
                    onChangeConfig({
                      ...config,
                      faceCalibration: {
                        ...faceCalibration,
                        lipsY: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-rose-600"
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">
                  Tamaño Filtro ({faceCalibration.scale}%)
                </label>
                <input
                  type="range"
                  min={80}
                  max={120}
                  value={faceCalibration.scale}
                  onChange={(e) =>
                    onChangeConfig({
                      ...config,
                      faceCalibration: {
                        ...faceCalibration,
                        scale: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-rose-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Paleta de Maquillaje y Tutoriales AR Personalizados (Derecha) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Panel de Paletas Cosméticas */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-6">
            <h2 className="font-display text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Paleta de Color y Texturas AR
            </h2>

            {/* Labios */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">1. Barra de Labios y Gloss</span>
                <span className="font-mono tabular-nums text-stone-500">
                  Intensidad: {Math.round(config.lipOpacity * 100)}%
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {LIP_PALETTE.map((item) => (
                  <button
                    key={item.hex}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, lipColor: item.hex })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
                      config.lipColor === item.hex
                        ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-1">
                <input
                  type="range"
                  min={0.2}
                  max={0.95}
                  step={0.05}
                  value={config.lipOpacity}
                  onChange={(e) =>
                    onChangeConfig({ ...config, lipOpacity: Number(e.target.value) })
                  }
                  aria-label="Intensidad de labios"
                  className="flex-1 accent-rose-600"
                />
                <button
                  type="button"
                  onClick={() => onChangeConfig({ ...config, lipGloss: !config.lipGloss })}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    config.lipGloss
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-stone-50 border-stone-200 text-stone-600'
                  }`}
                >
                  Efecto Gloss: {config.lipGloss ? 'Sí' : 'No'}
                </button>
              </div>
            </div>

            {/* Sombras de Ojos y Delineado */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">
                  2. Sombra de Ojos y Estilo Eyeliner
                </span>
                <span className="font-mono tabular-nums text-stone-500">
                  Opacidad: {Math.round(config.eyeshadowOpacity * 100)}%
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {EYESHADOW_PALETTE.map((item) => (
                  <button
                    key={item.hex}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, eyeshadowColor: item.hex })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
                      config.eyeshadowColor === item.hex
                        ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {(
                  [
                    { id: 'none', label: 'Sin delineado' },
                    { id: 'natural', label: 'Delineado Natural' },
                    { id: 'winged', label: 'Eyeliner Alado' },
                    { id: 'graphic', label: 'Pasarela Gráfico' },
                  ] as const
                ).map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, eyelinerStyle: style.id })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                      config.eyelinerStyle === style.id
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colorete, Iluminador, Stickers y Tono de Piel */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">
                  3. Colorete, Iluminador y Gemas AR
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {BLUSH_PALETTE.map((item) => (
                  <button
                    key={item.hex}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, blushColor: item.hex })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
                      config.blushColor === item.hex
                        ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {(
                  [
                    { id: 'none', label: 'Sin Stickers' },
                    { id: 'stars', label: '✦ Estrellas Doradas' },
                    { id: 'hearts', label: '♥ Corazones Glam' },
                    { id: 'butterflies', label: '🦋 Mariposas AR' },
                    { id: 'pearls', label: '○ Perlas Nacaradas' },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, faceSticker: st.id })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                      config.faceSticker === st.id
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {canvasMode === 'model' && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-stone-500">Tono de piel modelo:</span>
                  {SKIN_TONES.map((tone) => (
                    <button
                      key={tone.hex}
                      type="button"
                      onClick={() => onChangeConfig({ ...config, skinTone: tone.hex })}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                        config.skinTone === tone.hex
                          ? 'border-stone-900 font-semibold text-stone-900'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      {tone.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tutoriales de Belleza Personalizados en Realidad Aumentada (Sin salir de la App) */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-rose-700">
                Tutoriales Interactivos AR Integrados
              </p>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Aprende Paso a Paso en Tiempo Real
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {AR_BEAUTY_TUTORIALS.map((tut) => (
                <button
                  key={tut.id}
                  type="button"
                  onClick={() => setSelectedTutorial(tut)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    selectedTutorial.id === tut.id
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {tut.title}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Dificultad: {selectedTutorial.difficulty}</span>
                <span className="font-mono tabular-nums">
                  Duración: {selectedTutorial.durationMinutes} min
                </span>
              </div>
              <p className="text-xs text-stone-700">{selectedTutorial.subtitle}</p>

              <div className="space-y-2.5 pt-1">
                {selectedTutorial.steps.map((st) => {
                  const stepKey = `${selectedTutorial.id}-${st.stepNumber}`;
                  const isDone = Boolean(completedTutorialSteps[stepKey]);
                  return (
                    <div
                      key={st.stepNumber}
                      className="p-3 rounded-xl bg-white border border-stone-200 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-stone-900">
                          Paso {st.stepNumber}: {st.instruction}
                        </p>
                        <p className="text-[11px] text-stone-500">{st.arTip}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyTutorialStep(
                            selectedTutorial.id,
                            st.stepNumber,
                            st.zone,
                            st.recommendedSetting
                          )
                        }
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white hover:bg-rose-700'
                        }`}
                      >
                        {isDone ? 'Aplicado ✓' : 'Probar en AR'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galería Personal de Looks Favoritos y Compartir en Redes Sociales */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Guardar y Compartir Combinación */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-stone-900">
              Guardar Look y Compartir Combinación
            </h2>
            <p className="text-xs text-stone-500">
              Guarda tu diseño en tu galería personal o comparte el enlace directo con tu familia.
            </p>
          </div>

          <form onSubmit={handleSaveCurrentLook} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nombre de tu Look
              </label>
              <input
                type="text"
                value={lookNameInput}
                onChange={(e) => setLookNameInput(e.target.value)}
                placeholder="Ej. Brillo Fiesta Algimia / Estrellas Malva"
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nota personal
              </label>
              <input
                type="text"
                value={lookNoteInput}
                onChange={(e) => setLookNoteInput(e.target.value)}
                placeholder="Ej. Mi combinación favorita tras aprobar Matemáticas"
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-xl transition-colors"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Guardar en Mi Galería Personal</span>
            </button>
          </form>

          {/* Enlaces directos integrados para compartir en redes sociales */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <p className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Compartir combinación mediante enlaces directos</span>
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0"
              >
                WhatsApp
              </a>
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0"
              >
                Telegram
              </a>
              <a
                href={socialLinks.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap shrink-0"
              >
                Pinterest
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-800 text-white hover:bg-stone-950 transition-colors whitespace-nowrap shrink-0"
              >
                X / Social
              </a>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 text-stone-800 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
              >
                {copiedShareLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Enlace Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Enlace Directo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Galería Personal de Looks Guardados */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="font-display text-lg font-bold text-stone-900">
              Mi Galería Personal de Looks Favoritos ({savedLooks.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedLooks.map((look) => (
              <div
                key={look.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-stone-900">{look.name}</h3>
                    <span className="font-mono text-[11px] text-stone-500 tabular-nums">
                      {look.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{look.authorNote}</p>

                  {/* Muestra de colores del look */}
                  <div className="flex items-center gap-2 pt-1 text-xs text-stone-500">
                    <span
                      className="w-4 h-4 rounded-full border border-stone-300"
                      style={{ backgroundColor: look.config.lipColor }}
                      title="Color de labios"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-stone-300"
                      style={{ backgroundColor: look.config.eyeshadowColor }}
                      title="Sombra de ojos"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-stone-300"
                      style={{ backgroundColor: look.config.blushColor }}
                      title="Colorete"
                    />
                    <span>· Delineado: {look.config.eyelinerStyle}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      onChangeConfig(look.config);
                      if (look.customPhotoDataUrl) {
                        setCustomPhotoUrl(look.customPhotoDataUrl);
                        setCanvasMode('photo');
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors whitespace-nowrap shrink-0"
                  >
                    Probar Este Look
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteLook(look.id)}
                    className="text-xs text-stone-500 hover:text-red-600 transition-colors whitespace-nowrap shrink-0"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
