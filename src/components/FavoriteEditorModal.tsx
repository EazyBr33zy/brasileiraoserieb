import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Star, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GameItem } from '../types/game';
import { Modal } from './Modal';
import { GameCover } from './GameCover';
import {
  MAX_FAVORITES,
  buildFavoritesListUpdates,
  favoritePickerSort,
  filterGamesByTitleOrConsole,
  getFavoriteCandidates,
  getFavoriteGames,
  sortFavorites,
} from '../utils/favorites';

const PAGE_SIZE = 60;

interface FavoriteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCycleYear: number;
}

/**
 * Editor "Meus 5 favoritos" (somente dono):
 * - 5 slots numerados com ◀ ▶ para reordenar e "×" para remover;
 * - busca por título/console + chips "Zerados"/"Todos" + grade rolável (6 colunas);
 * - nada é gravado até "Salvar favoritos" (um único writeBatch).
 */
export const FavoriteEditorModal: React.FC<FavoriteEditorModalProps> = ({
  isOpen,
  onClose,
  currentCycleYear,
}) => {
  const { games, setGames } = useGame() as ReturnType<typeof useGame> & {
    setGames: React.Dispatch<React.SetStateAction<GameItem[]>>;
  };

  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [chip, setChip] = useState<'zerados' | 'todos'>('zerados');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [limitMsg, setLimitMsg] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Sincroniza com os favoritos atuais toda vez que o modal abre.
  useEffect(() => {
    if (isOpen) {
      setOrderedIds(
        sortFavorites(getFavoriteGames(games))
          .slice(0, MAX_FAVORITES)
          .map((g) => g.id)
      );
      setSearch('');
      setChip('zerados');
      setVisibleCount(PAGE_SIZE);
      setLimitMsg(false);
      // autofocus no campo de busca
      const t = setTimeout(() => searchRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const selected = useMemo(
    () => orderedIds.map((id) => games.find((g) => g.id === id)).filter(Boolean) as GameItem[],
    [orderedIds, games]
  );

  const candidates = useMemo(() => {
    const base = chip === 'zerados' ? getFavoriteCandidates(games, currentCycleYear) : games;
    return favoritePickerSort(filterGamesByTitleOrConsole(base, search));
  }, [games, chip, search, currentCycleYear]);

  const toggleCandidate = (id: string) => {
    setLimitMsg(false);
    setOrderedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_FAVORITES) {
        setLimitMsg(true);
        return prev;
      }
      return [...prev, id];
    });
  };

  const removeSlot = (i: number) => {
    setLimitMsg(false);
    setOrderedIds((prev) => prev.filter((_, idx) => idx !== i));
  };

  const moveSlot = (i: number, dir: -1 | 1) => {
    setOrderedIds((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleSave = () => {
    const ops = buildFavoritesListUpdates(games, orderedIds);
    if (ops.length === 0) {
      onClose();
      return;
    }

    // Grava TODAS as mudanças de uma vez em um único writeBatch (updateGameBatch):
    // atualização otimista + rollback + toast de erro específico no contexto.
    updateGameBatch(ops);
    onClose();
  };

  const visible = candidates.slice(0, visibleCount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Meus 5 favoritos"
      description="Escolha, remova e ordene seus 5 jogos favoritos. Nada é salvo até você clicar em Salvar."
      icon={<Star className="h-5 w-5 text-[#fbbf24]" aria-hidden="true" />}
      maxWidth="max-w-4xl"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-4 rounded-xl border border-[#30363d] bg-[#161b22] text-sm font-bold text-slate-300 hover:border-[#22d3ee]/60 hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#22d3ee] focus:outline-none"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[40px] px-5 rounded-xl bg-[#22d3ee] text-sm font-black uppercase tracking-wider text-[#0d1117] hover:bg-[#06b6d4] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
          >
            Salvar favoritos
          </button>
        </div>
      }
    >
      {/* ── Slots 1..5 ── */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {Array.from({ length: MAX_FAVORITES }).map((_, i) => {
          const g = selected[i];
          if (!g) {
            return (
              <div
                key={`slot-empty-${i}`}
                className="flex aspect-[3/4] w-full items-center justify-center rounded-lg border border-dashed border-[#30363d] text-[#9aa4b2]"
                aria-label={`Slot ${i + 1} vazio`}
              >
                <span className="font-mono text-xs font-bold">{i + 1}</span>
              </div>
            );
          }
          return (
            <div key={g.id} className="relative min-w-0">
              {/* Capa inteira, sem cortar */}
              <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-[#30363d] bg-[#0d1117]">
                <img
                  src={g.capa || undefined}
                  alt={`Capa de ${g.title}`}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                  }}
                />
              </div>
              <span className="absolute left-1 top-1 z-10 rounded-md border border-[#30363d] bg-[#0d1117]/90 px-1.5 py-0.5 font-mono text-[11px] font-black leading-none text-[#fbbf24]">
                {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeSlot(i)}
                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-md border border-[#30363d] bg-[#0d1117]/90 text-[#9aa4b2] hover:border-[#f87171]/60 hover:text-[#f87171] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#f87171] focus:outline-none"
                aria-label={`Remover ${g.title} dos favoritos`}
                title="Remover"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <div className="mt-1 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => moveSlot(i, -1)}
                  disabled={i === 0}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-[#30363d] bg-[#161b22] text-[#9aa4b2] hover:border-[#22d3ee]/60 hover:text-white disabled:opacity-30 disabled:hover:border-[#30363d] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#22d3ee] focus:outline-none"
                  aria-label={`Mover ${g.title} para trás`}
                  title="Mover para trás"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <p className="min-w-0 flex-1 truncate text-center text-[12px] font-semibold text-[#f0f6fc]" title={g.title}>
                  {g.title}
                </p>
                <button
                  type="button"
                  onClick={() => moveSlot(i, 1)}
                  disabled={i >= selected.length - 1}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-[#30363d] bg-[#161b22] text-[#9aa4b2] hover:border-[#22d3ee]/60 hover:text-white disabled:opacity-30 disabled:hover:border-[#30363d] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#22d3ee] focus:outline-none"
                  aria-label={`Mover ${g.title} para frente`}
                  title="Mover para frente"
                >
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Busca + chips de filtro ── */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="relative block min-w-0 flex-1 basis-52">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa4b2]" aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Buscar por título ou console…"
            className="h-10 w-full rounded-xl border border-[#30363d] bg-[#0d1117] pl-9 pr-3 text-sm text-[#f0f6fc] placeholder:text-[#9aa4b2]/60 focus:border-[#22d3ee]/60 focus:outline-none"
            aria-label="Buscar jogo por título ou console"
          />
        </label>
        <div className="flex items-center gap-1.5" role="group" aria-label="Filtro da lista de jogos">
          <button
            type="button"
            onClick={() => {
              setChip('zerados');
              setVisibleCount(PAGE_SIZE);
            }}
            aria-pressed={chip === 'zerados'}
            className={`h-10 rounded-xl border px-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#22d3ee] focus:outline-none ${
              chip === 'zerados'
                ? 'border-[#22d3ee]/60 bg-[#22d3ee]/10 text-[#22d3ee]'
                : 'border-[#30363d] bg-[#161b22] text-[#9aa4b2] hover:text-white'
            }`}
          >
            Zerados
          </button>
          <button
            type="button"
            onClick={() => {
              setChip('todos');
              setVisibleCount(PAGE_SIZE);
            }}
            aria-pressed={chip === 'todos'}
            className={`h-10 rounded-xl border px-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#22d3ee] focus:outline-none ${
              chip === 'todos'
                ? 'border-[#22d3ee]/60 bg-[#22d3ee]/10 text-[#22d3ee]'
                : 'border-[#30363d] bg-[#161b22] text-[#9aa4b2] hover:text-white'
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      {/* Mensagem de limite (dentro do próprio modal) */}
      {limitMsg && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-[#fbbf24]/40 bg-[#fbbf24]/10 px-3 py-2 text-[13px] font-semibold text-[#fbbf24]"
        >
          Limite de 5: remova um favorito primeiro
        </p>
      )}

      {/* ── Grade de candidatas ── */}
      <div className="favorites-editor-grid mt-3 max-h-[45vh] overflow-y-auto pr-1">
        {visible.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#9aa4b2]">Nenhum jogo encontrado.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {visible.map((g) => {
              const isSel = orderedIds.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleCandidate(g.id)}
                  aria-pressed={isSel}
                  className={`group relative block min-w-0 rounded-lg border p-1 text-left transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fbbf24] focus:outline-none ${
                    isSel
                      ? 'border-[#fbbf24]/60 bg-[#fbbf24]/10'
                      : 'border-[#30363d] bg-[#161b22] hover:border-[#22d3ee]/40'
                  }`}
                  title={g.title}
                >
                  <GameCover
                    src={g.capa}
                    title={g.title}
                    consoleName={g.console}
                    size="lg"
                    className="!rounded-md border border-[#30363d]"
                  />
                  {isSel && (
                    <span className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-md bg-[#0d1117]/90 shadow">
                      <Star className="h-3.5 w-3.5 fill-[#fbbf24] text-[#fbbf24]" aria-hidden="true" />
                    </span>
                  )}
                  <p className="mt-1 line-clamp-2 text-[12px] font-medium leading-tight text-[#c9d1d9]">
                    {g.title}
                  </p>
                </button>
              );
            })}
          </div>
        )}
        {candidates.length > visibleCount && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="min-h-[40px] rounded-xl border border-[#30363d] bg-[#161b22] px-4 text-sm font-bold text-slate-200 hover:border-[#22d3ee]/60 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#22d3ee] focus:outline-none"
            >
              Mostrar mais
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
