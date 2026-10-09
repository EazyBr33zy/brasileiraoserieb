import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WrapUpHeroProps {
  ANO: number;
  availableYears: number[];
  activeTab: 'resumo' | 'analise' | 'status' | 'top' | 'timeline';
  setActiveTabLocal: (tab: 'resumo' | 'analise' | 'status' | 'top' | 'timeline') => void;
  onYearChange: (delta: number) => void;
}

export const WrapUpHero: React.FC<WrapUpHeroProps> = ({
  ANO,
  availableYears,
  activeTab,
  setActiveTabLocal,
  onYearChange,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#09090f] via-[#0b0c16] to-[#120e24] p-3.5 sm:p-6 shadow-2xl">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#00f5ff] mb-1">
            <span className="h-0.5 w-4 sm:w-6 bg-[#00f5ff]"></span>
            Retrospectiva Gamer
          </div>
          <h1 className="font-heading text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-normal sm:tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00f5ff] to-[#bc13fe]">
            Wrap-Up Anual
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Navegue pelas abas para conferir KPIs de desempenho, gráficos de análise, pódio dos melhores jogos e calendário de zeradas.
          </p>
        </div>

        {/* Year Navigator */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">
            Selecionar Ano
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onYearChange(1)}
              disabled={availableYears.indexOf(ANO) >= availableYears.length - 1}
              className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:border-[#00f5ff] hover:bg-[#00f5ff]/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            <div className="font-heading text-xl sm:text-3xl font-black text-[#00f5ff] min-w-[60px] sm:min-w-[80px] text-center text-glow-cyan">
              {ANO}
            </div>

            <button
              onClick={() => onYearChange(-1)}
              disabled={availableYears.indexOf(ANO) <= 0}
              className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:border-[#00f5ff] hover:bg-[#00f5ff]/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs (5 columns) */}
      <div className="sm:hidden grid grid-cols-5 gap-1 border-t border-white/10 pt-3 mt-3">
        {[
          { id: 'resumo', label: 'Resumo', icon: '📊' },
          { id: 'analise', label: 'Análise', icon: '📈' },
          { id: 'status', label: 'Status', icon: '⚡' },
          { id: 'top', label: 'Top Jogos', icon: '🏆' },
          { id: 'timeline', label: 'Timeline', icon: '📅' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabLocal(tab.id as any)}
            className={`flex flex-col items-center justify-center py-2 px-0.5 rounded-xl text-center transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#00f5ff]/15 border border-[#00f5ff]/50 text-[#00f5ff] shadow-sm shadow-[#00f5ff]/20 font-black'
                : 'bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm leading-none mb-1">{tab.icon}</span>
            <span className="text-xs font-bold leading-tight truncate w-full px-0.5">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Desktop Navigation Tabs */}
      <div className="hidden sm:flex mt-6 gap-2 border-b border-white/10 overflow-x-auto scrollbar-none">
        {[
          { id: 'resumo', label: 'Resumo', icon: '📊' },
          { id: 'analise', label: 'Análise', icon: '📈' },
          { id: 'status', label: 'Status', icon: '⚡' },
          { id: 'top', label: 'Top Jogos + GOT', icon: '🏆' },
          { id: 'timeline', label: 'Timeline', icon: '📅' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabLocal(tab.id as any)}
            className={`flex items-center gap-1.5 sm:gap-2 rounded-t-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs font-black uppercase tracking-wider transition-all border-t border-x whitespace-nowrap flex-shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'border-white/15 bg-[#0e131d] text-[#00f5ff] shadow-lg'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
