/**
 * @fileoverview Barra de navegación superior siguiendo estrictamente el contrato de 3 zonas.
 */

import React from 'react';

export type ActiveTab = 'study' | 'calendar' | 'makeup' | 'parent';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  availablePlayFormatted: string;
  isLocked: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  availablePlayFormatted,
  isLocked,
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'study', label: 'Temario 4º–6º' },
    { id: 'calendar', label: 'Agenda y Exámenes' },
    { id: 'makeup', label: 'Estudio Glam AR' },
    { id: 'parent', label: 'Zona Madre' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 bg-[#FAF8F5]/95 backdrop-blur border-b border-stone-200">
      {/* Zona 1: Marca en una sola línea */}
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('study');
        }}
        className="font-display text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
      >
        Palancia Estudio &amp; Glam
      </a>

      {/* Zona 2: 4 enlaces de navegación limpios en una sola línea */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`whitespace-nowrap shrink-0 py-1 transition-colors border-b-2 ${
                isActive
                  ? 'border-rose-600 text-stone-950 font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-950'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zona 3: 1 acción principal */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => onSelectTab(isLocked ? 'study' : 'makeup')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 font-mono tabular-nums ${
            isLocked
              ? 'bg-stone-900 text-white hover:bg-stone-800'
              : 'bg-rose-600 text-white hover:bg-rose-700'
          }`}
        >
          {isLocked ? 'Ganar Tiempo de Juego' : `Glam AR · ${availablePlayFormatted}`}
        </button>
      </div>
    </header>
  );
};
