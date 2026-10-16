import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { fmtH } from '../../utils/markdownParser';
import { GameItem } from '../../types/game';
import { matchesCategory } from '../../utils/categoryNormalization';

interface CategoryRankingProps {
  items: Array<[string, { count: number; hours: number }]>;
  total: number;
  games: GameItem[];
  pctLabel: string;
  isPlatform: boolean;
  openMap: Record<string, boolean>;
  onToggle: (nome: string) => void;
  onGameClick: (id: string) => void;
}

const RANK_GRADIENT = 'linear-gradient(90deg, #22d3ee, #a78bfa)';

/** Mini-capa compacta usada nas listas expandidas (desktop). */
const MiniCover: React.FC<{
  g: GameItem;
  onClick: (id: string) => void;
  extra?: string;
}> = ({ g, onClick, extra }) => (
  <div
    onClick={() => onClick(g.id)}
    className="group flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-[#30363d] bg-black/40 p-1.5 transition-colors hover:border-[#22d3ee]"
    title={`${g.title} (★ ${g.nota !== undefined ? g.nota.toFixed(1) : '—'})`}
  >
    <img
      src={g.capa}
      alt={g.title}
      referrerPolicy="no-referrer"
      className="h-10 w-8 flex-shrink-0 rounded border border-white/10 object-cover"
    />
    <div className="min-w-0">
      <div className="truncate text-xs font-semibold text-[#f0f6fc] transition-colors group-hover:text-[#22d3ee]">
        {g.title}
      </div>
      <div className="truncate font-mono text-xs text-slate-400">
        {extra ?? `${g.tempo ? g.tempo : '—'}${g.data_zerado ? ' · ' + String(g.data_zerado).slice(0, 5) : ''}`}
      </div>
    </div>
  </div>
);

/**
 * Ranking compacto de categorias (plataformas/gêneros).
 * Em telas ≥1024px mostra as 8 primeiras + "Ver todas (N)" e barra horizontal
 * proporcional; abaixo disso renderiza os cartões expansíveis exatamente como hoje.
 */
