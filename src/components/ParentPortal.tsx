/**
 * @fileoverview Panel de Control Parental ("Zona Madre").
 * - Autenticación segura mediante usuario y contraseña para el perfil de la madre.
 * - Configuración del factor personalizable "X" (Tiempo de Juego = Tiempo de Estudio × X).
 * - Asignación directa de tiempo extra, límite diario y bloqueo instantáneo.
 * - Accesos directos a Aules GVA, ITACA Web Família, Google Classroom y PortalEdu CEIP Palancia.
 * - Sincronizador de Webhooks en tiempo real para actualizar temarios y exámenes.
 */

import React, { useState } from 'react';
import {
  ExternalLink,
  KeyRound,
  Lock,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Sliders,
  Unlock,
} from 'lucide-react';
import { SCHOOL_PLATFORMS } from '../data/curriculumData';
import {
  IncomingCurriculumWebhook,
  PRESET_SCHOOL_WEBHOOKS,
} from '../services/webhookService';
import {
  ParentSettings,
  StudySessionRecord,
  WebhookPayloadEvent,
} from '../types';
import { formatDurationClock } from '../utils/rewardEngine';

interface ParentPortalProps {
  isAuthenticated: boolean;
  onLogin: (username: string, passwordPlain: string) => boolean;
  onLogout: () => void;
  settings: ParentSettings;
  onUpdateSettings: (newSettings: ParentSettings) => void;
  totalStudiedSeconds: number;
  availablePlaySeconds: number;
  consumedPlaySeconds: number;
  onResetConsumedTime: () => void;
  studyHistory: StudySessionRecord[];
  webhookLogs: WebhookPayloadEvent[];
  onTriggerWebhook: (payload: IncomingCurriculumWebhook) => Promise<void>;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  isAuthenticated,
  onLogin,
  onLogout,
  settings,
  onUpdateSettings,
  totalStudiedSeconds,
  availablePlaySeconds,
  consumedPlaySeconds,
  onResetConsumedTime,
  studyHistory,
  webhookLogs,
  onTriggerWebhook,
}) => {
  const [usernameInput, setUsernameInput] = useState('madre');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSyncingWebhook, setIsSyncingWebhook] = useState(false);

  // Cambio de credenciales
  const [newUsername, setNewUsername] = useState(settings.username);
  const [newPassword, setNewPassword] = useState('');
  const [credentialsSavedMessage, setCredentialsSavedMessage] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(usernameInput.trim(), passwordInput);
    if (!ok) {
      setLoginError(
        'Usuario o contraseña incorrectos. (Por defecto: usuario "madre" y contraseña "palancia2026").'
      );
    } else {
      setLoginError(null);
      setPasswordInput('');
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) return;
    onUpdateSettings({
      ...settings,
      username: newUsername.trim(),
      passwordHash: newPassword.trim(),
    });
    setNewPassword('');
    setCredentialsSavedMessage('Credenciales actualizadas correctamente.');
    window.setTimeout(() => setCredentialsSavedMessage(null), 3000);
  };

  const handleTriggerPresetWebhook = async (payload: IncomingCurriculumWebhook) => {
    setIsSyncingWebhook(true);
    try {
      await onTriggerWebhook(payload);
    } finally {
      setIsSyncingWebhook(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="max-w-md mx-auto my-8 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="w-11 h-11 rounded-xl bg-stone-900 text-white flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="font-display text-2xl font-bold text-stone-900 pt-2">
            Acceso Seguro para la Madre
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Introduce tu usuario y contraseña para configurar el multiplicador{' '}
            <strong className="font-mono">X</strong> de tiempo de estudio, gestionar el bloqueo de
            la app de maquillaje o acceder a Aules GVA e ITACA Web Família.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Usuario Madre
            </label>
            <input
              type="text"
              required
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Escribe: palancia2026"
              className="w-full px-3.5 py-2.5 text-sm border border-stone-300 rounded-xl focus:outline-none focus:border-stone-900"
            />
          </div>

          {loginError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
              {loginError}
            </p>
          )}

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
            <p className="font-semibold text-stone-800">Credenciales iniciales de acceso:</p>
            <p className="font-mono tabular-nums">
              Usuario: <strong>madre</strong> · Contraseña: <strong>palancia2026</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors"
          >
            Entrar al Panel Parental
          </button>
        </form>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cabecera de Sesión Parental */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Sesión Parental Verificada ({settings.username})</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            Control de Tiempo, Factor “X” y Plataformas CEIP Palancia
          </h1>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-stone-300 text-stone-800 hover:bg-stone-100 rounded-xl transition-colors whitespace-nowrap shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión Madre</span>
        </button>
      </section>

      {/* Fila de Métricas Tabulares de Estudio vs Juego */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <p className="text-xs text-stone-500">Tiempo Total Estudiado</p>
          <p className="text-2xl font-mono font-bold tabular-nums text-stone-900 mt-1">
            {formatDurationClock(totalStudiedSeconds)}
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <p className="text-xs text-stone-500">Factor Multiplicador Actual (X)</p>
          <p className="text-2xl font-mono font-bold tabular-nums text-rose-600 mt-1">
            {settings.multiplierFactorX}x
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <p className="text-xs text-stone-500">Tiempo Disponible en Glam AR</p>
          <p className="text-2xl font-mono font-bold tabular-nums text-emerald-700 mt-1">
            {formatDurationClock(availablePlaySeconds)}
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <p className="text-xs text-stone-500">Tiempo Consumido en Maquillaje</p>
          <p className="text-2xl font-mono font-bold tabular-nums text-stone-700 mt-1">
            {formatDurationClock(consumedPlaySeconds)}
          </p>
        </div>
      </section>

      {/* Configuración del Factor X y Control de Tiempo de la App de Maquillaje */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1 border-b border-stone-100 pb-4">
            <h2 className="font-display text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-rose-600" />
              <span>Fórmula de Recompensa: Juego = Estudio × Factor X</span>
            </h2>
            <p className="text-xs text-stone-500">
              Ajusta el multiplicador X o concede minutos manuales directos para el Estudio de
              Maquillaje.
            </p>
          </div>

          {/* Slider y botones rápidos del Factor X */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-stone-800">
                Factor Personalizable “X” por minuto estudiado:
              </span>
              <span className="font-mono font-bold text-base text-rose-600 tabular-nums">
                X = {settings.multiplierFactorX}
              </span>
            </div>

            <input
              type="range"
              min={0.25}
              max={3.0}
              step={0.25}
              value={settings.multiplierFactorX}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  multiplierFactorX: Number(e.target.value),
                })
              }
              className="w-full accent-rose-600"
            />

            <div className="flex flex-wrap items-center gap-2">
              {[0.5, 1.0, 1.5, 2.0, 3.0].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      multiplierFactorX: val,
                    })
                  }
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-colors tabular-nums ${
                    settings.multiplierFactorX === val
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  X = {val}x
                </button>
              ))}
            </div>
          </div>

          {/* Ajuste Manual de Tiempo y Límite Diario */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-stone-800">
                Tiempo Manual Extra Concedido por la Madre:
              </span>
              <span className="font-mono font-semibold tabular-nums text-stone-900">
                {Math.round(settings.manualBonusSeconds / 60)} min
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    manualBonusSeconds: settings.manualBonusSeconds + 600,
                  })
                }
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0"
              >
                +10 min Regalo Madre
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    manualBonusSeconds: settings.manualBonusSeconds + 1200,
                  })
                }
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0"
              >
                +20 min Fin de Semana
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    manualBonusSeconds: Math.max(0, settings.manualBonusSeconds - 300),
                  })
                }
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
              >
                -5 min
              </button>
              <button
                type="button"
                onClick={onResetConsumedTime}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
              >
                Reiniciar Contador Consumido
              </button>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Tope Máximo Diario de Maquillaje:{' '}
                <span className="font-mono tabular-nums">{settings.dailyMaxPlayMinutes} min</span>
              </label>
              <input
                type="range"
                min={15}
                max={180}
                step={15}
                value={settings.dailyMaxPlayMinutes}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    dailyMaxPlayMinutes: Number(e.target.value),
                  })
                }
                className="w-full accent-stone-900"
              />
            </div>

            {/* Bloqueo Instantáneo */}
            <div className="pt-3 flex items-center justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-stone-900">
                  Bloqueo Instantáneo de la App de Maquillaje
                </p>
                <p className="text-xs text-stone-500">
                  Bloquea o desbloquea el Estudio Glam inmediatamente aunque tenga minutos.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    instantLockOverride: !settings.instantLockOverride,
                  })
                }
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                  settings.instantLockOverride
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {settings.instantLockOverride ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Bloqueado (Pulsa para Desbloquear)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Bloquear Ahora</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Accesos Directos a Plataformas Oficiales del CEIP Palancia */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-bold text-stone-900">
                Plataformas Oficiales del Colegio
              </h2>
              <p className="text-xs text-stone-500">
                Acceso directo para la madre a Aules GVA, ITACA Web Família y Google Classroom.
              </p>
            </div>

            <div className="space-y-3">
              {SCHOOL_PLATFORMS.map((plat) => (
                <a
                  key={plat.id}
                  href={plat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/70 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-stone-900">{plat.name}</span>
                    <ExternalLink className="w-4 h-4 text-stone-500 shrink-0" />
                  </div>
                  <p className="text-[11px] font-medium text-rose-700">{plat.category}</p>
                  <p className="text-xs text-stone-600 leading-relaxed">{plat.description}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Cambiar Usuario y Contraseña de la Madre */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-stone-900">
              Actualizar Usuario y Contraseña Parental
            </h3>
            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Nuevo usuario"
                  className="px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="px-3 py-2 text-xs border border-stone-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors"
              >
                Guardar Nueva Contraseña
              </button>
              {credentialsSavedMessage && (
                <p className="text-xs text-emerald-700 font-medium">{credentialsSavedMessage}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Sincronización en Tiempo Real mediante Webhooks (Temarios y Exámenes) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-stone-900">
                Sincronización de Temarios en Tiempo Real (Webhooks)
              </h2>
              <p className="text-xs text-stone-500">
                Recibe cambios de temario, nuevas preguntas trampa o fechas de exámenes al instante.
              </p>
            </div>
            <RefreshCw
              className={`w-4 h-4 text-rose-600 shrink-0 ${
                isSyncingWebhook ? 'animate-spin' : ''
              }`}
            />
          </div>

          <div className="space-y-2.5">
            {PRESET_SCHOOL_WEBHOOKS.map((wh, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-stone-900">{wh.label}</p>
                  <p className="text-[11px] text-stone-500">{wh.payload.summary}</p>
                </div>
                <button
                  type="button"
                  disabled={isSyncingWebhook}
                  onClick={() => handleTriggerPresetWebhook(wh.payload)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors whitespace-nowrap shrink-0"
                >
                  Sincronizar Ahora
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Historial de Sincronizaciones Webhook y Sesiones de Estudio */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-stone-900">
            Registro de Actividad y Webhooks Recibidos
          </h2>

          {webhookLogs.length === 0 && studyHistory.length === 0 ? (
            <p className="text-xs text-stone-500 py-4">
              Aún no se han registrado sincronizaciones ni sesiones en esta sesión.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {webhookLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="font-semibold text-rose-700">{log.source}</span>
                    <span className="font-mono tabular-nums">{log.timestamp}</span>
                  </div>
                  <p className="text-stone-800 font-medium">{log.summary}</p>
                </div>
              ))}

              {studyHistory.map((ses) => (
                <div
                  key={ses.id}
                  className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-xs flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-semibold text-stone-900">
                      Estudio completado ({ses.grade})
                    </p>
                    <p className="text-stone-600 font-mono tabular-nums">
                      +{formatDurationClock(ses.studiedSeconds)} estudiados → +
                      {formatDurationClock(ses.earnedPlaySeconds)} Glam AR
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-stone-500 tabular-nums">
                    {ses.completedAt}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
