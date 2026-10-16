import React, { useMemo } from 'react';
import { fmtH } from '../../utils/markdownParser';
import { getScoreLabel } from '../../utils/platformStyles';
import { GameItem } from '../../types/game';
import { groupByCategory } from '../../utils/categoryNormalization';
import { CategoryRanking } from './CategoryRanking';

const CYAN = '#22d3ee';
const VIOLET = '#a78bfa';
const GOLD = '#fbbf24';
const RED_SOFT = '#f87171';
const TRACK = '#1f2937';

const Chip: React.FC<{ label: string; value: React.ReactNode; accent?: string }> = ({
  label,
  value,
  accent,
}) => (
  <div className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-black/30 px-3 py-2">
    <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
    <strong className="font-mono text-sm font-bold tabular-nums" style={{ color: accent || '#f0f6fc' }}>
      {value}
    </strong>
  </div>
);

interface WrapUpAnaliseTabProps {
  ANO: number;
  total: number;
  media: number;
  notasArr: number[];
  notas10: number;
  notasHist: Record<string, number>;
  maxNH: number;
  notaHistCores: Record<string, string>;
  meses: Array<{
    i: number;
    nome: string;
    nomeCompleto: string;
    qtd: number;
    h: number;
    games: GameItem[];
  }>;
  maxMes: number;
  mesPico: {
    nome: string;
    nomeCompleto: string;
    qtd: number;
    h: number;
  };
  topCon: Array<[string, { count: number; hours: number }]>;
  topGen: Array<[string, { count: number; hours: number }]>;
  openPlatforms: Record<string, boolean>;
  setOpenPlatforms: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  openGenres: Record<string, boolean>;
  setOpenGenres: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  jogosAno: GameItem[];
  onGameClick: (id: string) => void;
}

