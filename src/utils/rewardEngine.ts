/**
 * @fileoverview Motor matemático de recompensas de estudio y control de bloqueo parental.
 * Tiempo de Juego = (Tiempo de Estudio * Factor X) + Bonificaciones - Tiempo Consumido.
 */

export interface RewardComputationInput {
  totalStudiedSeconds: number;
  multiplierFactorX: number;
  manualBonusSeconds: number;
  completedTasksBonusSeconds: number;
  consumedPlaySeconds: number;
  dailyMaxPlayMinutes: number;
  instantLockOverride: boolean;
}

export interface RewardComputationResult {
  totalEarnedSeconds: number;
  availablePlaySeconds: number;
  isLocked: boolean;
  lockReason: 'NONE' | 'NO_TIME_REMAINING' | 'PARENT_OVERRIDE' | 'DAILY_LIMIT_REACHED';
  nextWarningThresholdSeconds: number | null;
}

/**
 * Calcula los segundos de juego ganados multiplicando el tiempo de estudio por el factor X personalizable.
 */
export function calculateEarnedPlaySeconds(
  studiedSeconds: number,
  multiplierFactorX: number
): number {
  if (studiedSeconds <= 0 || multiplierFactorX <= 0) {
    return 0;
  }
  const safeFactor = Math.min(Math.max(multiplierFactorX, 0.1), 10);
  return Math.round(studiedSeconds * safeFactor);
}

/**
 * Calcula el estado completo de disponibilidad de la App de Maquillaje y Belleza.
 */
export function computeRewardBalance(
  input: RewardComputationInput
): RewardComputationResult {
  if (input.instantLockOverride) {
    return {
      totalEarnedSeconds: 0,
      availablePlaySeconds: 0,
      isLocked: true,
      lockReason: 'PARENT_OVERRIDE',
      nextWarningThresholdSeconds: null,
    };
  }

  const baseEarned = calculateEarnedPlaySeconds(
    input.totalStudiedSeconds,
    input.multiplierFactorX
  );
  const rawTotalEarned = Math.max(
    0,
    baseEarned + input.manualBonusSeconds + input.completedTasksBonusSeconds
  );

  const maxDailySeconds = Math.max(0, input.dailyMaxPlayMinutes * 60);
  const cappedTotalEarned =
    maxDailySeconds > 0 ? Math.min(rawTotalEarned, maxDailySeconds) : rawTotalEarned;

  const consumed = Math.max(0, input.consumedPlaySeconds);

  if (maxDailySeconds > 0 && consumed >= maxDailySeconds) {
    return {
      totalEarnedSeconds: cappedTotalEarned,
      availablePlaySeconds: 0,
      isLocked: true,
      lockReason: 'DAILY_LIMIT_REACHED',
      nextWarningThresholdSeconds: null,
    };
  }

  const availablePlaySeconds = Math.max(0, cappedTotalEarned - consumed);
  const isLocked = availablePlaySeconds <= 0;

  let nextWarningThresholdSeconds: number | null = null;
  if (availablePlaySeconds > 300) {
    nextWarningThresholdSeconds = 300; // Aviso a los 5 minutos
  } else if (availablePlaySeconds > 120) {
    nextWarningThresholdSeconds = 120; // Aviso a los 2 minutos
  } else if (availablePlaySeconds > 60) {
    nextWarningThresholdSeconds = 60; // Aviso a 1 minuto
  } else if (availablePlaySeconds > 15) {
    nextWarningThresholdSeconds = 15; // Aviso a 15 segundos
  }

  return {
    totalEarnedSeconds: cappedTotalEarned,
    availablePlaySeconds,
    isLocked,
    lockReason: isLocked ? 'NO_TIME_REMAINING' : 'NONE',
    nextWarningThresholdSeconds,
  };
}

/**
 * Formatea segundos en formato reloj tabular MM:SS o HH:MM:SS.
 */
export function formatDurationClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (hours > 0) {
    const hh = String(hours).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}
