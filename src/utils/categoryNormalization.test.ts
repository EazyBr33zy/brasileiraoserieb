import { describe, expect, it } from 'vitest';
import {
  groupByCategory,
  matchesCategory,
  normalizeCategory,
  pickDisplayName,
} from './categoryNormalization';

describe('normalizeCategory', () => {
  it('aplica trim, colapsa espaços múltiplos e remove acentos', () => {
    expect(normalizeCategory('  Briga   de   Rua  ')).toBe('briga de rua');
    expect(normalizeCategory('Ação')).toBe('acao');
    expect(normalizeCategory('RPG   Tático')).toBe('rpg tatico');
  });

  it('converte para minúsculas', () => {
    expect(normalizeCategory('NES')).toBe('nes');
    expect(normalizeCategory('PlayStation 4')).toBe('playstation 4');
  });

  it('trata null/undefined como string vazia', () => {
    expect(normalizeCategory(null)).toBe('');
    expect(normalizeCategory(undefined)).toBe('');
  });
});

describe('pickDisplayName', () => {
  it('escolhe a grafia mais frequente entre variantes', () => {
    expect(pickDisplayName(['NES', 'Nes', 'nes'])).toBe('NES');
  });

  it('em empate escolhe a variante com primeira letra maiúscula', () => {
    expect(pickDisplayName(['briga de rua', 'Briga de Rua'])).toBe('Briga de Rua');
    // ordem invertida: ainda vence a maiúscula
    expect(pickDisplayName(['Briga de Rua', 'briga de rua'])).toBe('Briga de Rua');
  });

  it('persistindo o empate (nenhuma maiúscula), mantém a primeira', () => {
    expect(pickDisplayName(['nintendo', 'nes'])).toBe('nintendo');
  });
});

describe('groupByCategory', () => {
  it('agrupa variantes por chave normalizada e soma números', () => {
    const out = groupByCategory([
      ['NES', { count: 3, hours: 10 }],
      ['Nes', { count: 2, hours: 5 }],
      ['PlayStation 4', { count: 4, hours: 20 }],
      ['playstation  4', { count: 1, hours: 6 }],
    ]);
    const map = new Map(out);
    expect(map.get('NES')).toEqual({ count: 5, hours: 15 });
    expect(map.get('PlayStation 4')).toEqual({ count: 5, hours: 26 });
    expect(out.map(([n]) => n)).toEqual(['NES', 'PlayStation 4']);
  });

  it('ordena por quantidade desc e depois por nome', () => {
    const out = groupByCategory([
      ['Ação', { count: 2, hours: 1 }],
      ['RPG', { count: 2, hours: 1 }],
      ['Aventura', { count: 9, hours: 1 }],
    ]);
    expect(out.map(([n]) => n)).toEqual(['Aventura', 'Ação', 'RPG']);
  });

  it('desempate de contagem usa nome com inicial maiúscula quando agrupado', () => {
    const out = groupByCategory([
      ['briga de rua', { count: 1, hours: 1 }],
      ['Briga de Rua', { count: 1, hours: 1 }],
    ]);
    expect(out.length).toBe(1);
    expect(out[0][0]).toBe('Briga de Rua');
    expect(out[0][1]).toEqual({ count: 2, hours: 2 });
  });
});

describe('matchesCategory', () => {
  it('casa variantes ignorando caixa/espaços/acentos', () => {
    expect(matchesCategory('playstation  4', 'PlayStation 4')).toBe(true);
    expect(matchesCategory('Briga de Rua', 'briga   de rua')).toBe(true);
    expect(matchesCategory('Acao', 'Ação')).toBe(true);
    expect(matchesCategory('SNES', 'NES')).toBe(false);
  });
});
