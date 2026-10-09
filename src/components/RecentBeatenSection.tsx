import React, { useMemo, useRef, useState, useEffect } from 'react';
import { GameItem } from '../types/game';
import { getRecentBeatenGames, getBeatenDisplayDate } from '../utils/recentBeatenGames';
import { getGameEffectiveScore, getGameEffectiveTime } from '../utils/gameCalculations';
import { getUniqueZerados, cleanTitle } from '../utils/markdownParser';
import { GameCover } from './GameCover';
import { Trophy, ArrowRight, ChevronLeft, ChevronRight, Star, Clock, CalendarCheck } from 'lucide-react';

interface RecentBeatenSectionProps {
  games: GameItem[];
}

export const RecentBeatenSection: React.FC<RecentBeatenSectionProps> = ({ games }) => {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const recentGames = useMemo(() => {
    return getRecentBeatenGames(games, 7);
  }, [games]);

  const totalZerados = useMemo(() => {
    return getUniqueZerados(games.filter((g) => g.status === 'zerado')).length;
  }, [games]);

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setIsAtStart(scrollLeft <= 5);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [recentGames]);

  const handleScroll = (direction: -1 | 1) => {
    if (!scrollRef.current) return;
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scrollAmount = Math.max(260, scrollRef.current.clientWidth * 0.75);
    scrollRef.current.scrollBy({
      left: direction * scrollAmount,
      behavior: isReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section
      aria-labelledby="recent-beaten-heading"
      className="rounded-2xl border border-[#30363d] bg-[#161b22] p-4 sm:p-6 shadow-xl space-y-4"
    >
      {/* ── CABEÇALHO ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30363d]/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                id="recent-beaten-heading"
                className="font-heading text-lg sm:text-xl font-black uppercase text-white tracking-tight"
              >
                RECÉM ZERADOS
              </h2>
              {recentGames.length > 0 && (
                <span className="text-xs font-mono font-bold text-[#9aa4b2] bg-white/5 border border-[#30363d] px-2 py-0.5 rounded-md">
                  {recentGames.length} de {totalZerados} zerados
                </span>
              )}
            </div>
            <p className="text-xs text-[#9aa4b2]">
              Últimos jogos concluídos em ordem cronológica
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {recentGames.length > 0 && (
            <a
              href="#/backlog?status=zerado"
              className="text-xs font-bold text-[#22d3ee] hover:text-[#06b6d4] flex items-center gap-1 cursor-pointer transition-colors mr-2"
            >
              <span>Ver zerados</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}

          {/* Botões de Rolagem com Alvo de Toque 44px */}
          {recentGames.length > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll(-1)}
                disabled={isAtStart}
                aria-label="Ver jogos zerados anteriores"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#30363d] bg-black/40 text-white disabled:opacity-25 disabled:cursor-not-allowed hover:border-[#22d3ee] hover:text-[#22d3ee] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#22d3ee]"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll(1)}
                disabled={isAtEnd}
                aria-label="Ver próximos jogos zerados"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#30363d] bg-black/40 text-white disabled:opacity-25 disabled:cursor-not-allowed hover:border-[#22d3ee] hover:text-[#22d3ee] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#22d3ee]"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CONTEÚDO / LISTA HORIZONTAL OU VAZIO ── */}
      {recentGames.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#30363d] p-6 text-center text-xs text-[#9aa4b2]">
          Nenhum jogo zerado ainda
        </div>
      ) : (
        <div className="relative w-full overflow-hidden">
          <ul
            ref={scrollRef}
            role="list"
            tabIndex={0}
            aria-label="Lista de jogos recém zerados"
            className="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee] rounded-xl"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {recentGames.map((game) => {
              const { nota } = getGameEffectiveScore(game);
              const ratingDisplay =
                typeof nota === 'number' && !isNaN(nota) ? nota.toFixed(1) : '—';

              const { tempoMinutos } = getGameEffectiveTime(game);
              const hours = Math.floor(tempoMinutos / 60);
              const mins = tempoMinutos % 60;
              const formattedPlayTime = `${hours}h ${String(mins).padStart(2, '0')}m`;

              const displayDate = getBeatenDisplayDate(game);

              return (
                <li
                  key={game.id}
                  role="listitem"
                  className="shrink-0 snap-start w-[calc((100%-18px)/2.3)] sm:w-[calc((100%-35px)/3.5)] lg:w-[calc((100%-56px)/5)]"
                >
                  <a
                    href={`#/jogo/${encodeURIComponent(game.id)}`}
                    className="group flex flex-col h-full rounded-xl border border-[#30363d] bg-[#0d1117] p-2.5 hover:border-[#22d3ee] hover:bg-[#161b22] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]"
                  >
                    {/* Capa com Aspect Ratio 3/4 e Selo da Nota */}
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border border-[#30363d]/80 bg-black/40 shrink-0">
                      <GameCover
                        src={game.capa}
                        title={game.title}
                        consoleName={game.console}
                        size="card"
                        grayscale={false}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Selo da Nota no Canto da Capa */}
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 rounded-md bg-[#0d1117]/90 backdrop-blur-sm border border-[#ffd700]/40 px-1.5 py-0.5 shadow-md">
                        <Star className="h-3 w-3 fill-[#ffd700] text-[#ffd700]" aria-hidden="true" />
                        <span className="font-mono text-xs font-bold text-[#ffd700]">
                          {ratingDisplay}
                        </span>
                      </div>
                    </div>

                    {/* Metadados Abaixo da Capa */}
                    <div className="mt-2.5 flex flex-col justify-between flex-1 space-y-1.5">
                      <div>
                        {/* Nome (máx 2 linhas) */}
                        <h3
                          className="font-heading text-xs font-bold text-white group-hover:text-[#22d3ee] transition-colors line-clamp-2 leading-snug"
                          title={cleanTitle(game.title)}
                        >
                          {cleanTitle(game.title)}
                        </h3>

                        {/* Console e Gênero (uma linha cada, truncados com title) */}
                        <div
                          className="text-xs font-mono font-bold text-[#22d3ee] truncate mt-1"
                          title={game.console}
                        >
                          {game.console}
                        </div>
                        <div
                          className="text-xs text-[#9aa4b2] truncate"
                          title={game.genero || 'Geral'}
                        >
                          {game.genero || 'Geral'}
                        </div>
                      </div>

                      {/* Tempo Jogado e Data de Zerado */}
                      <div className="pt-2 border-t border-[#30363d]/60 space-y-1 text-xs font-mono">
                        <div
                          className="flex items-center gap-1.5 text-[#9aa4b2]"
                          title={`Tempo jogado: ${formattedPlayTime}`}
                        >
                          <Clock className="h-3.5 w-3.5 text-[#22d3ee] shrink-0" aria-hidden="true" />
                          <span className="truncate">{formattedPlayTime}</span>
                        </div>

                        <div
                          className="flex items-center gap-1.5 text-emerald-400 font-semibold"
                          title={`Zerado em: ${displayDate}`}
                        >
                          <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
                          <span className="truncate">{displayDate}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
};
