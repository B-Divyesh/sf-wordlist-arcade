import LZString from 'lz-string';

export type Pair = { term: string; definition: string };
export type SharedList = { title: string; pairs: Pair[] };

const LESSON_FORMAT = 'wordlist-arcade-lesson';
const LESSON_VERSION = 1;

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
    if (term.length > 60 || definition.length > 180) {
      issues.push(`Line ${index + 1} is too long. Words can be 60 characters and meanings can be 180 characters.`);
      return;
    }
    const key = term.toLocaleLowerCase();
    if (seen.has(key)) {
      issues.push(`Line ${index + 1} repeats “${term}”.`);
      return;
    }
    seen.add(key);
    if (pairs.length >= 30) {
      issues.push(`Line ${index + 1} is beyond the 30-pair limit.`);
      return;
    }
    pairs.push({ term, definition });
  });

  return { pairs, issues };
}

export function encodeList(list: SharedList): string {
  // v2 avoids repeating JSON object keys for every pair. The prefix lets us
  // evolve the codec without breaking already-shared v1 links.
  const compact = [list.title, ...list.pairs.flatMap(pair => [pair.term, pair.definition])];
  return `v2.${LZString.compressToEncodedURIComponent(JSON.stringify(compact))}`;
}

function validList(title: unknown, sourcePairs: unknown): SharedList | null {
  if (typeof title !== 'string' || title.length > 80 || !Array.isArray(sourcePairs)) return null;
  const pairs: Pair[] = [];
  const seen = new Set<string>();
  for (const item of sourcePairs) {
    if (!item || typeof item !== 'object' || typeof (item as Pair).term !== 'string' || typeof (item as Pair).definition !== 'string') return null;
    const pair = item as Pair;
    if (!pair.term.trim() || !pair.definition.trim() || pair.term.length > 60 || pair.definition.length > 180) return null;
    const key = pair.term.toLocaleLowerCase();
    if (seen.has(key)) return null;
    seen.add(key);
    pairs.push({ term: pair.term, definition: pair.definition });
  }
  if (pairs.length < 3 || pairs.length > 30) return null;
  return { title, pairs };
}

export function decodeList(data: string): SharedList | null {
  try {
    const isV2 = data.startsWith('v2.');
    const raw = LZString.decompressFromEncodedURIComponent(isV2 ? data.slice(3) : data);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (isV2) {
      if (!Array.isArray(parsed) || typeof parsed[0] !== 'string' || (parsed.length - 1) % 2 !== 0) return null;
      const pairs: Pair[] = [];
      for (let index = 1; index < parsed.length; index += 2) {
        pairs.push({ term: parsed[index] as string, definition: parsed[index + 1] as string });
      }
      return validList(parsed[0], pairs);
    }
    const legacy = parsed as { v?: unknown; t?: unknown; p?: unknown };
    if (legacy.v !== 1) return null;
    return validList(legacy.t, legacy.p);
  } catch {
    return null;
  }
}

export function lessonArtifact(list: SharedList): string {
  const checked = validList(list.title, list.pairs);
  if (!checked) throw new Error('Cannot export an invalid lesson.');
  return JSON.stringify({ format: LESSON_FORMAT, version: LESSON_VERSION, title: checked.title, pairs: checked.pairs });
}

export function parseLessonArtifact(contents: string): SharedList | null {
  try {
    const parsed = JSON.parse(contents) as { format?: unknown; version?: unknown; title?: unknown; pairs?: unknown };
    if (parsed.format !== LESSON_FORMAT || parsed.version !== LESSON_VERSION) return null;
    return validList(parsed.title, parsed.pairs);
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
