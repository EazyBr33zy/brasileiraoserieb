import React from 'react';
import { getScoreColor } from '../../utils/platformStyles';
import { GameItem } from '../../types/game';

interface WrapUpTopTabProps {
  ANO: number;
  top10Notas: GameItem[];
  gotAwards: {
    goty: GameItem | null;
    gameplay: GameItem | null;
    narrativa: GameItem | null;
    arte: GameItem | null;
    indie: GameItem | null;
    surpresa: GameItem | null;
    retro: GameItem | null;
    dificil: GameItem | null;
    pior: GameItem | null;
  };
  onGameClick: (id: string) => void;
}

const POS_STYLE = [
  { medal: '🥇', label: 'GOTY Crítico', cor: '#ffd700' },
  { medal: '🥈', label: 'Vice-Líder', cor: '#c0c0c0' },
  { medal: '🥉', label: 'Terceiro Lugar', cor: '#cd7f32' },
  { medal: '🏅', label: 'Quarto Lugar', cor: '#00f5ff' },
];

export const WrapUpTopTab: React.FC<WrapUpTopTabProps> = ({
  ANO,
  top10Notas,
  gotAwards,
  onGameClick,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Pódio: 1º em destaque + demais posições ── */}
      <section className="rounded-2xl border border-white/10 bg-[#0b0c16] p-3.5 sm:p-5">
        <div className="mb-3 flex items-center gap-2 font-heading text-base sm:text-lg font-black uppercase text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffd700]"></span>
          Melhores Avaliados — {ANO}
        </div>

        {top10Notas.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">Nenhum jogo avaliado neste ciclo.</p>
        ) : (
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
            {/* 1º lugar — card grande */}
            {top10Notas[0] && (
              <div
                onClick={() => onGameClick(top10Notas[0].id)}
                className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border-2 border-[#ffd700]/50 bg-gradient-to-br from-[#ffd700]/15 via-[#0e131d] to-[#0e131d] p-4 shadow-xl shadow-[#ffd700]/10 transition-all hover:border-[#ffd700]"
              >
                <div className="absolute right-3 top-2 font-heading text-5xl font-black text-[#ffd700]/15 select-none">
                  01
                </div>
                <div className="h-32 w-[96px] flex-shrink-0 overflow-hidden rounded-xl border border-[#ffd700]/40 bg-black shadow-lg">
                  {top10Notas[0].capa ? (
                    <img
                      src={top10Notas[0].capa}
                      alt={top10Notas[0].title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl">🎮</div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-widest text-[#ffd700]">
                    🥇 {POS_STYLE[0].label}
                  </div>
                  <h3 className="mt-1 truncate font-heading text-xl font-black uppercase text-white transition-colors group-hover:text-[#ffd700] sm:text-2xl" title={top10Notas[0].title}>
                    {top10Notas[0].title}
                  </h3>
                  <div className="mt-1 truncate font-mono text-xs text-slate-400">{top10Notas[0].console}</div>
                  <div
                    className="mt-2 font-mono text-3xl font-bold tabular-nums text-glow-gold"
                    style={{ color: POS_STYLE[0].cor }}
                  >
                    ★ {top10Notas[0].nota !== undefined ? top10Notas[0].nota.toFixed(1) : '—'}
                  </div>
                </div>
              </div>
            )}

            {/* 2º–4º lugares */}
            <div className="grid content-start gap-2.5">
              {[1, 2, 3].map((idx) => {
                const g = top10Notas[idx];
                const pos = POS_STYLE[idx];
                if (!g) {
                  return (
                    <div
                      key={idx}
                      className="flex min-h-[72px] items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 text-xs text-slate-500"
                    >
                      {pos.medal} {pos.label} — sem dados suficientes
                    </div>
                  );
                }
                return (
                  <div
                    key={idx}
                    onClick={() => onGameClick(g.id)}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0e131d] p-3 transition-all hover:border-white/30"
                  >
                    <div
                      className="w-8 flex-shrink-0 text-center font-mono text-lg font-bold tabular-nums"
                      style={{ color: pos.cor }}
                    >
                      0{idx + 1}
                    </div>
                    <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md border border-white/10 bg-black">
                      {g.capa ? (
                        <img
                          src={g.capa}
                          alt={g.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs">🎮</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[10px] sm:text-xs font-black uppercase tracking-wider" style={{ color: pos.cor }}>
                        {pos.medal} {pos.label}
                      </div>
                      <div className="mt-0.5 truncate font-heading text-sm font-bold text-white transition-colors group-hover:text-[#ffd700]" title={g.title}>
                        {g.title}
                      </div>
                      <div className="truncate font-mono text-[10px] text-slate-400">{g.console}</div>
                    </div>
                    <div
                      className="flex-shrink-0 font-mono text-xl font-bold tabular-nums"
                      style={{ color: pos.cor }}
                    >
                      ★ {g.nota !== undefined ? g.nota.toFixed(1) : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ── Games of the Year: categorias ── */}
      <section className="rounded-2xl border border-white/10 bg-[#0b0c16] p-3.5 sm:p-5">
        <div className="mb-3 flex items-center gap-2 font-heading text-base sm:text-lg font-black uppercase text-[#ffd700]">
          <span>👑</span>
          <span className="truncate">Games of the Year — {ANO}</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Melhor Gameplay', g: gotAwards.gameplay, ico: '🕹️', cor: '#00f5ff' },
            { title: 'Melhor Narrativa', g: gotAwards.narrativa, ico: '📖', cor: '#bc13fe' },
            { title: 'Direção de Arte', g: gotAwards.arte, ico: '🎨', cor: '#ff6400' },
            { title: 'Indie do Ano', g: gotAwards.indie, ico: '🌱', cor: '#00ff9f' },
            { title: 'Surpresa do Ano', g: gotAwards.surpresa, ico: '💥', cor: '#ff0055' },
            { title: 'Retro do Ano', g: gotAwards.retro, ico: '📼', cor: '#a78bfa' },
            { title: 'Mais Difícil', g: gotAwards.dificil, ico: '💀', cor: '#f97316' },
            { title: 'Pior do Ano', g: gotAwards.pior, ico: '💩', cor: '#64748b' },
          ].map((award, i) => (
            <div
              key={i}
              onClick={() => award.g && onGameClick(award.g!.id)}
              className={`relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-[#0e131d] p-3 transition-all ${
                award.g ? 'cursor-pointer hover:border-white/30' : 'opacity-60'
              }`}
            >
              <div className="absolute bottom-0 left-0 top-0 w-1" style={{ backgroundColor: award.cor }}></div>
              <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-md bg-black">
                {award.g?.capa ? (
                  <img
                    src={award.g.capa}
                    alt={award.g.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs">🎮</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: award.cor }}>
                  {award.ico} {award.title}
                </span>
                <div className="mt-0.5 truncate font-heading text-sm font-bold text-white" title={award.g?.title}>
                  {award.g?.title || 'Não definido'}
                </div>
                {award.g?.nota !== undefined && (
                  <div
                    className="mt-0.5 font-mono text-xs font-bold tabular-nums"
                    style={{ color: getScoreColor(award.g.nota) }}
                  >
                    ★ {award.g.nota.toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
