import React from 'react';
import { Activity, ChevronDown, Gamepad2 } from 'lucide-react';
import { fmtH } from '../../utils/markdownParser';
import { getPlatformStyle, getScoreLabel } from '../../utils/platformStyles';
import { GameItem } from '../../types/game';

interface WrapUpStatusTabProps {
  availableYears: number[];
  lifetime: {
    totalLifetime: number;
    horasLifetime: number;
    mediaLifetime: number;
    notas10Lifetime: number;
    notasLifetimeArr: number[];
    topConLifetime: Array<[string, { count: number; hours: number }]>;
    topGenLifetime: Array<[string, { count: number; hours: number }]>;
    histLifetime: Record<string, number>;
    maxNHLifetime: number;
  };
  notaHistCores: Record<string, string>;
  openPlatformsStatus: Record<string, boolean>;
  setOpenPlatformsStatus: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  openGenresStatus: Record<string, boolean>;
  setOpenGenresStatus: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  zeradosAll: GameItem[];
  anosStats: Array<{ ano: number; qtd: number; h: number; media: number }>;
  maxAnoQtd: number;
  onGameClick: (id: string) => void;
}

export const WrapUpStatusTab: React.FC<WrapUpStatusTabProps> = ({
  availableYears,
  lifetime,
  notaHistCores,
  openPlatformsStatus,
  setOpenPlatformsStatus,
  openGenresStatus,
  setOpenGenresStatus,
  zeradosAll,
  anosStats,
  maxAnoQtd,
  onGameClick,
}) => {
  return (
    <div className="space-y-6">
      {/* Lifetime Header & Overview Banner */}
      <div className="rounded-xl border border-[#00f5ff]/30 bg-gradient-to-r from-[#00f5ff]/10 via-purple-500/10 to-[#0e131d] p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#00f5ff]">
              <Activity className="h-4 w-4" />
              <span>Status Histórico Global</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-black uppercase text-white mt-1">
              Estatísticas de Todos os Anos Somados
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Soma consolidada de toda a sua história na biblioteca: {lifetime.totalLifetime} jogos zerados acumulados, {fmtH(lifetime.horasLifetime)} de jogatina e análise técnica unificada.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-black/60 border border-white/10 p-3">
            <div className="text-center">
              <div className="text-xs font-bold text-slate-500 uppercase">Anos Ativos</div>
              <div className="font-heading text-2xl font-black text-[#00f5ff]">{availableYears.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* All-time KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/10 bg-[#0e131d] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#00f5ff]"></div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Zerados (Vida)</div>
          <div className="font-heading text-3xl font-black text-[#00f5ff] mt-1">{lifetime.totalLifetime}</div>
          <div className="text-xs text-slate-400 mt-1">Todos os anos somados</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0e131d] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#00ff9f]"></div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tempo Total Jogado</div>
          <div className="font-heading text-3xl font-black text-[#00ff9f] mt-1">{fmtH(lifetime.horasLifetime)}</div>
          <div className="text-xs text-slate-400 mt-1">Horas registradas</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0e131d] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ffd700]"></div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Nota Média Histórica</div>
          <div className="font-heading text-3xl font-black text-[#ffd700] mt-1">
            {lifetime.mediaLifetime ? lifetime.mediaLifetime.toFixed(2) : '—'}
          </div>
          <div className="text-xs text-slate-400 mt-1">{lifetime.notasLifetimeArr.length} jogos avaliados</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0e131d] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#bc13fe]"></div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Masterpieces (10★)</div>
          <div className="font-heading text-3xl font-black text-[#bc13fe] mt-1">{lifetime.notas10Lifetime}</div>
          <div className="text-xs text-slate-400 mt-1">Jogos supremos</div>
        </div>
      </div>

      {/* Seção 1: Distribuição de Notas (Todos os Anos) */}
      <div className="rounded-xl border border-white/10 bg-[#0e131d] p-5">
        <div className="flex items-center gap-2 font-heading text-base font-black uppercase text-white mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffd700]"></span>
          Distribuição de Notas (Todos os Anos Somados)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8 grid grid-cols-7 gap-2 items-end h-36 border-b border-white/10 pb-2">
            {Object.entries(lifetime.histLifetime).map(([faixa, qtd]) => {
              const pct = Math.max(qtd ? 15 : 4, Math.round((qtd / lifetime.maxNHLifetime) * 100));
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

          <div className="md:col-span-4 rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 text-xs">
            <div className="text-center pb-2 border-b border-white/10">
              <div className="text-xs uppercase font-bold text-slate-500">Média Geral Histórica</div>
              <div className="font-heading text-4xl font-black text-[#ffd700]">
                {lifetime.mediaLifetime ? lifetime.mediaLifetime.toFixed(2) : '—'}
              </div>
              <div className="inline-block rounded-full bg-[#ffd700]/15 text-[#ffd700] px-2 py-0.5 text-xs font-bold mt-1">
                {getScoreLabel(lifetime.mediaLifetime)}
              </div>
            </div>

            <div className="space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>🏆 Nota Máxima:</span>
                <strong className="text-white">
                  {lifetime.notasLifetimeArr.length ? Math.max(...lifetime.notasLifetimeArr).toFixed(1) : '—'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>⭐ Masterpieces (10★):</span>
                <strong className="text-emerald-400">{lifetime.notas10Lifetime}</strong>
              </div>
              <div className="flex justify-between">
                <span>📉 Nota Mínima:</span>
                <strong className="text-red-400">
                  {lifetime.notasLifetimeArr.length ? Math.min(...lifetime.notasLifetimeArr).toFixed(1) : '—'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 2: Plataformas Zeradas (Todos os Anos Somados - 2 colunas, 4 jogos por linha) */}
      <div className="rounded-xl border border-white/10 bg-[#0e131d] p-5 space-y-3">
        <div className="flex items-center gap-2 font-heading text-base font-black uppercase text-white mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
          Plataformas Zeradas (Todos os Anos Somados)
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
          {lifetime.topConLifetime.map(([nome, stats]) => {
            const s = getPlatformStyle(nome);
            const pct = lifetime.totalLifetime > 0 ? Math.round((stats.count / lifetime.totalLifetime) * 100) : 0;
            const isOpen = openPlatformsStatus[nome] ?? false;
            const platformGames = zeradosAll.filter((g) => g.console === nome);

            return (
              <div key={nome} className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
                <div
                  onClick={() => setOpenPlatformsStatus((prev) => ({ ...prev, [nome]: !isOpen }))}
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <span className="text-lg sm:text-xl flex-shrink-0">{s.ico}</span>
                    <div className="min-w-0">
                      <div className="font-heading text-xs sm:text-sm font-bold text-white truncate">{s.name}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase truncate">
                        {pct}% de toda a história
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-mono text-xs sm:text-xs font-bold text-white">{fmtH(stats.hours)}</div>
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
                            <div className="absolute bottom-1 left-1 rounded bg-black/80 px-1 py-0.2 text-xs font-mono text-slate-300 border border-white/10">
                              {g.ano_zerado || 'Zerado'}
                            </div>
                          </div>
                          <div className="p-1.5">
                            <div className="font-heading text-xs font-bold text-white truncate group-hover:text-[#00f5ff] transition-colors">
                              {g.title}
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400 mt-0.5 font-mono">
                              <span>{g.tempo ? `${g.tempo}` : '—'}</span>
                              <span className="truncate max-w-[45px]">{g.genero}</span>
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

      {/* Seção 3: Gêneros Zerados (Todos os Anos Somados - 2 colunas, 4 jogos por linha) */}
      <div className="rounded-xl border border-white/10 bg-[#0e131d] p-5 space-y-3">
        <div className="flex items-center gap-2 font-heading text-base font-black uppercase text-white mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#bc13fe]"></span>
          Gêneros Zerados (Todos os Anos Somados)
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
          {lifetime.topGenLifetime.map(([nome, stats], idx) => {
            const pct = lifetime.totalLifetime > 0 ? Math.round((stats.count / lifetime.totalLifetime) * 100) : 0;
            const isOpen = openGenresStatus[nome] ?? false;
            const genreGames = zeradosAll.filter((g) => g.genero === nome);

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
                  onClick={() => setOpenGenresStatus((prev) => ({ ...prev, [nome]: !isOpen }))}
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
                      <div className="font-heading text-xs sm:text-sm font-bold text-white truncate">{nome}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase truncate">
                        {pct}% de toda a história
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-mono text-xs sm:text-xs font-bold text-white">{fmtH(stats.hours)}</div>
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
                              <span>{g.ano_zerado || '—'}</span>
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

      {/* Seção 4: Evolução e Comparativo de Todos os Anos */}
      <div className="rounded-xl border border-white/10 bg-[#0e131d] p-5 space-y-4">
        <div className="flex items-center gap-2 font-heading text-base font-black uppercase text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00f5ff]"></span>
          Evolução e Comparativo de Todos os Anos
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8 flex items-end justify-between gap-3 h-40 border-b border-white/10 pb-2">
            {anosStats.map((item) => {
              const pct = Math.max(item.qtd ? 15 : 4, Math.round((item.qtd / maxAnoQtd) * 100));
              return (
                <div key={item.ano} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="font-mono text-xs font-bold text-[#00f5ff]">{item.qtd}</span>
                  <div
                    className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-[#00f5ff]/40 to-[#00f5ff] transition-all"
                    style={{ height: `${pct}%`, boxShadow: '0 0 10px rgba(0,245,255,0.3)' }}
                  ></div>
                  <span className="text-xs font-heading font-black text-white">{item.ano}</span>
                </div>
              );
            })}
          </div>

          <div className="md:col-span-4 rounded-xl border border-white/10 bg-black/40 p-4 space-y-2 text-xs">
            <div className="text-xs font-bold uppercase text-slate-500 mb-2">Desempenho por Ano</div>
            {anosStats.map((item) => (
              <div
                key={item.ano}
                className="flex justify-between items-center py-1 border-b border-white/5 last:border-none"
              >
                <span className="font-heading font-bold text-white">{item.ano}</span>
                <span className="font-mono text-slate-300">
                  {item.qtd} jogos · {fmtH(item.h)}
                </span>
                <span className="font-mono text-[#ffd700] font-bold">★ {item.media.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
