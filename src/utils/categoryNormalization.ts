// Normalização de categorias (plataformas/gêneros) — usada APENAS na exibição
// das abas Análise e Status do Wrap-Up. Não altera dados salvos.

export interface CategoryStats {
  count: number;
  hours: number;
}

/**
 * Chave normalizada de categoria: trim, espaços múltiplos → 1, minúsculas e sem acentos.
 */
export function normalizeCategory(name: string | null | undefined): string {
  return String(name ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Nome de exibição escolhido entre as variantes de um mesmo grupo:
 * o mais frequente; em empate, o que começa com letra maiúscula; persistindo o
 * empate, o primeiro encontrado.
 */
export function pickDisplayName(variants: string[]): string {
  const freq = new Map<string, number>();
  for (const v of variants) freq.set(v, (freq.get(v) || 0) + 1);
  let best = '';
  let bestCount = -1;
  let bestUppercase = false;
  for (const [name, c] of freq) {
    const upper = /^[A-ZÀ-Þ]/.test(name);
    const better =
      c > bestCount ||
      (c === bestCount && upper && !bestUppercase);
    if (better) {
      best = name;
      bestCount = c;
      bestUppercase = upper;
    }
  }
  return best;
}

/**
 * Agrupa entradas [categoria, stats] por chave normalizada, somando números das
 * variantes. Retorna lista ordenada por quantidade (desc), depois pelo nome.
 */
export function groupByCategory(
  entries: Array<[string, CategoryStats]>
): Array<[string, CategoryStats]> {
  const groups = new Map<string, { variants: string[]; count: number; hours: number }>();
  for (const [nome, stats] of entries) {
    const key = normalizeCategory(nome);
    const g = groups.get(key);
    if (g) {
      g.variants.push(nome);
      g.count += stats.count;
      g.hours += stats.hours;
    } else {
      groups.set(key, { variants: [nome], count: stats.count, hours: stats.hours });
    }
  }
  return Array.from(groups.values())
    .map((g) => [pickDisplayName(g.variants), { count: g.count, hours: g.hours }] as [string, CategoryStats])
    .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]));
}

/**
 * Filtra jogos cuja categoria casa (normalizada) com o nome de um grupo agregado.
 */
export function matchesCategory(gameCategory: string | null | undefined, groupName: string): boolean {
  return normalizeCategory(gameCategory) === normalizeCategory(groupName);
}
