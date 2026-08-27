import LZString from 'lz-string';

export type Pair = { term: string; definition: string };
export type SharedList = { title: string; pairs: Pair[] };

export const EXAMPLE = `photosynthesis — how plants use light to make food
habitat — the natural home of a plant or animal
nocturnal — active during the night
adaptation — a feature that helps a living thing survive
predator — an animal that hunts other animals
camouflage — colors or shapes that help something hide`;

const separators = /\s+(?:—|–|->|=>|::|=|\|)\s+|\t+|\s+:\s+|\s+-\s+/;

export function parsePairs(input: string): { pairs: Pair[]; issues: string[] } {
  const pairs: Pair[] = [];
  const issues: string[] = [];
  const seen = new Set<string>();

  input.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    if (!line) return;
    const parts = line.split(separators);
    const term = (parts.shift() || '').trim();
    const definition = parts.join(' — ').trim();
    if (!term || !definition) {
      issues.push(`Line ${index + 1} needs a word and meaning separated by —, -, :, |, =, or a tab.`);
      return;
    }
    const key = term.toLocaleLowerCase();
    if (seen.has(key)) {
      issues.push(`Line ${index + 1} repeats “${term}”.`);
      return;
    }
    seen.add(key);
    pairs.push({ term: term.slice(0, 60), definition: definition.slice(0, 180) });
  });

  return { pairs: pairs.slice(0, 30), issues };
}

export function encodeList(list: SharedList): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify({ v: 1, t: list.title.slice(0, 80), p: list.pairs }));
}

export function decodeList(data: string): SharedList | null {
  try {
    const raw = LZString.decompressFromEncodedURIComponent(data);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v?: unknown; t?: unknown; p?: unknown };
    if (parsed.v !== 1 || typeof parsed.t !== 'string' || !Array.isArray(parsed.p)) return null;
    const pairs = parsed.p.filter((item): item is Pair => Boolean(item && typeof item.term === 'string' && typeof item.definition === 'string'));
    if (pairs.length < 3 || pairs.length > 30) return null;
    if (pairs.some(pair => !pair.term.trim() || !pair.definition.trim() || pair.term.length > 60 || pair.definition.length > 180)) return null;
    return { title: parsed.t.slice(0, 80), pairs };
  } catch {
    return null;
  }
}

export function shuffle<T>(items: T[], random = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function choicesFor(answer: Pair, pairs: Pair[], count = 4): string[] {
  const alternatives = shuffle(pairs.filter(pair => pair.term !== answer.term)).slice(0, count - 1).map(pair => pair.term);
  return shuffle([answer.term, ...alternatives]);
}

export function normalized(value: string): string {
  return value.trim().toLocaleLowerCase().normalize('NFKC');
}
