import type { ReactNode } from 'react';

export type StatAccent = 'cyan' | 'purple' | 'blue' | 'amber';

const ACCENTS: Record<StatAccent, { border: string; iconBg: string; bar: string }> = {
  cyan: {
    border: 'border-[#22d3ee]/25 hover:border-[#22d3ee]/60',
    iconBg: 'bg-[#22d3ee]/15 text-[#22d3ee]',
    bar: 'bg-[#22d3ee]',
  },
  purple: {
    border: 'border-[#a855f7]/25 hover:border-[#a855f7]/60',
    iconBg: 'bg-[#a855f7]/15 text-[#a855f7]',
    bar: 'bg-[#a855f7]',
  },
  blue: {
    border: 'border-[#38bdf8]/25 hover:border-[#38bdf8]/60',
    iconBg: 'bg-[#38bdf8]/15 text-[#38bdf8]',
    bar: 'bg-[#38bdf8]',
  },
  amber: {
    border: 'border-[#fbbf24]/25 hover:border-[#fbbf24]/60',
    iconBg: 'bg-[#fbbf24]/15 text-[#fbbf24]',
    bar: 'bg-[#fbbf24]',
  },
};

interface StatCardProps {
  label: string;
  description: string;
  icon: ReactNode;
  value: ReactNode;
  accent?: StatAccent;
  progress?: number; // 0-100 — quando presente, renderiza a barra de progresso
  progressLabel?: string;
  action?: ReactNode; // ex.: lápis de editar meta (somente dono)
}

export function StatCard({
  label,
  description,
  icon,
  value,
  accent = 'cyan',
  progress,
  progressLabel,
  action,
}: StatCardProps) {
  const a = ACCENTS[accent];

  return (
    <div
      className={`flex h-full min-h-[96px] flex-col justify-between rounded-xl border bg-[#0d1117]/80 p-4 transition-colors xl:p-5 ${a.border}`}
    >
      {/* Cabeçalho: ícone · texto · valor */}
      <div className="grid w-full grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${a.iconBg}`}
          aria-hidden="true"
        >
          {icon}
        </span>

        <div className="min-w-0">
          <p className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-[#c9d1d9]">{label}</p>
          <p className="line-clamp-2 text-[13px] leading-snug text-[#9aa4b2]" title={description}>
            {description}
          </p>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1">
          {action}
          <div className="whitespace-nowrap text-right font-mono text-xl font-bold tabular-nums leading-none text-[#f0f6fc] sm:text-2xl lg:text-[28px]">
            {value}
          </div>
        </div>
      </div>

      {/* Barra de progresso (apenas META ANUAL): logo abaixo do cabeçalho, margem de 12px */}
      {typeof progress === 'number' && (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#21262d]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#22d3ee] to-[#a855f7] transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          {progressLabel && (
            <span className="w-9 shrink-0 text-right text-xs font-bold tabular-nums text-[#9aa4b2]">
              {progressLabel}
            </span>
          )}
        </div>
      )}

      {/* Linha fina colorida de acento na base do cartão */}
      <div className={`mt-3 h-[2px] w-full rounded-full opacity-60 ${a.bar}`} aria-hidden="true" />
    </div>
  );
}
