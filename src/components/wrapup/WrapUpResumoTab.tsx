import React from 'react';
import { Trophy, ChevronRight } from 'lucide-react';
import { fmtH } from '../../utils/markdownParser';
import { getScoreLabel } from '../../utils/platformStyles';
import { GameItem } from '../../types/game';

interface WrapUpResumoTabProps {
  ANO: number;
  total: number;
  horas: number;
  mediaTempo: number;
  media: number;
  notasArr: number[];
  plataformaDoAno: [string, { count: number; hours: number }] | null;
  generoDoAno: [string, { count: number; hours: number }] | null;
  maisLongo: GameItem | null;
  melhor: GameItem | null;
  slogan: string;
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
  onOpenTopTab: () => void;
}

export const WrapUpResumoTab: React.FC<WrapUpResumoTabProps> = ({
  ANO,
  total,
  horas,
  mediaTempo,
  media,
  notasArr,
  plataformaDoAno,
  generoDoAno,
  maisLongo,
  melhor,
  slogan,
  gotAwards,
  onGameClick,
  onOpenTopTab,
}) => {
  return (
    <div className="space-y-6">
      {/* KPI 6 Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-[#0e131d] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#00f5ff]"></div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Zerados</div>
          <div className="font-heading text-3xl font-black text-[#00f5ff] mt-1">{total}</div>
          <div className="text-xs text-slate-400 mt-1">≈ {(total / 12).toFixed(1)} por mês</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0e131d] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#00ff9f]"></div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Horas Jogadas</div>
          <div className="font-heading text-3xl font-black text-[#00ff9f] mt-1">{fmtH(horas)}</div>
          <div className="text-xs text-slate-400 mt-1">≈ {fmtH(mediaTempo)} por jogo</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0e131d] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ffd700]"></div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Nota Média</div>
          <div className="font-heading text-3xl font-black text-[#ffd700] mt-1">
            {media ? media.toFixed(2) : '—'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {notasArr.length} avaliados · {getScoreLabel(media)}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0e131d] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-400"></div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Plataforma do Ano</div>
          <div className="font-heading text-xl font-black text-orange-400 mt-1 truncate">
            {plataformaDoAno ? plataformaDoAno[0] : '—'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {plataformaDoAno ? `${plataformaDoAno[1].count} zerados` : '—'}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0e131d] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ff0a7b]"></div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Gênero Mais Jogado</div>
          <div className="font-heading text-xl font-black text-[#ff0a7b] mt-1 truncate">
            {generoDoAno ? generoDoAno[0] : '—'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {generoDoAno ? `${generoDoAno[1].count} jogos` : '—'}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0e131d] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#bc13fe]"></div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Jogo Mais Longo</div>
          <div className="font-heading text-xl font-black text-[#bc13fe] mt-1 truncate">
            {maisLongo ? fmtH(maisLongo.tempoMinutos ? maisLongo.tempoMinutos / 60 : 0) : '—'}
          </div>
          <div className="text-xs text-slate-400 mt-1 truncate">{maisLongo?.title || 'Sem dados'}</div>
        </div>
      </div>

      {/* 👑 PRÊMIOS DO ANO — {ANO} (GOTY & Destaques de Premiação) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-heading text-lg font-black uppercase text-[#ffd700]">
            <span>👑</span>
            <span>PRÊMIOS DO ANO — {ANO}</span>
          </div>
          <button
            onClick={onOpenTopTab}
            className="text-xs font-bold text-[#ffd700] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Pódio Completo</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* GOTY Supreme Hero Card */}
        {gotAwards.goty && (
          <div
            onClick={() => onGameClick(gotAwards.goty!.id)}
            className="relative overflow-hidden rounded-2xl border-2 border-[#ffd700]/50 bg-gradient-to-r from-[#ffd700]/15 via-[#ff7a00]/10 to-[#0e131d] p-4 sm:p-5 cursor-pointer hover:border-[#ffd700] transition-all shadow-xl shadow-[#ffd700]/10 flex flex-col sm:flex-row gap-4 items-center justify-between group"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="h-24 w-16 sm:h-28 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#ffd700]/50 bg-black shadow-lg">
                <img
                  src={gotAwards.goty.capa}
                  alt={gotAwards.goty.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#ffd700]">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>GAME OF THE YEAR (GOTY {ANO})</span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-white uppercase tracking-wide mt-1 group-hover:text-[#ffd700] transition-colors">
                  {gotAwards.goty.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300 mt-1.5 font-mono">
                  <span className="rounded bg-black/60 px-2 py-0.5 border border-white/10">{gotAwards.goty.console}</span>
                  <span>•</span>
                  <span>{gotAwards.goty.genero}</span>
                  {gotAwards.goty.tempo && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">⏱ {gotAwards.goty.tempo}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="font-heading text-3xl sm:text-4xl font-black text-[#ffd700] flex sm:flex-col items-center justify-end w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-5">
              <span>{gotAwards.goty.nota !== undefined ? `★ ${gotAwards.goty.nota.toFixed(1)}` : '10★'}</span>
              <span className="text-xs tracking-widest font-black uppercase text-[#ffd700]/80 sm:mt-0.5">VENCEDOR SUPREMO</span>
            </div>
          </div>
        )}

        {/* Grid of Specialized GOT Awards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { cat: '🕹️ Melhor Gameplay', g: gotAwards.gameplay, cor: '#00f5ff' },
            { cat: '📖 Melhor Narrativa', g: gotAwards.narrativa, cor: '#bc13fe' },
            { cat: '🎨 Melhor Arte / Gráficos', g: gotAwards.arte, cor: '#ff007f' },
            { cat: '💎 Melhor Indie', g: gotAwards.indie, cor: '#00ff9f' },
            { cat: '⚡ Maior Surpresa', g: gotAwards.surpresa, cor: '#ffd700' },
            { cat: '📼 Melhor Retrô', g: gotAwards.retro, cor: '#ff7a00' },
            { cat: '💀 Maior Desafio', g: gotAwards.dificil, cor: '#e60012' },
            { cat: '💩 Decepção / Menor Nota', g: gotAwards.pior, cor: '#ff3d6a' },
          ]
            .filter((item) => item.g)
            .slice(0, 8)
            .map((item, i) => (
              <div
                key={i}
                onClick={() => item.g && onGameClick(item.g.id)}
                className="flex gap-3 rounded-xl border border-white/10 bg-[#0e131d] p-3 cursor-pointer hover:border-white/30 transition-all group"
              >
                <div className="h-16 w-12 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10 shadow-sm">
                  {item.g?.capa ? (
                    <img
                      src={item.g.capa}
                      alt={item.g.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs">🎮</div>
                  )}
                </div>
                <div className="flex flex-col justify-between min-w-0 flex-1">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider truncate" style={{ color: item.cor }}>
                      {item.cat}
                    </div>
                    <h4 className="font-heading text-xs sm:text-sm font-bold text-white truncate mt-0.5 group-hover:text-[#ffd700] transition-colors">
                      {item.g?.title || 'Sem título'}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-white/5">
                    <span className="text-slate-400 font-mono truncate max-w-[70px]">{item.g?.console}</span>
                    <span className="font-heading font-black text-xs" style={{ color: item.cor }}>
                      {item.g?.nota !== undefined ? `★ ${item.g.nota.toFixed(1)}` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Slogan Box */}
      <div className="rounded-xl border border-[#00f5ff]/20 bg-gradient-to-r from-[#00f5ff]/5 via-purple-500/5 to-transparent p-4">
        <div className="font-heading text-sm font-black uppercase text-[#00f5ff]">
          ✦ {ANO} em uma frase
        </div>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {slogan}{' '}
          {plataformaDoAno && (
            <>
              A plataforma dominante foi <strong className="text-white">{plataformaDoAno[0]}</strong> com {plataformaDoAno[1].count} jogos zerados.{' '}
            </>
          )}
          {melhor && (
            <>
              Destaque crítico supremo: <strong className="text-[#ffd700]">{melhor.title}</strong>{' '}
              {melhor.nota !== undefined ? `(Nota ${melhor.nota.toFixed(1)})` : ''}.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