export const CategoryRanking: React.FC<CategoryRankingProps> = ({
  items,
  total,
  games,
  pctLabel,
  isPlatform,
  openMap,
  onToggle,
  onGameClick,
}) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 8);
  const maxCount = Math.max(...items.map(([, s]) => s.count), 1);

  return (
    <>
      {/* ── Desktop (≥1024px): ranking em lista ── */}
      <div className="wu-cat-rank mt-4 hidden flex-col lg:flex">
        {visible.map(([nome, stats], idx) => {
          const isOpen = openMap[nome] ?? false;
          const barPct = Math.round((stats.count / maxCount) * 100);
          const pctTotal = total > 0 ? Math.round((stats.count / total) * 100) : 0;
          const catGames = games.filter((g) =>
            matchesCategory(isPlatform ? g.console : g.genero, nome)
          );
          return (
            <div key={nome}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => onToggle(nome)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggle(nome);
                  }
                }}
                className="flex h-[44px] cursor-pointer items-center gap-3 rounded-lg px-2 transition-colors hover:bg-white/[0.03]"
              >
                {idx === 0 ? (
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[#fbbf24]/50 bg-[#fbbf24]/15 font-mono text-xs font-bold tabular-nums text-[#fbbf24]">
                    01
                  </span>
                ) : (
                  <span className="w-6 flex-shrink-0 text-right font-mono text-xs tabular-nums text-slate-500">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                )}
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border border-[#30363d] bg-black/40 text-sm opacity-70 saturate-50">
                  {isPlatform ? '🎮' : '🎲'}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#f0f6fc]" title={nome}>
                  {nome}
                </span>
                <span className="hidden min-w-0 flex-[1.4] xl:block">
                  <span className="block h-1.5 w-full overflow-hidden rounded-full bg-[#1f2937]">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${barPct}%`, background: RANK_GRADIENT }}
                    />
                  </span>
                </span>
                <strong className="w-8 flex-shrink-0 text-right font-mono text-sm font-bold tabular-nums text-[#f0f6fc]">
                  {stats.count}
                </strong>
                <span className="w-16 flex-shrink-0 truncate text-right font-mono text-xs tabular-nums text-slate-400" title={fmtH(stats.hours)}>
                  {fmtH(stats.hours)}
                </span>
                <span className="w-10 flex-shrink-0 text-right font-mono text-xs tabular-nums text-slate-500">
                  {pctTotal}%
                </span>
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-slate-500 transition-transform ${
                    isOpen ? 'rotate-180 text-[#22d3ee]' : ''
                  }`}
                />
              </div>
              {isOpen && (
                <div className="border-t border-white/5 bg-black/30 p-3">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {catGames.map((g) => (
                      <MiniCover
                        key={g.id}
                        g={g}
                        onClick={onGameClick}
                        extra={isPlatform ? g.genero : g.console}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!showAll && items.length > 8 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-2 self-start rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300 transition-colors hover:border-[#22d3ee] hover:text-[#22d3ee]"
          >
            Ver todas ({items.length})
          </button>
        )}
      </div>

      {/* ── Mobile/tablet (<1024px): cartões expansíveis como hoje ── */}
      <div className="mt-3 grid grid-cols-1 gap-2.5 items-start lg:hidden">
        {items.map(([nome, stats]) => {
          const pct = total > 0 ? Math.round((stats.count / total) * 100) : 0;
          const isOpen = openMap[nome] ?? false;
          const catGames = games.filter((g) =>
            matchesCategory(isPlatform ? g.console : g.genero, nome)
          );
          const col = isPlatform ? '#22d3ee' : '#a78bfa';
          return (
            <div key={nome} className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
              <div
                onClick={() => onToggle(nome)}
                className="flex min-h-[44px] cursor-pointer items-center justify-between p-3 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex items-center min-w-0 flex-1 gap-2.5 sm:gap-3">
                  <span className="text-lg sm:text-xl flex-shrink-0">{isPlatform ? '🎮' : '🎲'}</span>
                  <div className="min-w-0">
                    <div className="truncate font-heading text-xs font-bold text-white sm:text-sm">{nome}</div>
                    <div className="truncate font-mono text-xs font-bold uppercase text-slate-500">{pct}{pctLabel}</div>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 sm:gap-4">
                  <div className="text-right">
                    <div className="font-mono text-xs font-bold tabular-nums text-white">{fmtH(stats.hours)}</div>
                    <div className="text-xs uppercase text-slate-500">Horas</div>
                  </div>
                  <div className="border-l border-white/10 pl-2 text-right sm:pl-3">
                    <div className="font-mono text-base font-bold tabular-nums sm:text-lg" style={{ color: col }}>
                      {stats.count}
                    </div>
                    <div className="text-xs uppercase text-slate-500">Zerados</div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </div>
              </div>
              <div className="h-1 w-full bg-white/5">
                <div className="h-full" style={{ width: `${pct}%`, backgroundColor: col }}></div>
              </div>
              {isOpen && (
                <div className="border-t border-white/5 bg-black/60 p-3">
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {catGames.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => onGameClick(g.id)}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-[#0d1117] hover:border-[#22d3ee] hover:shadow-lg hover:shadow-[#22d3ee]/20 transition-all cursor-pointer"
                        title={`${g.title} (★ ${g.nota !== undefined ? g.nota.toFixed(1) : '—'})`}
                      >
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                          <img
                            src={g.capa}
                            alt={g.title}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          {g.nota !== undefined && !isNaN(g.nota) && (
                            <div className="absolute right-1 top-1 rounded border border-white/10 bg-black/85 px-1 py-0.2 font-mono text-xs font-bold tabular-nums text-[#ffd700]">
                              ★{g.nota.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="p-1.5">
                          <div className="truncate font-heading text-xs font-bold text-white transition-colors group-hover:text-[#22d3ee]">
                            {g.title}
                          </div>
                          <div className="mt-0.5 flex items-center justify-between gap-1 font-mono text-xs text-slate-400">
                            <span>{g.tempo ? `${g.tempo}` : '—'}</span>
                            <span className="truncate">{isPlatform ? g.genero : g.console}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
