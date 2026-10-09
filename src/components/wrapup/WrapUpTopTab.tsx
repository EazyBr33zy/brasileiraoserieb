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

export const WrapUpTopTab: React.FC<WrapUpTopTabProps> = ({
  ANO,
  top10Notas,
  gotAwards,
  onGameClick,
}) => {
  return (
    <div className="space-y-6">
      {/* Top 4 Podium */}
      <div>
        <div className="flex items-center gap-2 font-heading text-base font-black uppercase text-white mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffd700]"></span>
          Melhores Avaliados
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: '🥇 GOTY Crítico', g: top10Notas[0], cor: '#ffd700' },
            { label: '🥈 Vice-Líder', g: top10Notas[1], cor: '#c0c0c0' },
            { label: '🥉 Terceiro Lugar', g: top10Notas[2], cor: '#cd7f32' },
            { label: '🏅 Quarto Lugar', g: top10Notas[3], cor: '#00f5ff' },
          ].map((pos, idx) => (
            <div
              key={idx}
              onClick={() => pos.g && onGameClick(pos.g.id)}
              className="rounded-xl border border-white/10 bg-[#0e131d] p-3 flex gap-3 cursor-pointer hover:border-[#ffd700] transition-all"
            >
              <div className="h-20 w-14 rounded-md overflow-hidden bg-black flex-shrink-0">
                {pos.g?.capa ? (
                  <img
                    src={pos.g.capa}
                    alt={pos.g.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs">🎮</div>
                )}
              </div>
              <div className="flex flex-col justify-between min-w-0">
                <div>
                  <div className="text-xs font-black uppercase" style={{ color: pos.cor }}>
                    {pos.label}
                  </div>
                  <div className="font-heading text-sm font-bold text-white truncate">
                    {pos.g?.title || '—'}
                  </div>
                </div>
                <div className="font-heading text-2xl font-black" style={{ color: pos.cor }}>
                  {pos.g?.nota !== undefined ? `★ ${pos.g.nota.toFixed(1)}` : '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 👑 GAMES OF THE YEAR — GOTY HERO CARD */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 font-heading text-xl font-black uppercase text-[#ffd700]">
          <span>👑</span>
          Games of the Year — {ANO}
        </div>

        {gotAwards.goty && (
          <div
            onClick={() => onGameClick(gotAwards.goty!.id)}
            className="relative overflow-hidden rounded-2xl border-2 border-[#ffd700]/50 bg-gradient-to-r from-[#ffd700]/10 via-[#ff6400]/10 to-[#0e131d] p-6 cursor-pointer hover:border-[#ffd700] transition-all shadow-xl shadow-[#ffd700]/10 flex flex-col sm:flex-row gap-5 items-center justify-between"
          >
            <div className="flex items-center gap-5">
              <div className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#ffd700]/40 bg-black">
                <img
                  src={gotAwards.goty.capa}
                  alt={gotAwards.goty.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#ffd700]">
                  <span>👑</span>
                  Game of the Year
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-wide mt-1">
                  {gotAwards.goty.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2 font-mono">
                  <span>{gotAwards.goty.console}</span>
                  <span>•</span>
                  <span>{gotAwards.goty.genero}</span>
                  <span>•</span>
                  <span>⏱ {gotAwards.goty.tempo}</span>
                </div>
              </div>
            </div>

            <div className="font-heading text-5xl font-black text-[#ffd700] text-glow-gold flex flex-col items-center">
              <span>{gotAwards.goty.nota !== undefined ? gotAwards.goty.nota.toFixed(1) : '10'}★</span>
              <span className="text-xs tracking-widest font-black uppercase text-[#ffd700]/80">GOTY</span>
            </div>
          </div>
        )}

        {/* Other GOT Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: 'Melhor Gameplay', g: gotAwards.gameplay, ico: '🕹️', cor: '#00f5ff' },
            { title: 'Melhor Narrativa', g: gotAwards.narrativa, ico: '📖', cor: '#bc13fe' },
            { title: 'Direção de Arte', g: gotAwards.arte, ico: '🎨', cor: '#ff6400' },
            { title: 'Indie do Ano', g: gotAwards.indie, ico: '🌱', cor: '#00ff9f' },
            { title: 'Surpresa do Ano', g: gotAwards.surpresa, ico: '💥', cor: '#ff0055' },
            { title: 'Retro do Ano', g: gotAwards.retro, ico: '🕹️', cor: '#a78bfa' },
            { title: 'Mais Difícil', g: gotAwards.dificil, ico: '💀', cor: '#f97316' },
            { title: 'Pior do Ano', g: gotAwards.pior, ico: '💩', cor: '#64748b' },
          ].map((award, i) => (
            <div
              key={i}
              onClick={() => award.g && onGameClick(award.g.id)}
              className="rounded-xl border border-white/10 bg-[#0e131d] p-3 flex items-center gap-3 cursor-pointer hover:border-white/30 transition-all relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: award.cor }}></div>
              <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded bg-black">
                {award.g?.capa ? (
                  <img
                    src={award.g.capa}
                    alt={award.g.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs">🎮</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: award.cor }}>
                  {award.ico} {award.title}
                </span>
                <div className="font-heading text-xs font-bold text-white truncate mt-0.5">
                  {award.g?.title || 'Não definido'}
                </div>
                {award.g?.nota !== undefined && (
                  <div
                    className="text-xs font-mono font-bold mt-0.5"
                    style={{ color: getScoreColor(award.g.nota) }}
                  >
                    ★ {award.g.nota.toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
