import React, { useMemo } from 'react';
import { GameplayDaySession } from '../../types/game';
import { fmtMinutes } from '../../utils/markdownParser';
import { sortSessionsForDisplay } from '../../utils/gameCalculations';

interface SessionsSummaryProps {
  sessions: GameplayDaySession[];
  /** Remove a faixa de resumo e os agrupamentos por mês — mantém apenas o título "Histórico de Sessões de Gameplay" (aba #/jogando) */
  hideSummary?: boolean;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/** Converte "DD/MM/AAAA" ou "YYYY-MM-DD" para chave de mês "MM|AAAA" + rótulo legível. */
const monthKeyOf = (data: string): { key: string; label: string } | null => {
  const br = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(data || '');
  if (br) return { key: `${br[2]}|${br[3]}`, label: `${MONTH_NAMES[+br[2] - 1]} ${br[3]}` };
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(data || '');
  if (iso) return { key: `${iso[2]}|${iso[1]}`, label: `${MONTH_NAMES[+iso[2] - 1]} ${iso[1]}` };
  return null;
};

const StatCard: React.FC<{ label: string; value: string; accent?: string }> = ({
  label,
  value,
  accent = 'text-white',
}) => (
  <div className="min-w-0 rounded-lg border border-[#30363d] bg-black/25 px-3 py-2.5">
    <div className="text-xs font-bold uppercase tracking-wider text-[#9aa4b2]">{label}</div>
    <div className={`mt-1 truncate font-mono font-bold leading-tight ${accent}`}>{value}</div>
  </div>
);

/**
 * Faixa de resumo das sessões — calculada a partir das sessões JÁ EXISTENTES
 * (sem campos novos no banco e sem alterar nenhuma lógica de salvamento).
 */
export const SessionsSummary: React.FC<SessionsSummaryProps> = ({ sessions, hideSummary = false }) => {
  // SOMENTE EXIBIÇÃO: ordena por data real (mais recente primeiro) antes de agrupar por mês.
  // Os dados salvos e os cálculos de tempo permanecem inalterados.
  const orderedSessions = useMemo(() => sortSessionsForDisplay(sessions), [sessions]);

  const summary = useMemo(() => {
    if (hideSummary) {
      return { total: 0, totalMin: 0, avg: 0, biggest: null, groups: [] };
    }
    const total = orderedSessions.length;
    const totalMin = orderedSessions.reduce((acc, s) => acc + (s.totalMinutos || 0), 0);
    const avg = total > 0 ? Math.round(totalMin / total) : 0;
    const biggest = orderedSessions.reduce<GameplayDaySession | null>(
      (max, s) => (!max || (s.totalMinutos || 0) > (max.totalMinutos || 0) ? s : max),
      null
    );

    // Agrupa por mês (ordem: mais recentes primeiro, conforme sessões já ordenadas acima)
    const groups: { key: string; label: string; minutes: number; days: Set<string> }[] = [];
    const byKey = new Map<string, (typeof groups)[number]>();
    for (const s of orderedSessions) {
      const m = monthKeyOf(s.data);
      if (!m) continue;
      let g = byKey.get(m.key);
      if (!g) {
        g = { key: m.key, label: m.label, minutes: 0, days: new Set<string>() };
        byKey.set(m.key, g);
        groups.push(g);
      }
      g.minutes += s.totalMinutos || 0;
      g.days.add(s.data);
    }

    return { total, totalMin, avg, biggest, groups };
  }, [orderedSessions, hideSummary]);

  // Solicitação do dono: remover o resumo/agrupamentos por mês (aba #/jogando) — só JSX de exibição
  if (hideSummary || summary.total === 0) return null;

  return (
    <div className="rounded-xl border border-[#30363d]/70 bg-[#0d1117] p-3.5 space-y-3">
      <div className="text-xs font-bold uppercase tracking-wider text-[#9aa4b2] flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#22d3ee]" aria-hidden="true" />
        <span>Resumo das sessões</span>
      </div>

      {/* Fileira de números calculados dos dados existentes */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatCard label="Total de sessões" value={String(summary.total)} accent="text-[#22d3ee]" />
        <StatCard label="Média por sessão" value={fmtMinutes(summary.avg)} />
        <StatCard
          label="Maior sessão"
          value={summary.biggest ? fmtMinutes(summary.biggest.totalMinutos || 0) : '—'}
          accent="text-purple-300"
        />
        <StatCard
          label="Dias jogados"
          value={String(new Set(orderedSessions.map((s) => s.data)).size)}
          accent="text-emerald-400"
        />
      </div>

      {/* Cabeçalhos de mês com total do mês (agrupamento apenas visual, ordenado da mais recente para a mais antiga) */}
      {summary.groups.length > 0 && (
        <ul className="space-y-1">
          {summary.groups.map((g) => (
            <li
              key={g.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#30363d]/50 bg-[#161b22] px-3 py-2 text-xs"
            >
              <span className="font-bold uppercase tracking-wide text-white">{g.label}</span>
              <span className="shrink-0 font-mono text-[#9aa4b2]">
                {g.days.size} {g.days.size === 1 ? 'dia' : 'dias'} ·{' '}
                <strong className="text-[#22d3ee]">{fmtMinutes(g.minutes)}</strong>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
