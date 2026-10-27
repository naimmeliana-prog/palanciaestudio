/**
 * @fileoverview Centro de avisos y notificaciones push de tiempo restante antes del bloqueo y entregas escolares.
 */

import React from 'react';
import { Bell, CheckCircle2, Clock, Sparkles, TriangleAlert, X } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  browserPermission: NotificationPermission | 'unsupported';
  onRequestBrowserPermission: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onDismiss,
  onClearAll,
  browserPermission,
  onRequestBrowserPermission,
}) => {
  const unread = notifications.filter((n) => !n.read);

  if (unread.length === 0 && browserPermission === 'granted') {
    return null;
  }

  return (
    <section
      aria-label="Avisos y recordatorios escolares"
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-4"
    >
      <div className="border border-stone-200 bg-white rounded-xl p-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <Bell className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold text-stone-900">Avisos Inteligentes CEIP Palancia</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{unread.length} activos</span>
          </div>

          <div className="flex items-center gap-3">
            {browserPermission === 'default' && (
              <button
                type="button"
                onClick={onRequestBrowserPermission}
                className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Activar Notificaciones Push
              </button>
            )}
            {unread.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
              >
                Marcar leídos
              </button>
            )}
          </div>
        </div>

        {unread.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {unread.slice(0, 4).map((item) => {
              const Icon =
                item.severity === 'urgent'
                  ? TriangleAlert
                  : item.severity === 'warning'
                  ? Clock
                  : item.severity === 'reward'
                  ? Sparkles
                  : CheckCircle2;

              const iconColor =
                item.severity === 'urgent'
                  ? 'text-red-600'
                  : item.severity === 'warning'
                  ? 'text-amber-600'
                  : item.severity === 'reward'
                  ? 'text-rose-600'
                  : 'text-emerald-600';

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200/80"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-stone-900">
                        {item.title}{' '}
                        <span className="font-normal text-stone-500 font-mono tabular-nums">
                          · {item.createdAt}
                        </span>
                      </p>
                      <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDismiss(item.id)}
                    aria-label="Cerrar aviso"
                    className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
