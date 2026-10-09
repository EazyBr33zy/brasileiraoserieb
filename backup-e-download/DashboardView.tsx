import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useHashRoute } from '../hooks/useHashRoute';
import { 
  CheckCircle2, 
  Clock, 
  Trophy, 
  Layers, 
  Flame, 
  Plus, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Gamepad2, 
  Activity, 
  Pencil 
} from 'lucide-react';
import { GameItem } from '../types/game';
import { 
  cleanTitle, 
  parseDateParts, 
  parseTime, 
  parseToMinutes,
  formatMinutes,
  formatTempoDisplay, 
  getUniqueZerados, 
  sortActiveGames 
} from '../utils/markdownParser';
import { getPlatformStyle } from '../utils/platformStyles';
import { useIsOwner } from '../hooks/useIsOwner';
import { Modal } from './Modal';
import { GameCover } from './GameCover';
import { PlayDaysCalendar } from './PlayDaysCalendar';
import { UpcomingGamesSection } from './UpcomingGamesSection';
import { RecentBeatenSection } from './RecentBeatenSection';

interface PlatformSlice {
  name: string;
  count: number;
  percentage: number;
  exactPercentage: number;
  totalMinutes: number;
  hoursText: string;
  color: string;
}

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: number;
  currentCycleYear: number;
  onSave: (newGoal: number) => void;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  currentCycleYear,
  onSave,
}) => {
  const [goalInput, setGoalInput] = useState(String(currentGoal));

  useEffect(() => {
    if (isOpen) {
      setGoalInput(String(currentGoal));
    }
  }, [isOpen, currentGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(goalInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 500) {
      onSave(parsed);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-[#06b6d4]">
          <Trophy className="h-5 w-5 text-[#06b6d4]" />
          <span>Definir Meta Anual ({currentCycleYear})</span>
        </div>
      }
      description="Salva no Firestore (settings/site) e atualiza a telemetria do ciclo"
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-1">
        <p className="text-xs text-[#8b949e] leading-relaxed">
          Quantos jogos você tem como meta para zerar durante o ano de {currentCycleYear}?
        </p>

        <div className="space-y-1">
          <label htmlFor="dashboard-goal-input-field" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Meta de Jogos Zerados (1 a 500)
          </label>
          <input
            id="dashboard-goal-input-field"
            type="number"
            min="1"
            max="500"
            inputMode="numeric"
            required
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="w-full min-h-[48px] rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2 text-[16px] sm:text-xl font-heading font-black text-[#06b6d4] text-center focus:border-[#06b6d4] focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#30363d]/50">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 rounded-xl border border-[#30363d] text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-[44px] px-5 rounded-xl bg-[#06b6d4] text-xs font-black text-[#0d1117] uppercase hover:brightness-110 cursor-pointer"
          >
            Salvar Meta
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const DashboardView: React.FC = () => {
  const { 
    games, 
    uniqueZerados, 
    totalZerados2026, 
    setIsNewGameModalOpen, 
    annualGoal, 
    updateAnnualGoal 
  } = useGame();

  const { navigate } = useHashRoute();
  const isOwner = useIsOwner();

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeChartMonth, setActiveChartMonth] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const currentCycleYear = 2026;
  const currentGoal = annualGoal && annualGoal >= 1 && annualGoal <= 500 ? annualGoal : 24;

  // ── 1. ACTIVE GAMES: SORTED BY LATEST SESSION (WITH DATA_INICIO & TITLE FALLBACK) ──
  const activeGamesList = useMemo(() => {
    const playing = games.filter((g) => g.status === 'jogando');
    return sortActiveGames(playing);
  }, [games]);

  const slideGames = useMemo(() => {
    return activeGamesList.length > 0 ? activeGamesList : games.slice(0, 10);
  }, [activeGamesList, games]);

  const safeSlideIndex = activeSlideIndex >= slideGames.length ? 0 : activeSlideIndex;
  const currentFeaturedGame: GameItem | undefined = slideGames[safeSlideIndex];

  // Other active games for the right column ("Em Andamento") - Showing up to 5 games
  const otherActiveGames = useMemo(() => {
    if (!currentFeaturedGame) return [];
    const list = slideGames.filter((g) => g.id !== currentFeaturedGame.id);
    if (list.length >= 5) return list.slice(0, 5);
    const fallbackList = games.filter((g) => g.id !== currentFeaturedGame.id && !list.some(item => item.id === g.id));
    return [...list, ...fallbackList].slice(0, 5);
  }, [slideGames, currentFeaturedGame, games]);

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev === 0 ? slideGames.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev === slideGames.length - 1 ? 0 : prev + 1));
  };

  // ── 2. TEMPO INVESTIDO (CICLO 2026) ──
  const cycleBeatenGames = useMemo(() => {
    return getUniqueZerados(games, currentCycleYear);
  }, [games, currentCycleYear]);

  const cycleInvestedTime = useMemo(() => {
    let totalMinutes = 0;
    let semTempoCount = 0;

    cycleBeatenGames.forEach((g) => {
      let mins = 0;
      let hasLoggedTime = false;

      if (typeof g.tempoMinutos === 'number' && g.tempoMinutos > 0) {
        mins = g.tempoMinutos;
        hasLoggedTime = true;
      } else if (g.tempo && g.tempo !== '0:00' && g.tempo !== '0h00') {
        const parsedHours = parseTime(g.tempo);
        const parsedMins = Math.round(parsedHours * 60);
        if (parsedMins > 0) {
          mins = parsedMins;
          hasLoggedTime = true;
        }
      }

      if (hasLoggedTime) {
        totalMinutes += mins;
      } else {
        semTempoCount++;
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const remainingMins = totalMinutes % 60;
    const formatted = `${hours}h ${String(remainingMins).padStart(2, '0')}m`;

    return {
      totalMinutes,
      formatted,
      beatenCount: cycleBeatenGames.length,
      semTempoCount,
    };
  }, [cycleBeatenGames]);

  // ── 3. MONTHLY RHYTHM (12 MONTHS OF CURRENT YEAR) ──
  const monthlyRhythm = useMemo(() => {
    const monthCounts = new Array(12).fill(0);
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const monthLabels = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

    uniqueZerados.forEach((g) => {
      if (g.ano_zerado === currentCycleYear && g.data_zerado) {
        const parts = parseDateParts(g.data_zerado);
        if (parts && parts.month >= 0 && parts.month < 12) {
          monthCounts[parts.month]++;
        }
      }
    });

    const maxCount = Math.max(...monthCounts, 1);
    const totalBeaten = monthCounts.reduce((a, b) => a + b, 0);
    const avgPerMonth = (totalBeaten / 12).toFixed(1);

    let peakMonthIndex = 0;
    let peakCount = 0;
    monthCounts.forEach((c, idx) => {
      if (c > peakCount) {
        peakCount = c;
        peakMonthIndex = idx;
      }
    });

    return {
      months: monthCounts.map((count, index) => ({
        key: index,
        name: monthNames[index],
        label: monthLabels[index],
        count,
      })),
      maxCount,
      totalBeaten: totalBeaten || totalZerados2026,
      avgPerMonth,
      peakMonth: {
        name: monthNames[peakMonthIndex],
        count: peakCount,
      },
    };
  }, [uniqueZerados, totalZerados2026, currentCycleYear]);

  // ── 4. PLATFORM DONUT CHART DATA (TOP 5 + OUTROS SUMMING TO 100%) ──
  const platformDonutData = useMemo(() => {
    const platformMap = new Map<string, { count: number; totalMinutes: number; color: string }>();

    games.forEach((g) => {
      // Normalize console using getPlatformStyle (handles PS5/PlayStation 5, PC/Steam, Deck, etc.)
      const style = getPlatformStyle(g.console);
      const name = style.name || 'Outros';
      const color = name === 'Outros' ? '#64748b' : style.color || '#22d3ee';

      const mins = typeof g.tempoMinutos === 'number' && g.tempoMinutos > 0
        ? g.tempoMinutos 
        : (g.tempo && g.tempo !== '0:00' && g.tempo !== '0h00' ? Math.round(parseTime(g.tempo) * 60) : 0);

      const existing = platformMap.get(name) || { count: 0, totalMinutes: 0, color };
      existing.count += 1;
      existing.totalMinutes += mins;
      if (color !== '#64748b') existing.color = color;
      platformMap.set(name, existing);
    });

    const totalGames = games.length;
    if (totalGames === 0) return { slices: [], totalGames: 0 };

    const sortedEntries = Array.from(platformMap.entries()).sort((a, b) => b[1].count - a[1].count);

    const top5 = sortedEntries.slice(0, 5);
    const rest = sortedEntries.slice(5);

    let rawSlices: PlatformSlice[] = [];

    top5.forEach(([name, data]) => {
      const hours = Math.floor(data.totalMinutes / 60);
      const m = data.totalMinutes % 60;
      const hoursText = data.totalMinutes > 0 
        ? (m > 0 ? `${hours}h ${m}m` : `${hours}h`)
        : '0h';

      rawSlices.push({
        name,
        count: data.count,
        percentage: 0,
        exactPercentage: (data.count / totalGames) * 100,
        totalMinutes: data.totalMinutes,
        hoursText,
        color: data.color,
      });
    });

    if (rest.length > 0) {
      const restCount = rest.reduce((sum, [, d]) => sum + d.count, 0);
      const restMins = rest.reduce((sum, [, d]) => sum + d.totalMinutes, 0);
      const hours = Math.floor(restMins / 60);
      const m = restMins % 60;
      const hoursText = restMins > 0 
        ? (m > 0 ? `${hours}h ${m}m` : `${hours}h`)
        : '0h';

      rawSlices.push({
        name: 'Outros',
        count: restCount,
        percentage: 0,
        exactPercentage: (restCount / totalGames) * 100,
        totalMinutes: restMins,
        hoursText,
        color: '#64748b',
      });
    }

    // Largest Remainder Method: guarantees percentages sum to exactly 100%
    let sumFloor = 0;
    const withRemainders = rawSlices.map((s) => {
      const floorVal = Math.floor(s.exactPercentage);
      const rem = s.exactPercentage - floorVal;
      sumFloor += floorVal;
      return { slice: s, floorVal, rem };
    });

    let diff = 100 - sumFloor;
    withRemainders.sort((a, b) => b.rem - a.rem);
    for (let i = 0; i < diff && i < withRemainders.length; i++) {
      withRemainders[i].floorVal += 1;
    }

    const slices = rawSlices.map((s) => {
      const match = withRemainders.find((item) => item.slice.name === s.name);
      return {
        ...s,
        percentage: match ? match.floorVal : Math.round(s.exactPercentage),
      };
    });

    return { slices, totalGames };
  }, [games]);

  // Selected slice data for center of Donut
  const activeSelectedSlice = useMemo(() => {
    if (!selectedPlatform) return null;
    return platformDonutData.slices.find((s) => s.name === selectedPlatform) || null;
  }, [selectedPlatform, platformDonutData.slices]);

  // ── GOAL RING (SVG) ──
  const goalPercentRaw = currentGoal > 0 ? (totalZerados2026 / currentGoal) * 100 : 0;
  const goalPercent = Math.min(100, Math.round(goalPercentRaw));
  const goalRemaining = Math.max(0, currentGoal - totalZerados2026);
  const RING_R = 42;
  const ringCircumference = 2 * Math.PI * RING_R;

  return (
    <div className="space-y-4 sm:space-y-6 pb-16 font-sans">
      {/* ── 1. HERO PANEL: IDENTIDADE, AÇÕES & TELEMETRIA ── */}
      <section
        className="hero-glow cyber-grid animate-fade-up rounded-3xl border border-[#30363d] bg-gradient-to-br from-[#161b22] via-[#131a22] to-[#0d1117] p-4 sm:p-6 md:p-8 shadow-2xl"
        aria-label="Visão geral do painel"
      >
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/40 px-2.5 py-1 sm:px-3 font-bold uppercase tracking-wider text-[#34d399]">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
            </span>
            <span>Telemetria Ativa</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/40 px-2.5 py-1 sm:px-3 font-bold uppercase tracking-wider text-[#fb923c]">
            <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#f97316]" aria-hidden="true" />
            <span>Ciclo {currentCycleYear}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/40 px-3 py-1 font-bold uppercase tracking-wider text-[#67e8f9] font-mono">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{goalRemaining > 0 ? `faltam ${goalRemaining} para a meta` : 'meta batida 🏆'}</span>
          </div>
        </div>

        {/* Linha Principal: Título + Capas decorativas + Botões */}
        <div className="mt-4 sm:mt-5 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#22d3ee]/80">// Sistema de backlog</p>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#f0f6fc] text-glow-accent">
              Bem-vindo,{' '}
              <span className="bg-gradient-to-r from-[#22d3ee] via-[#67e8f9] to-[#a855f7] bg-clip-text text-transparent">
                Commander.
              </span>
            </h1>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#9aa4b2] leading-relaxed">
              Backlog centralizado com telemetria gamer —{' '}
              <strong className="text-white font-semibold">{activeGamesList.length} jogos</strong> em andamento e{' '}
              <strong className="text-white font-semibold">{totalZerados2026} concluídos</strong> neste ciclo.
            </p>

            {/* Ações Rápidas Hero */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setIsNewGameModalOpen(true)}
                  className="min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#0d1117] shadow-lg shadow-[#22d3ee]/25 transition-all hover:-translate-y-0.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
                >
                  <Plus className="h-4 w-4 stroke-[3]" aria-hidden="true" />
                  <span>Novo Jogo</span>
                </button>
              )}

              <a
                href="#/backlog"
                className="min-h-[44px] flex items-center justify-center gap-2 rounded-xl border border-[#30363d] bg-[#0d1117]/80 hover:border-[#22d3ee]/60 hover:bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#22d3ee] focus:outline-none"
              >
                <Layers className="h-4 w-4 text-[#22d3ee]" aria-hidden="true" />
                <span>Explorar Acervo</span>
              </a>

              <a
                href="#/wrapup"
                className="min-h-[44px] flex items-center justify-center gap-2 px-2 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#f59e0b] hover:text-[#fbbf24] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#f59e0b] focus:outline-none rounded-xl"
              >
                <Trophy className="h-4 w-4" aria-hidden="true" />
                <span>Retrospectiva</span>
              </a>
            </div>
          </div>

          {/* Fanned cover strip — visual flourish built from real data */}
          {slideGames.length > 0 && (
            <div className="hidden md:flex items-end justify-center shrink-0 pr-2" aria-hidden="true">
              {slideGames.slice(0, 4).map((g, i) => (
                <div
                  key={g.id}
                  className="w-24 h-32 rounded-xl overflow-hidden border border-[#30363d] shadow-2xl transition-transform duration-300 hover:!rotate-0 hover:scale-105 hover:z-10"
                  style={{
                    transform: `rotate(${(i - 1.5) * 7}deg) translateY(${Math.abs(i - 1.5) * 6}px)`,
                    marginLeft: i === 0 ? 0 : '-1.75rem',
                    zIndex: i === 0 ? 1 : 0,
                  }}
                >
                  <GameCover src={g.capa} title={g.title} consoleName={g.console} size="thumb" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── PAINEL DE TELEMETRIA: ANEL DA META + STAT PILLS ── */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* CARD DESTACADO - META ANUAL COM ANEL SVG (EDITÁVEL PARA O DONO) */}
          <div className="xl:col-span-4 relative rounded-2xl border border-[#22d3ee]/30 bg-[#0d1117]/80 p-4 sm:p-5 shadow-lg flex items-center gap-4 sm:gap-5 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#22d3ee] via-[#67e8f9] to-[#a855f7]" />

            {/* Anel de progresso */}
            <div className="relative h-28 w-28 shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label={`Meta anual: ${totalZerados2026} de ${currentGoal} jogos, ${goalPercent}% concluído`}>
                <circle cx="50" cy="50" r={RING_R} fill="none" stroke="#21262d" strokeWidth="9" />
                <circle
                  cx="50" cy="50" r={RING_R}
                  fill="none"
                  stroke="url(#goalGradient)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringCircumference * (1 - goalPercent / 100)}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-2xl font-black text-white leading-none">{goalPercent}%</span>
                <span className="text-[10px] font-mono text-[#9aa4b2] mt-0.5">da meta</span>
              </div>
            </div>

            {/* Texto da meta */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#9aa4b2]">
                  Meta Anual {currentCycleYear}
                </span>
                {isOwner ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingGoal(true)}
                    className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center text-[#22d3ee] hover:text-[#06b6d4] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    aria-label="Editar meta anual"
                    title="Editar meta anual"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <Trophy className="h-4 w-4 text-[#22d3ee] shrink-0" aria-hidden="true" />
                )}
              </div>

              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#f0f6fc] leading-none">
                  {totalZerados2026}
                </span>
                <span className="text-sm font-bold text-[#9aa4b2] font-mono">/ {currentGoal} jogos</span>
              </div>

              <p className="mt-2 text-xs text-[#9aa4b2] leading-relaxed">
                {goalRemaining > 0 ? (
                  <>Faltam <strong className="text-[#22d3ee] font-mono">{goalRemaining}</strong> zeramentos para fechar o ciclo.</>
                ) : (
                  <>Meta alcançada — ciclo <strong className="text-emerald-400">concluído com sucesso</strong>.</>
                )}
              </p>

              <div className="mt-2 pt-2 border-t border-[#30363d]/40 text-xs font-mono text-[#9aa4b2]">
                <span className="text-[#22d3ee] font-bold">{uniqueZerados.length}</span> zerados na história
              </div>
            </div>
          </div>

          {/* GRID DE STATS SECUNDÁRIOS */}
          <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* CARD - EM ANDAMENTO */}
            <div className="relative rounded-2xl border border-[#30363d] bg-[#0d1117]/80 p-4 sm:p-5 shadow-lg flex flex-col justify-between overflow-hidden group hover:border-[#a855f7]/50 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#a855f7]" />
              <div>
                <div className="flex items-center gap-2 text-[#9aa4b2]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#a855f7]/15 border border-[#a855f7]/30 shrink-0">
                    <Layers className="h-4 w-4 text-[#a855f7]" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">Em Andamento</span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#f0f6fc] leading-none group-hover:text-[#d8b4fe] transition-colors">
                    {activeGamesList.length}
                  </span>
                  <span className="text-xs font-bold uppercase text-[#9aa4b2]">jogando</span>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#30363d]/40 text-xs text-[#9aa4b2]">
                <span className="font-mono text-[#a855f7] font-bold">Foco prioritário</span> · sessões ativas
              </div>
            </div>

            {/* CARD - ACERVO TOTAL */}
            <div className="relative rounded-2xl border border-[#30363d] bg-[#0d1117]/80 p-4 sm:p-5 shadow-lg flex flex-col justify-between overflow-hidden group hover:border-[#22d3ee]/50 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#22d3ee]" />
              <div>
                <div className="flex items-center gap-2 text-[#9aa4b2]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22d3ee]/15 border border-[#22d3ee]/30 shrink-0">
                    <Gamepad2 className="h-4 w-4 text-[#22d3ee]" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">Acervo Total</span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-3xl sm:text-4xl font-extrabold text-[#f0f6fc] leading-none group-hover:text-[#67e8f9] transition-colors">
                    {games.length}
                  </span>
                  <span className="text-xs font-bold uppercase text-[#9aa4b2]">catalogados</span>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#30363d]/40 flex items-center justify-between text-xs text-[#9aa4b2]">
                <span className="truncate">Vault sincronizado</span>
                <span className="flex items-center gap-1.5 font-mono text-emerald-400 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Online
                </span>
              </div>
            </div>

            {/* CARD - TEMPO INVESTIDO */}
            <div className="relative rounded-2xl border border-[#30363d] bg-[#0d1117]/80 p-4 sm:p-5 shadow-lg flex flex-col justify-between overflow-hidden group hover:border-[#fbbf24]/50 transition-colors sm:col-span-3 lg:col-span-1">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#fbbf24]" />
              <div>
                <div className="flex items-center gap-2 text-[#9aa4b2]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fbbf24]/15 border border-[#fbbf24]/30 shrink-0">
                    <Clock className="h-4 w-4 text-[#fbbf24]" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">Tempo Investido</span>
                </div>

                <div className="mt-3">
                  <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#f0f6fc] leading-none group-hover:text-[#fde68a] transition-colors">
                    {cycleInvestedTime.formatted}
                  </div>
                  <div className="text-xs text-[#9aa4b2] mt-1.5">
                    em {cycleInvestedTime.beatenCount} zerados em {currentCycleYear}
                    {cycleInvestedTime.semTempoCount > 0 && (
                      <span> · {cycleInvestedTime.semTempoCount} sem tempo</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#30363d]/40 flex items-center gap-1.5 text-xs text-[#10b981]">
                <Activity className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-slate-300 truncate">Telemetria consistente</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CONTAINER UNIFICADO: JOGANDO AGORA & EM ANDAMENTO ── */}
      {currentFeaturedGame && (
        <section className="animate-fade-up rounded-3xl border border-[#30363d] bg-[#161b22] p-3 sm:p-5 md:p-6 shadow-xl" style={{ animationDelay: '80ms' }} aria-label="Jogando agora">
          <div className="flex items-center justify-between border-b border-[#30363d]/60 pb-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22d3ee] opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22d3ee] shadow-[0_0_8px_#22d3ee]" />
              </span>
              <h2 className="text-sm sm:text-xl font-black uppercase tracking-wide text-white">
                Jogando Agora
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs font-mono font-bold text-[#22d3ee]">
                {safeSlideIndex + 1} / {slideGames.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="h-7 w-7 rounded-lg border border-[#30363d] bg-[#0d1117] hover:border-[#22d3ee] text-[#9aa4b2] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Jogo Anterior"
                  aria-label="Jogo anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="h-7 w-7 rounded-lg border border-[#30363d] bg-[#0d1117] hover:border-[#22d3ee] text-[#9aa4b2] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Próximo Jogo"
                  aria-label="Próximo jogo"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 items-stretch">
            {/* CARD PRINCIPAL DO JOGO (FEATURED) */}
            <div className="lg:col-span-8 rounded-xl border border-[#30363d]/80 bg-[#0d1117]/60 p-3 sm:p-5 flex flex-col justify-between h-full">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center">
                {/* Capa */}
                <div className="w-full md:w-56 shrink-0 max-w-[240px] mx-auto">
                  <GameCover
                    src={currentFeaturedGame.capa}
                    title={currentFeaturedGame.title}
                    consoleName={currentFeaturedGame.console}
                    size="hero"
                    className="rounded-xl shadow-2xl"
                  />
                </div>

                {/* Detalhes */}
                <div className="flex-1 w-full flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="rounded-md bg-[#0c2238] border border-[#0284c7]/70 px-2.5 py-1 text-xs font-bold font-mono text-[#38bdf8]">
                        {currentFeaturedGame.console || 'Steam Deck'}
                      </span>
                      <span className="rounded-md bg-[#a855f7]/15 border border-[#a855f7]/30 px-2.5 py-1 text-xs font-medium text-[#d8b4fe]">
                        {currentFeaturedGame.genero || 'Geral'}
                      </span>
                      {currentFeaturedGame.nota !== undefined && (
                        <span className="rounded-md bg-[#ffd700]/20 border border-[#ffd700]/40 px-2 py-0.5 text-xs font-black text-[#ffd700]">
                          ★ {currentFeaturedGame.nota.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <a
                      href={`#/jogo/${encodeURIComponent(currentFeaturedGame.id)}`}
                      className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-white hover:text-[#22d3ee] transition-colors block leading-tight"
                    >
                      {cleanTitle(currentFeaturedGame.title)}
                    </a>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#30363d]/50 text-xs">
                    <div className="bg-black/30 p-2.5 rounded-lg border border-[#30363d]/40">
                      <div className="text-[#9aa4b2] uppercase font-bold text-xs flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#22d3ee]" />
                        <span>TEMPO REGISTRADO</span>
                      </div>
                      <div className="text-base sm:text-lg font-bold text-white mt-0.5 font-mono">
                        {currentFeaturedGame.tempo ? formatTempoDisplay(currentFeaturedGame.tempo) : '0h00'}
                      </div>
                    </div>

                    <div className="bg-black/30 p-2.5 rounded-lg border border-[#30363d]/40">
                      <div className="text-[#9aa4b2] uppercase font-bold text-xs flex items-center gap-1">
                        <Trophy className="h-3.5 w-3.5 text-emerald-400" />
                        <span>STATUS</span>
                      </div>
                      <div className="text-base sm:text-lg font-bold text-[#22d3ee] mt-0.5 uppercase">
                        {currentFeaturedGame.status}
                      </div>
                    </div>
                  </div>

                  {/* ── BARRA DE PROGRESSO: HORAS JOGADAS vs HLTB ── */}
                  {(() => {
                    const playedMin = parseToMinutes(currentFeaturedGame.tempo);
                    const hltbMin = parseToMinutes(currentFeaturedGame.hltb);
                    const pct = hltbMin > 0 ? Math.round((playedMin / hltbMin) * 100) : 0;
                    const remainingMin = Math.max(0, hltbMin - playedMin);

                    return (
                      <div className="rounded-xl bg-black/40 border border-[#30363d]/60 p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#9aa4b2]">
                            <span className="h-2 w-2 rounded-full bg-[#22d3ee] shadow-[0_0_6px_#22d3ee]" aria-hidden="true" />
                            <span>PROGRESSO HLTB</span>
                          </div>
                          <div className="font-mono font-bold text-xs">
                            {hltbMin > 0 ? (
                              <span className={pct >= 100 ? 'text-emerald-400' : 'text-[#22d3ee]'}>
                                {pct}% CONCLUÍDO
                              </span>
                            ) : (
                              <span className="text-[#9aa4b2] text-xs font-normal">HLTB não definido</span>
                            )}
                          </div>
                        </div>

                        {/* Barra Visual */}
                        <div className="relative h-2.5 w-full rounded-full bg-[#161b22] border border-[#30363d]/60 overflow-hidden p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              pct >= 100
                                ? 'bg-gradient-to-r from-[#22d3ee] to-emerald-400'
                                : 'bg-gradient-to-r from-[#0284c7] via-[#22d3ee] to-[#a855f7]'
                            }`}
                            style={{
                              width: `${hltbMin > 0 ? Math.min(100, Math.max(playedMin > 0 ? 3 : 0, pct)) : 0}%`,
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono text-[#9aa4b2]">
                          <span>
                            Jogado: <strong className="text-white">{formatTempoDisplay(currentFeaturedGame.tempo)}</strong>
                          </span>
                          <span>
                            Meta HLTB:{' '}
                            <strong className="text-[#22d3ee]">
                              {currentFeaturedGame.hltb ? formatTempoDisplay(currentFeaturedGame.hltb) : '—'}
                            </strong>
                            {hltbMin > 0 && remainingMin > 0 && (
                              <span className="text-[#9aa4b2] ml-1">
                                (~{formatMinutes(remainingMin)} restante)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Botão Ficha do Jogo */}
                  <div className="pt-1">
                    <a
                      href={`#/jogo/${encodeURIComponent(currentFeaturedGame.id)}`}
                      className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-[#22d3ee] hover:bg-[#06b6d4] py-2.5 px-4 text-xs sm:text-sm font-black uppercase tracking-wider text-[#0d1117] transition-all shadow-lg shadow-[#22d3ee]/20 cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                      <span>Ver Ficha Completa & Sessões</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* LISTA EM ANDAMENTO (COLUNA DIREITA) - ORDENADO POR SESSÃO RECENTE */}
            <div className="lg:col-span-4 rounded-xl border border-[#30363d]/80 bg-[#0d1117]/60 p-3 sm:p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#30363d]/50 pb-2 mb-2.5">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span>≡</span>
                  <span>OUTROS EM ANDAMENTO</span>
                </h3>
                <span className="text-xs font-mono font-bold text-[#22d3ee]">
                  {activeGamesList.length} ATIVOS
                </span>
              </div>

              <div className="space-y-2 flex-1 flex flex-col justify-between">
                {otherActiveGames.map((g) => {
                  const pStyle = getPlatformStyle(g.console);
                  const gPlayedMin = parseToMinutes(g.tempo);
                  const gHltbMin = parseToMinutes(g.hltb);
                  const gPercent = gHltbMin > 0 ? Math.round((gPlayedMin / gHltbMin) * 100) : 0;
                  return (
                    <a
                      key={g.id}
                      href={`#/jogo/${encodeURIComponent(g.id)}`}
                      className="flex items-center gap-2.5 p-2 rounded-xl border border-[#30363d] bg-[#161b22] hover:border-[#22d3ee] transition-all group cursor-pointer"
                    >
                      <div className="h-12 w-9 rounded-lg overflow-hidden shrink-0 border border-[#30363d]">
                        <GameCover
                          src={g.capa}
                          title={g.title}
                          consoleName={g.console}
                          size="thumb"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-mono font-bold text-[#9aa4b2]">
                          {pStyle.name}
                        </div>
                        <div className="font-heading text-xs font-bold text-white group-hover:text-[#22d3ee] truncate">
                          {cleanTitle(g.title)}
                        </div>
                        <div className="text-xs text-[#9aa4b2] font-mono mt-0.5 flex items-center justify-between">
                          <span>⏱ {g.tempo ? formatTempoDisplay(g.tempo) : '0h00'}</span>
                          {gHltbMin > 0 && (
                            <span className={gPercent >= 100 ? 'text-emerald-400 font-bold' : 'text-[#22d3ee] font-bold'}>
                              {gPercent}% HLTB
                            </span>
                          )}
                        </div>
                        {gHltbMin > 0 && (
                          <div className="h-1 w-full rounded-full bg-black/60 overflow-hidden mt-1">
                            <div
                              className={`h-full rounded-full ${gPercent >= 100 ? 'bg-emerald-400' : 'bg-[#22d3ee]'}`}
                              style={{ width: `${Math.min(100, Math.max(gPlayedMin > 0 ? 5 : 0, gPercent))}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── RECÉM ZERADOS (7 JOGOS MAIS RECENTES) ── */}
      <RecentBeatenSection games={games} />

      {/* ── 2. DIAS QUE JOGUEI (CALENDÁRIO MENSAL) ── */}
      <PlayDaysCalendar games={games} />

      {/* ── 3. PRÓXIMOS JOGOS (PRIORIDADE) ── */}
      <UpcomingGamesSection games={games} />

      {/* ── 4. ANALYTICS & TELEMETRIA DO CICLO ── */}
      <section className="animate-fade-up rounded-3xl border border-[#30363d] bg-[#161b22] p-4 sm:p-6 shadow-xl" style={{ animationDelay: '160ms' }} aria-label="Analytics e telemetria do ciclo">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363d]/60 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] shrink-0">
              <Activity className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-black uppercase text-white tracking-tight">
                ANALYTICS & RITMO DE CONCLUÍDOS ({currentCycleYear})
              </h2>
              <p className="text-xs text-[#9aa4b2]">
                Evolução mês a mês e distribuição por plataformas
              </p>
            </div>
          </div>

          <a
            href="#/wrapup"
            className="text-xs font-bold text-[#f59e0b] hover:text-[#fbbf24] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Ver Retrospectiva Completa</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
          {/* RITMO MÊS A MÊS */}
          <div className="rounded-xl border border-[#30363d]/80 bg-[#0d1117]/70 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-white uppercase">Ritmo de Zeramentos</span>
                <span className="font-mono text-[#06b6d4] font-bold">Média: {monthlyRhythm.avgPerMonth} jogos/mês</span>
              </div>

              {/* Gráfico 12 Barras Interativo */}
              <div className="grid grid-cols-12 gap-1.5 sm:gap-2 items-end h-32 sm:h-40 pt-3">
                {monthlyRhythm.months.map((m) => {
                  const heightPercent = m.count > 0 
                    ? Math.max(22, Math.round((m.count / monthlyRhythm.maxCount) * 100))
                    : 6;
                  const isCurrent = m.key === new Date().getMonth();

                  return (
                    <div
                      key={m.key}
                      tabIndex={0}
                      role="button"
                      aria-label={`${m.name}: ${m.count} ${m.count === 1 ? 'jogo zerado' : 'jogos zerados'}`}
                      onClick={() => setActiveChartMonth(prev => prev === m.key ? null : m.key)}
                      onFocus={() => setActiveChartMonth(m.key)}
                      onBlur={() => setActiveChartMonth(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveChartMonth(prev => prev === m.key ? null : m.key);
                        }
                      }}
                      className="flex flex-col items-center gap-1 h-full justify-end group relative cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#06b6d4] rounded"
                    >
                      {/* Tooltip on Hover, Focus or Tap */}
                      <div className={`absolute -top-9 z-30 flex-col items-center pointer-events-none transition-opacity ${
                        activeChartMonth === m.key ? 'flex opacity-100' : 'hidden group-hover:flex group-focus-visible:flex'
                      }`}>
                        <div className="bg-[#161b22] border border-[#30363d] px-2 py-1 rounded text-xs font-mono text-white shadow-xl whitespace-nowrap">
                          <span className="font-bold text-[#06b6d4]">{m.name}:</span> {m.count} {m.count === 1 ? 'jogo' : 'jogos'}
                        </div>
                        <div className="w-1.5 h-1.5 bg-[#161b22] border-r border-b border-[#30363d] rotate-45 -mt-1" />
                      </div>

                      {/* Número acima da barra */}
                      <span className={`text-xs font-mono font-bold ${
                        isCurrent 
                          ? 'text-[#f59e0b] font-black' 
                          : m.count > 0 
                            ? 'text-[#06b6d4]' 
                            : 'text-[#9aa4b2]/50'
                      }`}>
                        {m.count > 0 ? m.count : '0'}
                      </span>

                      {/* Barra */}
                      <div
                        className={`w-full rounded-t-sm transition-all duration-300 group-hover:brightness-125 ${
                          isCurrent
                            ? 'bg-gradient-to-t from-[#d97706] to-[#f59e0b] shadow-[0_0_12px_#f59e0b]/50'
                            : m.count > 0
                              ? 'bg-gradient-to-t from-[#0891b2] to-[#06b6d4] shadow-[0_0_8px_#06b6d4]/30'
                              : 'bg-[#21262d]/50 group-hover:bg-[#30363d]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />

                      {/* Sigla do Mês */}
                      <span className={`text-xs font-mono tracking-wider ${
                        isCurrent ? 'font-bold text-[#f59e0b]' : m.count > 0 ? 'text-white font-semibold' : 'text-[#9aa4b2]'
                      }`}>
                        {m.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[#30363d]/50 pt-3 mt-4 flex items-center justify-between text-xs text-[#9aa4b2] font-mono">
              <span>Pico Anual: <strong className="text-white">{monthlyRhythm.peakMonth.name} ({monthlyRhythm.peakMonth.count} zerados)</strong></span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase text-xs">
                EM RITMO
              </span>
            </div>
          </div>

          {/* ── DISTRIBUIÇÃO POR PLATAFORMA — BIBLIOTECA TOTAL (GRÁFICO DE PIZZA / DONUT SVG) ── */}
          <div className="rounded-xl border border-[#30363d]/80 bg-[#0d1117]/70 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-bold text-white uppercase text-xs sm:text-sm tracking-wide">
                    Distribuição por Plataforma
                  </h3>
                  <span className="text-xs font-mono text-[#22d3ee] font-bold">
                    BIBLIOTECA TOTAL
                  </span>
                </div>

                {selectedPlatform && (
                  <button
                    type="button"
                    onClick={() => setSelectedPlatform(null)}
                    className="text-xs text-[#9aa4b2] hover:text-white underline cursor-pointer"
                  >
                    Limpar filtro
                  </button>
                )}
              </div>

              {/* GRÁFICO DE PIZZA (DONUT) SVG + LEGENDA */}
              <div className="flex flex-col xl:flex-row items-center gap-5 sm:gap-6 py-2">
                {/* SVG DONUT CHART (CENTRALIZADO COM 200-240PX NO MOBILE) */}
                <div className="w-[210px] h-[210px] sm:w-[230px] sm:h-[230px] shrink-0 mx-auto relative flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 200"
                    role="img"
                    aria-label={`Gráfico de pizza com distribuição de jogos por plataforma na biblioteca total. ${platformDonutData.slices.map(s => `${s.name}: ${s.percentage}%`).join(', ')}`}
                    className="w-full h-full transform -rotate-90 select-none overflow-visible"
                  >
                    {(() => {
                      if (platformDonutData.slices.length === 0) {
                        return (
                          <circle
                            cx="100"
                            cy="100"
                            r="66"
                            fill="transparent"
                            stroke="#30363d"
                            strokeWidth="28"
                          />
                        );
                      }

                      // If single slice = 100%
                      if (platformDonutData.slices.length === 1) {
                        const s = platformDonutData.slices[0];
                        const isSelected = selectedPlatform === s.name;
                        return (
                          <circle
                            cx="100"
                            cy="100"
                            r="66"
                            fill="transparent"
                            stroke={s.color}
                            strokeWidth={isSelected ? 32 : 28}
                            className="cursor-pointer transition-all duration-300"
                            onClick={() => setSelectedPlatform(prev => prev === s.name ? null : s.name)}
                          />
                        );
                      }

                      // Multiple slices: render SVG arc paths
                      const R = 80;
                      const r = 52;
                      let currentAngle = 0;

                      return platformDonutData.slices.map((slice) => {
                        const angleSpan = (slice.percentage / 100) * 2 * Math.PI;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + angleSpan;
                        currentAngle = endAngle;

                        if (angleSpan <= 0.001) return null;

                        const x1 = 100 + R * Math.cos(startAngle);
                        const y1 = 100 + R * Math.sin(startAngle);
                        const x2 = 100 + R * Math.cos(endAngle);
                        const y2 = 100 + R * Math.sin(endAngle);
                        const x3 = 100 + r * Math.cos(endAngle);
                        const y3 = 100 + r * Math.sin(endAngle);
                        const x4 = 100 + r * Math.cos(startAngle);
                        const y4 = 100 + r * Math.sin(startAngle);

                        const largeArcFlag = angleSpan > Math.PI ? 1 : 0;
                        const pathData = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;

                        const isSelected = selectedPlatform === slice.name;
                        const isAnySelected = selectedPlatform !== null;
                        const opacity = isSelected ? 1 : isAnySelected ? 0.35 : 0.95;

                        return (
                          <path
                            key={slice.name}
                            d={pathData}
                            fill={slice.color}
                            stroke="#0d1117"
                            strokeWidth={isSelected ? "3" : "2"}
                            opacity={opacity}
                            tabIndex={0}
                            role="button"
                            aria-label={`${slice.name}: ${slice.count} jogos (${slice.percentage}%), ${slice.hoursText}`}
                            onClick={() => setSelectedPlatform(prev => prev === slice.name ? null : slice.name)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedPlatform(prev => prev === slice.name ? null : slice.name);
                              }
                            }}
                            className="cursor-pointer transition-all duration-300 hover:opacity-100 hover:brightness-110 focus-visible:outline-none focus-visible:stroke-white"
                          />
                        );
                      });
                    })()}
                  </svg>

                  {/* CENTRO DO DONUT (TEXTO INTERATIVO) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
                    {activeSelectedSlice ? (
                      <div className="animate-in fade-in zoom-in-95 duration-200">
                        <span className="text-xs font-mono uppercase font-bold text-[#9aa4b2] block truncate max-w-[84px]">
                          {activeSelectedSlice.name}
                        </span>
                        <span
                          className="font-heading text-xl sm:text-2xl font-black block font-mono leading-none my-0.5"
                          style={{ color: activeSelectedSlice.color }}
                        >
                          {activeSelectedSlice.percentage}%
                        </span>
                        <span className="text-xs font-semibold text-white block">
                          {activeSelectedSlice.count} {activeSelectedSlice.count === 1 ? 'jogo' : 'jogos'}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-mono uppercase font-bold tracking-wider text-[#9aa4b2] block">
                          ACERVO
                        </span>
                        <span className="font-heading text-xl sm:text-2xl font-black text-white block font-mono leading-none my-0.5">
                          {platformDonutData.totalGames}
                        </span>
                        <span className="text-xs text-[#9aa4b2] block">
                          jogos totais
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* LEGENDA AO LADO (DESKTOP) OU ABAIXO (MOBILE) */}
                <div className="w-full flex-1 space-y-1.5">
                  {platformDonutData.slices.map((slice) => {
                    const isSelected = selectedPlatform === slice.name;
                    return (
                      <button
                        key={slice.name}
                        type="button"
                        tabIndex={0}
                        onClick={() => setSelectedPlatform((prev) => (prev === slice.name ? null : slice.name))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedPlatform((prev) => (prev === slice.name ? null : slice.name));
                          }
                        }}
                        className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#22d3ee] bg-[#22d3ee]/10 shadow-lg shadow-[#22d3ee]/10 ring-1 ring-[#22d3ee]/40'
                            : selectedPlatform
                              ? 'border-[#30363d]/30 bg-black/20 opacity-40 hover:opacity-100 hover:border-[#30363d]'
                              : 'border-[#30363d]/50 bg-black/20 hover:border-[#30363d] hover:bg-black/30'
                        }`}
                        aria-pressed={isSelected}
                        aria-label={`${slice.name}: ${slice.count} jogos, ${slice.percentage}%, ${slice.hoursText} jogadas`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span
                            className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: slice.color }}
                            aria-hidden="true"
                          />
                          <span className="text-xs font-bold text-white truncate">
                            {slice.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono shrink-0">
                          <span className="text-[#9aa4b2]">{slice.count} jogos</span>
                          <span className="text-emerald-400 font-semibold">{slice.hoursText}</span>
                          <span className="text-white font-bold min-w-[34px] text-right">{slice.percentage}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-[#30363d]/50 pt-3 mt-4 flex items-center justify-between text-xs text-[#9aa4b2] font-mono">
              <span>Líder: <strong className="text-white">{platformDonutData.slices[0]?.name || '—'}</strong></span>
              <span className="text-[#22d3ee] font-bold">
                {games.length} jogos na biblioteca
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL: EDITAR META ANUAL (SOMENTE DONO) ── */}
      <EditGoalModal
        isOpen={isEditingGoal && isOwner}
        onClose={() => setIsEditingGoal(false)}
        currentGoal={currentGoal}
        currentCycleYear={currentCycleYear}
        onSave={(newGoal) => updateAnnualGoal(newGoal, currentCycleYear)}
      />
    </div>
  );
};
