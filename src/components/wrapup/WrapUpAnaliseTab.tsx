import React from 'react';
import { ChevronDown, Gamepad2 } from 'lucide-react';
import { fmtH, formatDateBR } from '../../utils/markdownParser';
import { getPlatformStyle, getScoreLabel } from '../../utils/platformStyles';
import { GameItem } from '../../types/game';

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
  return (
    <div className="space-y-6">
      {/* Seção 1: Distribuição de Notas */}
      <div className="rounded-xl border border-white/10 bg-[#0e131d] p-5">
        <div className="flex items-center gap-2 font-heading text-base font-black uppercase text-white mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffd700]"></span>
          Distribuição de Notas
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Histogram bars */}
          <div className="md:col-span-8 grid grid-cols-7 gap-2 items-end h-36 border-b border-white/10 pb-2">
            {Object.entries(notasHist).map(([faixa, qtd]) => {
              const pct = Math.max(qtd ? 15 : 4, Math.round((qtd / maxNH) * 100));
              const cor = notaHistCores[faixa];
              return (
                <div key={faixa} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="font-mono text-xs font-bold" style={{ color: cor }}>
                    {qtd || ''}
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{ height: `${pct}%`, backgroundColor: cor, boxShadow: `0 0 10px ${cor}33` }}
                  ></div>
                  <span className="text-xs font-bold text-slate-400">{faixa}</span>
                </div>
              );
            })}
          </div>

          {/* Context card */}
          <div className="md:col-span-4 rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 text-xs">
            <div className="text-center pb-2 border-b border-white/10">
              <div className="text-xs uppercase font-bold text-slate-500">Média Geral</div>
              <div className="font-heading text-4xl font-black text-[#ffd700]">
                {media ? media.toFixed(2) : '—'}
              </div>
              <div className="inline-block rounded-full bg-[#ffd700]/15 text-[#ffd700] px-2 py-0.5 text-xs font-bold mt-1">
                {getScoreLabel(media)}
              </div>
            </div>

            <div className="space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>🏆 Nota Máxima:</span>
                <strong className="text-white">
                  {notasArr.length ? Math.max(...notasArr).toFixed(1) : '—'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>⭐ Masterpieces (10★):</span>
                <strong className="text-emerald-400">{notas10}</strong>
              </div>
              <div className="flex justify-between">
                <span>📉 Nota Mínima:</span>
                <strong className="text-red-400">
                  {notasArr.length ? Math.min(...notasArr).toFixed(1) : '—'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 2: Atividade Mensal */}
      <div className="rounded-xl border border-white/10 bg-[#0e131d] p-5">
        <div className="flex items-center gap-2 font-heading text-base font-black uppercase text-white mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00f5ff]"></span>
          Atividade Mensal
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8 grid grid-cols-12 gap-1.5 items-end h-36 border-b border-white/10 pb-2">
            {meses.map((m) => {
              const pct = Math.max(m.qtd ? 15 : 4, Math.round((m.qtd / maxMes) * 100));
              const isPico = m.qtd === mesPico.qtd && m.qtd > 0;
              return (
                <div key={m.nome} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: isPico ? '#ffd700' : '#00f5ff' }}
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
                        ? '#00f5ff'
                        : 'rgba(255,255,255,0.05)',
                      boxShadow: isPico ? '0 0 10px rgba(255,215,0,0.5)' : undefined,
                    }}
                  ></div>
                  <span className="text-xs font-bold uppercase text-slate-400">{m.nome}</span>
                </div>
              );
            })}
          </div>

          <div className="md:col-span-4 rounded-xl border border-white/10 bg-black/40 p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">📅 Mês Pico:</span>
              <strong className="text-[#ffd700]">
                {mesPico.nome} ({mesPico.qtd} jogos)
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">🔢 Meses Ativos:</span>
              <strong className="text-[#00f5ff]">{meses.filter((m) => m.qtd > 0).length} / 12</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">⚡ Ritmo Médio:</span>
              <strong className="text-emerald-400">
                {(total / (meses.filter((m) => m.qtd > 0).length || 1)).toFixed(1)} / mês
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 3: Plataformas com Acordeão (2 colunas, 4 jogos por linha) */}
      <div className="rounded-xl border border-white/10 bg-[#0e131d] p-5 space-y-3">
        <div className="flex items-center gap-2 font-heading text-base font-black uppercase text-white mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
          Plataformas Zeradas em {ANO}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
          {topCon.map(([nome, stats]) => {
            const s = getPlatformStyle(nome);
            const pct = total > 0 ? Math.round((stats.count / total) * 100) : 0;
            const isOpen = openPlatforms[nome] ?? false;

            const platformGames = jogosAno.filter((g) => g.console === nome);

            return (
              <div key={nome} className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
                <div
                  onClick={() => setOpenPlatforms((prev) => ({ ...prev, [nome]: !isOpen }))}
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <span className="text-lg sm:text-xl flex-shrink-0">{s.ico}</span>
                    <div className="min-w-0">
                      <div className="font-heading text-xs sm:text-sm font-bold text-white truncate">
                        {s.name}
                      </div>
                      <div className="text-xs text-slate-500 font-bold uppercase truncate">
                        {pct}% dos jogos
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-mono text-xs sm:text-xs font-bold text-white">
                        {fmtH(stats.hours)}
                      </div>
                      <div className="text-xs text-slate-500 uppercase">Horas</div>
                    </div>
                    <div className="text-right border-l border-white/10 pl-2 sm:pl-3">
                      <div className="font-heading text-sm sm:text-lg font-black" style={{ color: s.col }}>
                        {stats.count}
                      </div>
                      <div className="text-xs text-slate-500 uppercase">Zerados</div>
                    </div>
                    <ChevronDown
                      className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Progress track */}
                <div className="h-1 w-full bg-white/5">
                  <div className="h-full" style={{ width: `${pct}%`, backgroundColor: s.col }}></div>
                </div>

                {/* Expanded game grid (4 jogos por linha) */}
                {isOpen && (
                  <div className="p-3.5 bg-black/60 border-t border-white/5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {platformGames.map((g) => (
                        <div
                          key={g.id}
                          onClick={() => onGameClick(g.id)}
                          className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-[#0e131d] hover:border-[#00f5ff] hover:shadow-lg hover:shadow-[#00f5ff]/20 transition-all cursor-pointer"
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
                              <div className="absolute top-1 right-1 rounded bg-black/85 px-1 py-0.2 text-xs font-heading font-black text-[#ffd700] border border-white/10">
                                ★{g.nota.toFixed(1)}
                              </div>
                            )}
                          </div>
                          <div className="p-1.5">
                            <div className="font-heading text-xs font-bold text-white truncate group-hover:text-[#00f5ff] transition-colors">
                              {g.title}
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400 mt-0.5 font-mono">
                              <span>{g.tempo ? `${g.tempo}` : '—'}</span>
                              {g.data_zerado && <span>{formatDateBR(g.data_zerado).slice(0, 5)}</span>}
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
      </div>

      {/* Seção 4: Gêneros Zerados (2 colunas, 4 jogos por linha) */}
      <div className="rounded-xl border border-white/10 bg-[#0e131d] p-5 space-y-3">
        <div className="flex items-center gap-2 font-heading text-base font-black uppercase text-white mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#bc13fe]"></span>
          Gêneros Zerados em {ANO}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
          {topGen.map(([nome, stats], idx) => {
            const pct = total > 0 ? Math.round((stats.count / total) * 100) : 0;
            const isOpen = openGenres[nome] ?? false;
            const genreGames = jogosAno.filter((g) => g.genero === nome);

            // Palette color per index
            const genreColors = [
              '#bc13fe',
              '#00f5ff',
              '#ff0055',
              '#ffd700',
              '#00ff9f',
              '#ff7a00',
              '#6366f1',
              '#ec4899',
            ];
            const col = genreColors[idx % genreColors.length];

            return (
              <div key={nome} className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
                <div
                  onClick={() => setOpenGenres((prev) => ({ ...prev, [nome]: !isOpen }))}
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div
                      className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-xs sm:text-sm font-black uppercase flex-shrink-0"
                      style={{ backgroundColor: `${col}20`, color: col, border: `1px solid ${col}40` }}
                    >
                      <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading text-xs sm:text-sm font-bold text-white truncate">
                        {nome}
                      </div>
                      <div className="text-xs text-slate-500 font-bold uppercase truncate">
                        {pct}% dos jogos
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-mono text-xs sm:text-xs font-bold text-white">
                        {fmtH(stats.hours)}
                      </div>
                      <div className="text-xs text-slate-500 uppercase">Horas</div>
                    </div>
                    <div className="text-right border-l border-white/10 pl-2 sm:pl-3">
                      <div className="font-heading text-sm sm:text-lg font-black" style={{ color: col }}>
                        {stats.count}
                      </div>
                      <div className="text-xs text-slate-500 uppercase">Zerados</div>
                    </div>
                    <ChevronDown
                      className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Progress track */}
                <div className="h-1 w-full bg-white/5">
                  <div className="h-full" style={{ width: `${pct}%`, backgroundColor: col }}></div>
                </div>

                {/* Expanded game grid (4 jogos por linha) */}
                {isOpen && (
                  <div className="p-3.5 bg-black/60 border-t border-white/5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {genreGames.map((g) => (
                        <div
                          key={g.id}
                          onClick={() => onGameClick(g.id)}
                          className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-[#0e131d] hover:border-[#bc13fe] hover:shadow-lg hover:shadow-[#bc13fe]/20 transition-all cursor-pointer"
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
                              <div className="absolute top-1 right-1 rounded bg-black/85 px-1 py-0.2 text-xs font-heading font-black text-[#ffd700] border border-white/10">
                                ★{g.nota.toFixed(1)}
                              </div>
                            )}
                            <div className="absolute bottom-1 left-1 rounded bg-black/80 px-1 py-0.2 text-xs font-mono text-slate-300 border border-white/10">
                              {g.console}
                            </div>
                          </div>
                          <div className="p-1.5">
                            <div className="font-heading text-xs font-bold text-white truncate group-hover:text-[#bc13fe] transition-colors">
                              {g.title}
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400 mt-0.5 font-mono">
                              <span>{g.tempo ? `${g.tempo}` : '—'}</span>
                              {g.data_zerado && <span>{formatDateBR(g.data_zerado).slice(0, 5)}</span>}
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
      </div>
    </div>
  );
};
