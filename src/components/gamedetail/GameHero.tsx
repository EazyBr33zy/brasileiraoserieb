import React from 'react';
import { GameCover, optimizeCoverUrl } from '../GameCover';
import { GameItem } from '../../types/game';
import { cleanTitle, formatTempoDisplay, formatDateBR } from '../../utils/markdownParser';

interface PlatformStyle {
  col: string;
  ico: string;
}

interface GotBadge {
  key: string;
  label: string;
  color: string;
  bg: string;
  border: string;
}

export interface GameHeroProps {
  game: GameItem;
  pStyle: PlatformStyle;
  gotBadges: GotBadge[];
  /** Tempo efetivo já calculado no GameDetailView (string "H:MM" ou vazia) */
  tempoRegistrado?: string;
  /** Nota efetiva (pode ser 11 = favorito) ou undefined */
  nota?: number;
  sessionCount: number;
  lastSessionDate?: string; // DD/MM/AAAA
  startDate?: string; // aceito DD/MM/AAAA ou YYYY-MM-DD
  daysSinceStart?: number;
  /** Bloco HLTB pronto (JSX atual do GameDetailView, sem alterações) */
  hltbBlock: React.ReactNode;
  /** Painel do dono (STATUS / NOTA / TEMPO TOTAL / AÇÕES), JSX atual sem alterações */
  controls: React.ReactNode;
  /** Linha opcional "desenvolvedora/publicadora · ano de lançamento" exibida sob o título */
  developerLine?: string;
  /** Capa compacta (aba #/jogando): largura da coluna da capa reduzida no desktop */
  compactCover?: boolean;
}

const StatBox: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: string;
  valueClass?: string;
}> = ({ label, value, sub, valueClass = 'text-white' }) => (
  <div className="min-w-0 rounded-lg border border-[#30363d] bg-black/25 px-3 py-2.5">
    <div className="text-xs font-bold uppercase tracking-wider text-[#9aa4b2]">{label}</div>
    <div className={`mt-1 truncate font-mono font-bold leading-tight ${valueClass}`}>{value}</div>
    {sub && <div className="mt-0.5 truncate text-xs text-[#9aa4b2]" title={sub}>{sub}</div>}
  </div>
);

/** Normaliza datas internas (YYYY-MM-DD) para DD/MM/AAAA sem lógica nova de negócio */
const toBR = (d?: string): string | undefined => {
  if (!d) return undefined;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  return d;
};

export const GameHero: React.FC<GameHeroProps> = ({
  game,
  pStyle,
  gotBadges,
  tempoRegistrado,
  nota,
  sessionCount,
  lastSessionDate,
  startDate,
  daysSinceStart,
  hltbBlock,
  controls,
  developerLine,
  compactCover = false,
}) => {
  const coverBg = optimizeCoverUrl(game.capa, 'hero');
  const isFav = nota === 11;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] p-5 shadow-xl sm:p-6">
      {/* Fundo: capa desfocada (só se houver capa real) */}
      {coverBg && (
        <>
          <img
            src={coverBg}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-20 blur-3xl motion-reduce:scale-100"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.7) 55%, rgba(13,17,23,0.9) 100%)',
            }}
          />
        </>
      )}

      <div className={`relative z-10 grid gap-6 ${compactCover ? 'md:grid-cols-[200px_minmax(0,1fr)]' : 'md:grid-cols-[260px_minmax(0,1fr)]'}`}>
        {/* Capa grande (compactCover reduz p/ 200px no desktop — aba #/jogando) */}
        <div className={`mx-auto w-40 shrink-0 sm:w-52 md:mx-0 ${compactCover ? 'md:w-[200px]' : 'md:w-[260px]'}`} style={{ aspectRatio: '3 / 4' }}>
          <GameCover
            src={game.capa}
            title={game.title}
            consoleName={game.console}
            size="hero"
            className="h-full w-full rounded-xl border border-[#30363d]/70 shadow-2xl shadow-black/50"
          />
        </div>

        {/* Coluna de dados */}
        <div className="min-w-0 space-y-4">
          {/* Badges: console, gênero, status ("Zerado em" SOMENTE se zerado) */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="flex items-center gap-1 rounded px-2.5 py-0.5 text-xs font-mono font-bold uppercase shadow-sm"
              style={{ backgroundColor: `${pStyle.col}20`, color: pStyle.col, border: `1px solid ${pStyle.col}40` }}
            >
              <span aria-hidden="true">{pStyle.ico}</span>
              <span>{game.console}</span>
            </span>
            <span className="rounded border border-purple-500/30 bg-purple-500/15 px-2.5 py-0.5 text-xs font-medium text-purple-300">
              {game.genero}
            </span>
            {game.status === 'zerado' && game.ano_zerado ? (
              <span className="rounded border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
                Zerado em {game.ano_zerado}
              </span>
            ) : (
              <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-mono font-bold uppercase text-cyan-300">
                {game.status}
              </span>
            )}
          </div>

          {/* Título */}
          <h1
            className="font-heading font-extrabold leading-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]"
            style={{ fontSize: compactCover ? 'clamp(1.5rem, 2.5vw, 2rem)' : 'clamp(2rem, 4vw, 3.25rem)' }}
          >
            {cleanTitle(game.title)}
          </h1>

          {/* Desenvolvedora · ano de lançamento (só se existirem) */}
          {developerLine && (
            <p className="text-sm text-[#9aa4b2]">{developerLine}</p>
          )}

          {/* Badges de premiações GOT */}
          {gotBadges.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {gotBadges.map((badge) => (
                <span
                  key={badge.key}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-xs font-bold ${badge.border} ${badge.bg}`}
                  style={{ color: badge.color }}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}

          {/* Grade de 4 caixas iguais */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatBox
              label="Tempo registrado"
              value={tempoRegistrado ? formatTempoDisplay(tempoRegistrado) : '0h00'}
              valueClass="text-[#22d3ee]"
            />
            <StatBox
              label="Nota"
              value={nota !== undefined ? (isFav ? '★ 11' : `★ ${nota.toFixed(1)}`) : '—'}
              valueClass={nota !== undefined ? 'text-[#ffd700]' : 'text-[#9aa4b2]'}
            />
            <StatBox
              label="Sessões"
              value={`${sessionCount}`}
              sub={lastSessionDate ? `último: ${toBR(lastSessionDate)}` : 'sem sessões'}
            />
            <StatBox
              label="Início"
              value={startDate ? toBR(startDate) ?? formatDateBR(startDate) : '—'}
              sub={daysSinceStart !== undefined && daysSinceStart >= 0 ? `há ${daysSinceStart} dias` : undefined}
            />
          </div>

          {/* Progresso HLTB (bloco original, inalterado) */}
          {hltbBlock}

          {/* Painel do dono (original, movido via slot) */}
          {controls}
        </div>
      </div>
    </section>
  );
};
