import React from 'react';
import { GameCover } from '../GameCover';
import { GameItem } from '../../types/game';
import { cleanTitle, formatTempoDisplay, parseToMinutes } from '../../utils/markdownParser';

export interface GameSidebarProps {
  game: GameItem;
  playingGames: GameItem[];
  navigate: (hash: string) => void;
}

const Card: React.FC<{ title: React.ReactNode; right?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  right,
  children,
}) => (
  <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-4 shadow-md">
    <div className="mb-3 flex items-center justify-between gap-2 border-b border-[#30363d]/60 pb-2.5">
      <span className="text-xs font-bold uppercase tracking-wider text-[#9aa4b2]">{title}</span>
      {right}
    </div>
    {children}
  </div>
);

const Row: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '' || Number(value) === 0 && typeof value === 'number' && !value) return null;
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="shrink-0 font-bold uppercase tracking-wide text-[#9aa4b2]">{label}</span>
      <span className="min-w-0 truncate text-right font-medium text-white" title={String(value)}>
        {String(value)}
      </span>
    </div>
  );
};

export const GameSidebar: React.FC<GameSidebarProps> = ({ game, playingGames, navigate }) => {
  const others = playingGames.filter((g) => g.id !== game.id);
  const hltbMin = parseToMinutes(game.hltb);

  return (
    <div className="space-y-4">
      {/* ── OUTROS EM ANDAMENTO ── */}
      {others.length > 0 && (
        <Card
          title={
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#22d3ee] motion-reduce:animate-none" aria-hidden="true" />
              Outros em andamento
            </span>
          }
          right={
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-mono font-bold text-cyan-300">
              {playingGames.length} ativos
            </span>
          }
        >
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {others.map((pg) => {
              const played = parseToMinutes(pg.tempo);
              const h = parseToMinutes(pg.hltb);
              const pct = h > 0 ? Math.min(100, Math.round((played / h) * 100)) : null;
              return (
                <button
                  key={pg.id}
                  type="button"
                  onClick={() => navigate(`#/jogo/${encodeURIComponent(pg.id)}`)}
                  className="flex min-h-[44px] w-full cursor-pointer items-center gap-2.5 rounded-xl border border-[#30363d] bg-[#0d1117] p-2 text-left transition-colors hover:border-[#22d3ee]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]"
                  aria-label={`Abrir ${cleanTitle(pg.title)}`}
                >
                  <div className="h-11 w-[44px] shrink-0 overflow-hidden rounded-lg bg-black">
                    <GameCover src={pg.capa} title={pg.title} consoleName={pg.console} size="sm" className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold text-white">{cleanTitle(pg.title)}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-[#9aa4b2]">
                      <span className="truncate">{pg.console}</span>
                      <span className="shrink-0 font-mono">⏱ {formatTempoDisplay(pg.tempo || '0:00')}</span>
                      {pct !== null && <span className="shrink-0 font-mono text-cyan-300">{pct}%</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── FICHA TÉCNICA ── */}
      <Card title="Ficha técnica">
        <div className="space-y-2">
          <Row label="Console" value={game.console} />
          <Row label="Gênero" value={game.genero} />
          <Row label="Lançamento" value={game.ano_lancamento} />
          <Row label="Desenvolvedora" value={game.developer} />
          <Row label="Publicadora" value={game.publisher} />
          <Row label="Início" value={game.data_inicio} />
          {game.status === 'zerado' && <Row label="Zerado em" value={game.data_zerado || game.ano_zerado} />}
          <Row label="HLTB estimado" value={game.hltb ? formatTempoDisplay(game.hltb) : undefined} />
          <Row label="HLTB real" value={game.hltb_real ? formatTempoDisplay(game.hltb_real) : undefined} />
          {hltbMin <= 0 && !game.hltb && (
            <div className="pt-1 text-xs text-[#9aa4b2]">Sem dados de HLTB cadastrados.</div>
          )}
        </div>
      </Card>
    </div>
  );
};