export const WrapUpAnaliseTab: React.FC<WrapUpAnaliseTabProps> = ({
  ANO,
  total,
  media,
  notasArr,
  notas10,
  notasHist,
  maxNH,
  notaHistCores,
  meses,
  maxMes,
  mesPico,
  topCon,
  topGen,
  openPlatforms,
  setOpenPlatforms,
  openGenres,
  setOpenGenres,
  jogosAno,
  onGameClick,
}) => {
  // Categorias normalizadas apenas para exibição (dados salvos intactos)
  const conGrouped = useMemo(() => groupByCategory(topCon), [topCon]);
  const genGrouped = useMemo(() => groupByCategory(topGen), [topGen]);

  // Faixa mais frequente do histograma
  const modaFaixa = useMemo(() => {
    let bestFaixa = '';
    let bestQtd = 0;
    Object.entries(notasHist).forEach(([f, q]) => {
      if (q > bestQtd) {
        bestQtd = q;
        bestFaixa = f;
      }
    });
    return bestFaixa;
  }, [notasHist]);

  // Meses com atividade anterior ao mês pico (para a linha da média terminar no pico)
  const activeBeforePeak = useMemo(() => {
    const peakIdx = meses.findIndex((m) => m.qtd === mesPico.qtd && m.qtd > 0);
    return Math.max(1, meses.slice(0, Math.max(peakIdx, 1)).filter((m) => m.qtd > 0).length);
  }, [meses, mesPico]);

  const ritmoMedio = (total / (meses.filter((m) => m.qtd > 0).length || 1)).toFixed(1);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Linha 1 (desktop): Distribuição de notas | Atividade mensal — em duas colunas iguais ── */}
      <div className="wu-analise-line1 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 lg:items-stretch">
      {/* Seção 1: Distribuição de Notas */}
      <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-3.5 sm:p-5 lg:border-0 lg:bg-transparent lg:p-0">
        <div className="mb-4 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wide text-white lg:text-[14px]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GOLD }}></span>
          Distribuição de notas
        </div>

        <div className="wu-chart-row grid grid-cols-1 gap-4">
          {/* Histogram bars */}
          <div className="rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4">
            <div className="relative grid grid-cols-7 items-end gap-1.5 sm:gap-2 border-b border-white/10 pb-2" style={{ minHeight: '9rem' }}>
              {[0, 1, 2].map((gi) => (
                <span
                  key={gi}
                  className="pointer-events-none absolute inset-x-0 hidden border-t border-dashed border-white/[0.07] lg:block"
                  style={{ bottom: `${Math.round(((gi + 1) / 4) * 100)}%` }}
                  aria-hidden="true"
                />
              ))}
              {Object.entries(notasHist).map(([faixa, qtd]) => {
                const pct = Math.max(qtd ? 15 : 4, Math.round((qtd / maxNH) * 100));
                const isTop = faixa === modaFaixa && qtd > 0;
                const isDez = faixa === '10';
                const isBaixa = faixa === '<5';
                const corBarra = isDez ? GOLD : isBaixa ? RED_SOFT : isTop ? CYAN : 'rgba(34,211,238,0.35)';
                const corLabel = isDez ? GOLD : isBaixa ? RED_SOFT : isTop ? CYAN : '#64748b';
                return (
                  <div key={faixa} className="flex h-full flex-col items-center justify-end gap-1.5">
                    <span className="font-mono text-xs font-bold tabular-nums" style={{ color: corLabel }}>
                      {qtd || ''}
                    </span>
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{ height: `${pct}%`, backgroundColor: corBarra }}
                    ></div>
                    <span className="text-xs font-bold text-slate-400">{faixa}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-center text-xs uppercase tracking-widest text-slate-500">
              Jogos zerados por faixa de nota · {ANO}
            </div>
          </div>

          {/* Faixa de chips (média geral + máx / 10★+ / mín) — visível só em desktop */}
          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            <div className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-black/30 px-3 py-2">
              <span className="text-xs uppercase tracking-wide text-slate-400">Média geral</span>
              <strong className="font-mono text-xl font-bold tabular-nums leading-none" style={{ color: GOLD }}>
                {media ? media.toFixed(2) : '—'}
              </strong>
              <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: GOLD }}>
                {getScoreLabel(media)}
              </span>
            </div>
            <Chip label="Máxima" value={notasArr.length ? Math.max(...notasArr).toFixed(1) : '—'} />
            <Chip label="Notas 10★+" value={notas10} accent="#34d399" />
            <Chip label="Mínima" value={notasArr.length ? Math.min(...notasArr).toFixed(1) : '—'} accent={RED_SOFT} />
          </div>

          {/* Painel lateral original (mobile/tablet apenas) */}
          <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/40 p-4 text-xs lg:hidden">
            <div className="text-center pb-3 border-b border-white/10">
              <div className="text-xs uppercase font-bold tracking-widest text-slate-500">Média Geral</div>
              <div className="mt-1 font-mono text-4xl font-bold tabular-nums text-[#ffd700] text-glow-gold">
                {media ? media.toFixed(2) : '—'}
              </div>
              <div className="mt-2 inline-block rounded-full bg-[#ffd700]/15 px-3 py-1 text-xs font-bold text-[#ffd700]">
                {getScoreLabel(media)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
                <span className="text-slate-400">🏆 Máxima</span>
                <strong className="text-right font-mono tabular-nums text-white">
                  {notasArr.length ? Math.max(...notasArr).toFixed(1) : '—'}
                </strong>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
                <span className="text-slate-400">⭐ 10★+</span>
                <strong className="text-right font-mono tabular-nums text-emerald-400">{notas10}</strong>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
                <span className="text-slate-400">📉 Mínima</span>
                <strong className="text-right font-mono tabular-nums text-red-400">
                  {notasArr.length ? Math.min(...notasArr).toFixed(1) : '—'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 2: Atividade mensal */}
      <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-3.5 sm:p-5 lg:border-0 lg:bg-transparent lg:p-0">
        <div className="mb-4 flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wide text-white lg:text-[14px]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CYAN }}></span>
          Atividade mensal
        </div>

        <div className="wu-chart-row grid grid-cols-1 gap-4">
          <div className="rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4">
            <div className="grid grid-cols-12 items-end gap-1 sm:gap-1.5 border-b border-white/10 pb-2" style={{ minHeight: '9rem' }}>
              {meses.map((m) => {
                const pct = Math.max(m.qtd ? 15 : 4, Math.round((m.qtd / maxMes) * 100));
                const isPico = m.qtd === mesPico.qtd && m.qtd > 0;
                return (
                  <div key={m.nome} className="flex h-full flex-col items-center justify-end gap-1">
                    <span
                      className="font-mono text-xs font-bold tabular-nums"
                      style={{ color: isPico ? '#ffd700' : '#22d3ee' }}
                    >
                      {m.qtd || '·'}
                    </span>
                    <div
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${pct}%`,
                        backgroundColor: isPico
                          ? '#ffd700'
                          : m.qtd > 0
                          ? '#22d3ee'
                          : 'rgba(255,255,255,0.05)',
                        boxShadow: isPico ? '0 0 10px rgba(255,215,0,0.5)' : undefined,
                      }}
                    ></div>
                    <span className="text-[10px] min-[390px]:text-xs font-bold uppercase tracking-tight text-slate-400">{m.nome}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-center text-xs uppercase tracking-widest text-slate-500">
              Zeradas por mês · {ANO}
            </div>
          </div>

          {/* Faixa de chips (Mês pico / Meses ativos / Ritmo médio) — desktop apenas */}
          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            <Chip label="Mês pico" value={`${mesPico.nome} (${mesPico.qtd})`} accent={GOLD} />
            <Chip label="Meses ativos" value={`${meses.filter((m) => m.qtd > 0).length} / 12`} accent={CYAN} />
            <Chip label="Ritmo médio" value={`${ritmoMedio}/mês`} accent="#34d399" />
          </div>

          <div className="grid grid-cols-3 gap-2 content-start rounded-xl border border-white/10 bg-black/40 p-4 text-xs lg:hidden">
            <div className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
              <span className="text-slate-400">📅 Mês Pico</span>
              <strong className="text-right font-mono tabular-nums text-[#ffd700]">
                {mesPico.nome} ({mesPico.qtd})
              </strong>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
              <span className="text-slate-400">🔢 Meses Ativos</span>
              <strong className="text-right font-mono tabular-nums text-[#22d3ee]">
                {meses.filter((m) => m.qtd > 0).length} / 12
              </strong>
            </div>
            <div className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
              <span className="text-slate-400">⚡ Ritmo Médio</span>
              <strong className="text-right font-mono tabular-nums text-emerald-400">
                {ritmoMedio}/mês
              </strong>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* ── Linha 2 (desktop): Plataformas | Gêneros — rankings lado a lado ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
      {/* Seção 3: Plataformas */}
      <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-3.5 sm:p-5 lg:border-0 lg:bg-transparent lg:p-0">
        <div className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wide text-white lg:text-[14px]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CYAN }}></span>
          Plataformas zeradas em {ANO}
        </div>

        <CategoryRanking
          items={conGrouped}
          total={total}
          games={jogosAno}
          pctLabel="% dos jogos"
          isPlatform
          openMap={openPlatforms}
          onToggle={(nome) => setOpenPlatforms((prev) => ({ ...prev, [nome]: !(prev[nome] ?? false) }))}
          onGameClick={onGameClick}
        />
      </div>

      {/* Seção 4: Gêneros */}
      <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-3.5 sm:p-5 lg:border-0 lg:bg-transparent lg:p-0">
        <div className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wide text-white lg:text-[14px]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: VIOLET }}></span>
          Gêneros zerados em {ANO}
        </div>

        <CategoryRanking
          items={genGrouped}
          total={total}
          games={jogosAno}
          pctLabel="% dos jogos"
          isPlatform={false}
          openMap={openGenres}
          onToggle={(nome) => setOpenGenres((prev) => ({ ...prev, [nome]: !(prev[nome] ?? false) }))}
          onGameClick={onGameClick}
        />
      </div>
      </div>
    </div>
  );
};
