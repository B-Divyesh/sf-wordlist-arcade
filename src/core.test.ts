import { describe, expect, it } from 'vitest';
import { choicesFor, decodeList, encodeList, normalized, parsePairs, shuffle } from './core';

describe('word list parsing', () => {
  it('accepts common teacher-friendly separators and ignores blank lines', () => {
    const result = parsePairs('cat — gato\ndog - perro\n\nbird\tpájaro\nfish : pez');
    expect(result.issues).toEqual([]);
    expect(result.pairs).toHaveLength(4);
    expect(result.pairs[2]).toEqual({ term: 'bird', definition: 'pájaro' });
  });

  it('reports malformed and duplicate lines without losing valid pairs', () => {
    const result = parsePairs('cat — gato\nmissing meaning\nCAT — another');
    expect(result.pairs).toHaveLength(1);
    expect(result.issues).toHaveLength(2);
    expect(result.issues[0]).toContain('Line 2');
  });

  it('caps lists at thirty pairs', () => {
    const input = Array.from({ length: 35 }, (_, index) => `word ${index} — meaning ${index}`).join('\n');
    expect(parsePairs(input).pairs).toHaveLength(30);
  });
});

describe('share links', () => {
  const list = { title: 'Animals', pairs: [{ term: 'cat', definition: 'gato' }, { term: 'dog', definition: 'perro' }, { term: 'bird', definition: 'pájaro' }] };

  it('round-trips a Unicode list through compressed URL-safe data', () => {
    const encoded = encodeList(list);
    expect(encoded).not.toContain(' ');
    expect(decodeList(encoded)).toEqual(list);
  });

  it('rejects damaged or undersized payloads', () => {
    expect(decodeList('not-valid')).toBeNull();
    expect(decodeList(encodeList({ title: 'Tiny', pairs: list.pairs.slice(0, 2) }))).toBeNull();
  });
});

describe('game helpers', () => {
  it('normalizes case and compatibility characters', () => {
    expect(normalized('  Café ')).toBe('café');
  });

  it('keeps the answer in a unique choice set', () => {
    const pairs = [{ term: 'one', definition: '1' }, { term: 'two', definition: '2' }, { term: 'three', definition: '3' }];
    const choices = choicesFor(pairs[0], pairs, 3);
    expect(choices).toHaveLength(3);
    expect(new Set(choices).size).toBe(3);
    expect(choices).toContain('one');
  });

  it('does not mutate arrays when shuffling', () => {
    const source = [1, 2, 3];
    const result = shuffle(source, () => 0);
    expect(source).toEqual([1, 2, 3]);
    expect(result).not.toBe(source);
  });
});
