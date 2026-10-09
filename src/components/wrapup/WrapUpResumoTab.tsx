import React from 'react';
import { ChevronRight, Star, Clock, Trophy } from 'lucide-react';
import { fmtH, parseTime } from '../../utils/markdownParser';
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
  maisCurto: GameItem | null;
  piorNota: GameItem | null;
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

const gameHours = (g: GameItem): number =>
  g.tempoMinutos ? g.tempoMinutos / 60 : parseTime(g.tempo);

const KPI_CARDS = (
  ANO: number,
  total: number,
  horas: number,
  mediaTempo: number,
  media: number,
  notasArr: number[],
  plataformaDoAno: [string, { count: number; hours: number }] | null,
  generoDoAno: [string, { count: number; hours: number }] | null,
  maisLongo: GameItem | null,
): Array<{ label: string; value: string; sub: string; cor: string }> => [
  {
    label: `Zerados em ${ANO}`,
    value: String(total),
    sub: `≈ ${(total / 12).toFixed(1)} por mês`,
    cor: '#00f5ff',
  },
  {
    label: 'Horas Jogadas',
    value: fmtH(horas),
    sub: `≈ ${fmtH(mediaTempo)} por jogo`,
    cor: '#00ff9f',
  },
  {
    label: 'Nota Média',
    value: media ? media.toFixed(2) : '—',
    sub: `${notasArr.length} avaliados · ${getScoreLabel(media)}`,
    cor: '#ffd700',
  },
  {
    label: 'Plataforma do Ano',
    value: plataformaDoAno ? plataformaDoAno[0] : '—',
    sub: plataformaDoAno ? `${plataformaDoAno[1].count} zerados` : 'Sem dados',
    cor: '#ff7a00',
  },
  {
    label: 'Gênero Mais Jogado',
    value: generoDoAno ? generoDoAno[0] : '—',
    sub: generoDoAno ? `${generoDoAno[1].count} jogos` : 'Sem dados',
    cor: '#ff0a7b',
  },
  {
    label: 'Jogo Mais Longo',
    value: maisLongo ? fmtH(maisLongo.tempoMinutos ? maisLongo.tempoMinutos / 60 : 0) : '—',
    sub: maisLongo?.title || 'Sem dados',
    cor: '#bc13fe',
  },
];

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
  maisCurto,
  piorNota,
  melhor,
  slogan,
  gotAwards,
  onGameClick,
  onOpenTopTab,
}) => {
  const kpis = KPI_CARDS(ANO, total, horas, mediaTempo, media, notasArr, plataformaDoAno, generoDoAno, maisLongo);

  // ── DESTAQUE DO ANO: 4 jogos — 2 em cada coluna (horizontal) ──
  const destaques = [
    {
      cat: '⭐ Melhor Avaliado',
      g: melhor,
      valor: melhor?.nota !== undefined ? `★ ${melhor.nota.toFixed(1)}` : '—',
      cor: '#ffd700',
      icone: '🏆',
    },
    {
      cat: '📉 Menor Nota',
      g: piorNota,
      valor: piorNota?.nota !== undefined ? `★ ${piorNota.nota.toFixed(1)}` : '—',
      cor: '#ff3d6a',
      icone: '💤',
    },
    {
      cat: '⏳ Jogo Mais Longo',
      g: maisLongo,
      valor: maisLongo ? fmtH(gameHours(maisLongo)) : '—',
      cor: '#bc13fe',
      icone: '🗺️',
    },
    {
      cat: '⚡ Jogo Mais Rápido',
      g: maisCurto,
      valor: maisCurto ? fmtH(gameHours(maisCurto)) : '—',
      cor: '#00f5ff',
      icone: '🚀',
    },
  ];

  const premiados = [
    { cat: '🕹️ Melhor Gameplay', g: gotAwards.gameplay, cor: '#00f5ff' },
    { cat: '📖 Melhor Narrativa', g: gotAwards.narrativa, cor: '#bc13fe' },
    { cat: '🎨 Melhor Arte / Gráficos', g: gotAwards.arte, cor: '#ff007f' },
    { cat: '💎 Melhor Indie', g: gotAwards.indie, cor: '#00ff9f' },
    { cat: '⚡ Maior Surpresa', g: gotAwards.surpresa, cor: '#ffd700' },
    { cat: '📼 Melhor Retrô', g: gotAwards.retro, cor: '#ff7a00' },
    { cat: '💀 Maior Desafio', g: gotAwards.dificil, cor: '#e60012' },
    { cat: '💩 Decepção / Menor Nota', g: gotAwards.pior, cor: '#ff3d6a' },
  ].filter((item) => item.g);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Faixa de KPIs: 2 colunas no mobile, 3 no tablet, 6 no desktop ── */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0e131d] p-3 transition-colors hover:border-white/25"
          >
            <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: kpi.cor }}></div>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
              {kpi.label}
            </div>
            <div
              className="mt-1 truncate font-mono text-xl sm:text-2xl font-bold tabular-nums leading-tight"
              style={{ color: kpi.cor }}
              title={kpi.value}
            >
              {kpi.value}
            </div>
            <div className="mt-1 truncate text-[10px] sm:text-xs text-slate-400" title={kpi.sub}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── DESTAQUE DO ANO: 4 jogos — 2 em cada coluna (horizontal) ── */}
      <section className="rounded-2xl border border-white/10 bg-[#0b0c16] p-3.5 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-heading text-base sm:text-lg font-black uppercase text-[#00f5ff]">
            <span>✨</span>
            <span className="truncate">Destaque do Ano — {ANO}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
          {destaques.map((d, i) => (
            <div
              key={i}
              onClick={() => d.g && onGameClick(d.g.id)}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-[#0e131d] p-3 transition-all ${
                d.g ? 'cursor-pointer hover:border-white/30' : 'opacity-60'
              }`}
            >
              <div className="absolute bottom-0 left-0 top-0 w-1" style={{ backgroundColor: d.cor }}></div>
              <div className="h-20 w-15 sm:h-24 sm:w-[72px] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                {d.g?.capa ? (
                  <img
                    src={d.g.capa}
                    alt={d.g.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg">{d.icone}</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className="block truncate text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                  style={{ color: d.cor }}
                >
                  {d.cat}
                </span>
                <h4
                  className="mt-0.5 truncate font-heading text-sm sm:text-base font-bold text-white transition-colors group-hover:text-[#ffd700]"
                  title={d.g?.title}
                >
                  {d.g?.title || 'Não definido'}
                </h4>
                <div className="mt-0.5 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-mono text-slate-400">{d.g?.console}</span>
                  <span className="flex-shrink-0 font-mono font-bold tabular-nums" style={{ color: d.cor }}>
                    {d.valor}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Prêmios do Ano: GOTY + prêmios lado a lado no desktop ── */}
      <section className="rounded-2xl border border-white/10 bg-[#0b0c16] p-3.5 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-heading text-base sm:text-lg font-black uppercase text-[#ffd700]">
            <span>👑</span>
            <span className="truncate">Prêmios do Ano — {ANO}</span>
          </div>
          <button
            onClick={onOpenTopTab}
            className="flex min-h-[44px] flex-shrink-0 items-center gap-1 rounded-full border border-[#ffd700]/30 px-3 py-1.5 text-xs font-bold text-[#ffd700] transition-colors hover:border-[#ffd700] hover:bg-[#ffd700]/10 cursor-pointer"
          >
            <span className="hidden sm:inline">Ver Pódio Completo</span>
            <span className="sm:hidden">Pódio</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-4">
          {/* GOTY Supreme Card */}
          {gotAwards.goty && (
            <div
              onClick={() => onGameClick(gotAwards.goty!.id)}
              className="group relative flex cursor-pointer flex-col justify-between gap-4 overflow-hidden rounded-2xl border-2 border-[#eeff00] bg-gradient-to-br from-[#eeff00]/20 via-[#ff7a00]/10 to-[#0e131d] p-4 shadow-[0_0_28px_rgba(238,255,0,0.3)] transition-all hover:shadow-[0_0_44px_rgba(238,255,0,0.45)] sm:p-5"
            >
              <div className="pointer-events-none absolute -right-2 -top-4 select-none font-heading text-6xl font-black text-[#eeff00]/10 sm:text-7xl" aria-hidden="true">
                GOTY
              </div>
              <div className="flex items-start gap-4">
                <div className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#ffd700]/50 bg-black shadow-lg">
                  <img
                    src={gotAwards.goty.capa}
                    alt={gotAwards.goty.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#ffd700]">
                    <Trophy className="h-3.5 w-3.5" />
                    <span className="truncate">Game of the Year · {ANO}</span>
                  </div>
                  <h3 className="mt-1 truncate font-heading text-xl font-black uppercase tracking-wide text-white transition-colors group-hover:text-[#ffd700] sm:text-2xl" title={gotAwards.goty.title}>
                    {gotAwards.goty.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-slate-300">
                    <span className="rounded bg-black/60 px-2 py-0.5 border border-white/10">{gotAwards.goty.console}</span>
                    <span className="text-slate-500">•</span>
                    <span className="truncate">{gotAwards.goty.genero}</span>
                    {gotAwards.goty.tempo && (
                      <>
                        <span className="text-slate-500">•</span>
                        <span className="font-bold text-emerald-400">⏱ {gotAwards.goty.tempo}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ffd700]/80">
                  Vencedor Supremo
                </span>
                <span className="flex items-center gap-1.5 font-mono text-2xl font-bold tabular-nums text-[#ffd700] text-glow-gold sm:text-3xl">
                  <Star className="h-5 w-5 fill-[#ffd700] stroke-[#ffd700]" />
                  {gotAwards.goty.nota !== undefined ? gotAwards.goty.nota.toFixed(1) : '10'}
                </span>
              </div>
            </div>
          )}

          {/* Grade de prêmios especializados */}
          <div className="grid grid-cols-1 content-start gap-2.5 sm:grid-cols-2">
            {premiados.slice(0, 8).map((item, i) => (
              <div
                key={i}
                onClick={() => item.g && onGameClick(item.g.id)}
                className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0e131d] p-2.5 transition-all hover:border-white/30"
              >
                <div className="h-14 w-11 flex-shrink-0 overflow-hidden rounded-md border border-white/10 bg-black">
                  {item.g?.capa ? (
                    <img
                      src={item.g.capa}
                      alt={item.g.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs">🎮</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="truncate text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                    style={{ color: item.cor }}
                  >
                    {item.cat}
                  </div>
                  <h4 className="mt-0.5 truncate font-heading text-sm font-bold text-white transition-colors group-hover:text-[#ffd700]" title={item.g?.title}>
                    {item.g?.title || 'Sem título'}
                  </h4>
                  <div className="mt-0.5 flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-mono text-slate-400">{item.g?.console}</span>
                    <span className="flex-shrink-0 font-mono font-bold tabular-nums" style={{ color: item.cor }}>
                      {item.g?.nota !== undefined ? `★ ${item.g.nota.toFixed(1)}` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slogan do ano ── */}
      <section className="rounded-2xl border border-[#00f5ff]/20 bg-gradient-to-r from-[#00f5ff]/5 via-purple-500/5 to-transparent p-4 sm:p-5">
        <div className="flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-[#00f5ff]">
          <span className="h-0.5 w-4 bg-[#00f5ff]"></span>
          ✦ {ANO} em uma frase
        </div>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
          {slogan}{' '}
          {plataformaDoAno && (
            <>
              A plataforma dominante foi <strong className="text-white">{plataformaDoAno[0]}</strong> com{' '}
              {plataformaDoAno[1].count} jogos zerados.{' '}
            </>
          )}
          {melhor && (
            <>
              Destaque crítico supremo:{' '}
              <strong className="text-[#ffd700]">{melhor.title}</strong>{' '}
              {melhor.nota !== undefined ? `(Nota ${melhor.nota.toFixed(1)})` : ''}.
            </>
          )}
        </p>
      </section>
    </div>
  );
};
