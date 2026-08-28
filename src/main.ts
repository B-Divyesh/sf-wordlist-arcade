import './style.css';
import { choicesFor, decodeList, encodeList, EXAMPLE, lessonArtifact, normalized, parseLessonArtifact, parsePairs, shuffle, type Pair, type SharedList } from './core';

type GameId = 'match' | 'strike' | 'anagram' | 'reveal' | 'memory' | 'race';

const LONG_LINK_GUIDANCE = 1900;

const games: { id: GameId; name: string; short: string; color: string }[] = [
  { id: 'match', name: 'Match up', short: 'Connect each word to its meaning.', color: '#d9d3f8' },
  { id: 'strike', name: 'Word strike', short: 'Hit the right word before moving on.', color: '#c83b2d' },
  { id: 'anagram', name: 'Anagram', short: 'Unscramble the word from its clue.', color: '#f3bf3b' },
  { id: 'reveal', name: 'Word reveal', short: 'Reveal letters without using six misses.', color: '#18794e' },
  { id: 'memory', name: 'Memory grid', short: 'Find every hidden word-and-meaning pair.', color: '#1746a2' },
  { id: 'race', name: 'Quiz race', short: 'Answer up to five multiple-choice clues.', color: '#d9d3f8' }
];

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) throw new Error('App root is missing');
const app: HTMLDivElement = appRoot;
const BUILD_ID = '20260828-polish5-r5';
const DEMO_TITLE = 'Photosynthesis practice';
const DEMO_LIST: SharedList = { title: DEMO_TITLE, pairs: parsePairs(EXAMPLE).pairs };

let currentList: SharedList = { title: 'My vocabulary', pairs: [] };
let currentGame: GameId | null = null;
let waitingWorker: ServiceWorker | null = null;
let gameRunId = 0;
let demoRouteActive = isDemo();

function isDemo(): boolean {
  return location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
}

function storageKey(key: string): string {
  return isDemo() ? `demo:${key}` : key;
}

function readLocal(key: string): string {
  try { return localStorage.getItem(storageKey(key)) || ''; } catch { return ''; }
}

function writeLocal(key: string, value: string): void {
  try { localStorage.setItem(storageKey(key), value); } catch { /* The game still works when browser storage is unavailable. */ }
}

function removeLocal(key: string): void {
  try { localStorage.removeItem(storageKey(key)); } catch { /* Nothing to clear. */ }
}

function clearDemo(): void {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith('demo:'))
      .forEach(key => localStorage.removeItem(key));
  } catch { /* Nothing to clear. */ }
}

function leaveDemo(): void {
  clearDemo();
  // Do not carry the sample list into the normal maker through in-memory
  // state. Demo data must disappear as soon as someone starts for real.
  currentList = { title: 'My vocabulary', pairs: [] };
  currentGame = null;
}

const esc = (value: string) => value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] || char));
const get = <T extends HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};

function icon(name: 'back' | 'share' | 'screen' | 'refresh'): string {
  const paths = {
    back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4"/>',
    screen: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8m-4-3v3"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>'
  };
  return `<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function header(): string {
  return `<header class="site-header"><nav class="nav shell" aria-label="Main navigation">
    <a class="brand" href="/" aria-label="Wordlist Arcade home"><span class="brand-mark" aria-hidden="true"></span><span>Wordlist Arcade</span></a>
    <div class="nav-links"><a class="text-link" href="/?demo=1">Demo</a><a class="text-link" href="/#make">Make a game</a><a class="text-link" href="/privacy/">Privacy</a></div>
  </nav></header>`;
}

function footer(): string {
  return `<footer class="site-footer"><div class="shell footer-inner">
    <p><strong>Wordlist Arcade</strong> makes classroom vocabulary games. Built by Param Factory · ${BUILD_ID}</p>
    <div class="footer-links"><a class="text-link" href="/?demo=1">Demo</a><a class="text-link" href="/privacy/">Privacy</a><a class="text-link" href="/terms/">Terms</a></div>
  </div></footer>`;
}

function demoBanner(): string {
  if (!isDemo()) return '';
  return `<aside class="demo-banner" aria-label="Demo controls"><span role="status"><strong>Demo</strong> — sample data, nothing is saved.</span><span class="demo-actions"><button class="text-button" id="reset-demo" type="button">Reset demo</button><a class="text-button" id="start-real" href="/">Start for real</a></span></aside>`;
}

function setupDemoBanner(): void {
  const reset = document.querySelector<HTMLButtonElement>('#reset-demo');
  reset?.addEventListener('click', () => {
    clearDemo();
    currentList = DEMO_LIST;
    writeLocal('wordlist-arcade-draft', EXAMPLE);
    writeLocal('wordlist-arcade-title', DEMO_TITLE);
    if (currentGame) renderGame(currentGame); else renderHome(DEMO_LIST, 'Demo reset. The sample game is ready.');
  });
  document.querySelector<HTMLAnchorElement>('#start-real')?.addEventListener('click', event => {
    event.preventDefault();
    leaveDemo();
    navigate('/');
  });
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
    if (link.id === 'start-real') return;
    const target = new URL(link.href, location.href);
    const staysInDemo = target.origin === location.origin &&
      (target.pathname === '/demo' || target.searchParams.get('demo') === '1');
    if (!staysInDemo) link.addEventListener('click', clearDemo);
  });
}

function renderHome(prefill?: SharedList, notice = ''): void {
  gameRunId += 1;
  currentGame = null;
  const stored = readLocal('wordlist-arcade-draft');
  const storedTitle = readLocal('wordlist-arcade-title') || 'My vocabulary';
  const list = prefill || { ...currentList, title: currentList.pairs.length ? currentList.title : storedTitle };
  const initialText = prefill ? list.pairs.map(pair => `${pair.term} — ${pair.definition}`).join('\n') : stored;
  app.innerHTML = `${header()}
    <div class="offline-banner" id="offline-banner" role="status" hidden>You’re offline. Saved lists and opened game links still work.</div>
    ${demoBanner()}
    <main id="main">
      <section class="hero shell" id="home">
        <div class="hero-copy">
          <p class="eyebrow">Vocabulary games for class</p>
          <h1>Make six vocabulary games</h1>
          <p>For language, ESL, and primary teachers who need a quick activity from this week’s words.</p>
          <div class="hero-actions"><a class="button primary" href="#make">Paste your word pairs</a><a class="button" href="/?demo=1">Try it with sample data</a></div>
          <p class="action-note">Open a ready-to-play photosynthesis game.</p>
          <ul class="plain-facts"><li>Free to use</li><li>No account</li><li>Lists stay on this device</li></ul>
        </div>
        <picture class="hero-art">
          <source media="(max-width: 700px)" srcset="/assets/word-machine-640.webp" type="image/webp" />
          <source srcset="/assets/word-machine.webp" type="image/webp" />
          <img src="/assets/word-machine.jpg" width="1200" height="800" alt="A handmade geometric machine turning blank word cards into six colorful game paths" fetchpriority="high" decoding="async" />
        </picture>
      </section>
      <section class="maker-wrap" id="make"><div class="maker shell">
        <div class="editor-panel">
          <div class="section-intro"><p class="eyebrow">Make vocabulary games</p><h2>Paste word pairs</h2><p>Put one word and meaning on each line. We check the list as you type.</p></div>
          <div class="field"><label for="list-title">List name <span class="label-help">Shown at the top of each game</span></label><input id="list-title" maxlength="80" value="${esc(list.title)}" autocomplete="off" /></div>
          <div class="field"><label for="wordlist">Words and meanings <span class="label-help">Example: nocturnal — active during the night</span></label><textarea id="wordlist" spellcheck="true" aria-describedby="parse-status">${esc(initialText)}</textarea></div>
          <div class="field-row"><div class="inline-actions"><button class="button small" id="load-example" type="button">Load sample list</button><button class="button small danger" id="clear-draft" type="button">Clear list</button></div><button class="button primary" id="copy-list" type="button" disabled>${icon('share')} Copy class link</button></div>
          <div class="status" id="parse-status" role="status" aria-live="polite">Add 3 pairs to choose a game.</div>
          <section class="share-tools" aria-labelledby="share-tools-title">
            <h3 id="share-tools-title">Share a game with your class</h3>
            <p>Copy a class link. If your learning platform rejects a long link, download a lesson file.</p>
            <div class="inline-actions"><button class="button small" id="download-lesson" type="button" disabled>Download lesson file</button><button class="button small" id="import-lesson" type="button">Import lesson</button><input class="sr-only" id="lesson-file" type="file" accept="application/json,.json" aria-label="Choose a Wordlist Arcade lesson file" /></div>
            <p class="share-limit" id="share-limit" hidden></p>
          </section>
          <p class="label-help">Use 3 to 30 pairs. Use a dash or colon between each word and meaning.</p>
        </div>
        <div class="game-shelf" aria-labelledby="shelf-title">
          <div class="shelf-heading"><h2 id="shelf-title">Choose a game</h2><span class="count-pill" id="pair-count">0 pairs</span></div>
          <div class="game-grid">${games.map((game, index) => `<button class="game-card" type="button" data-game="${game.id}" style="--shape-color:${game.color}" disabled><span class="game-number">${index + 1}</span><strong>${game.name}</strong><span>${game.short}</span></button>`).join('')}</div>
        </div>
      </div></section>
      <section class="how shell" id="how"><p class="eyebrow">How to make a game</p><h2>Make a game in three steps</h2><ol class="how-list"><li><h3>Paste word pairs</h3><p>Add words, translations, or definitions.</p></li><li><h3>Choose a game</h3><p>Pick any of six games from your list.</p></li><li><h3>Play or share</h3><p>Play together or copy a class link.</p></li></ol></section>
    </main>${footer()}<div class="toast" id="toast" role="status" hidden></div>${updateToast()}`;

  const titleInput = get<HTMLInputElement>('#list-title');
  const textArea = get<HTMLTextAreaElement>('#wordlist');
  const update = () => updateMaker(titleInput.value, textArea.value);
  titleInput.addEventListener('input', update);
  textArea.addEventListener('input', update);
  get<HTMLButtonElement>('#load-example').addEventListener('click', () => { textArea.value = EXAMPLE; update(); textArea.focus(); });
  get<HTMLButtonElement>('#clear-draft').addEventListener('click', () => { textArea.value = ''; titleInput.value = 'My vocabulary'; removeLocal('wordlist-arcade-draft'); removeLocal('wordlist-arcade-title'); update(); textArea.focus(); });
  get<HTMLButtonElement>('#copy-list').addEventListener('click', () => copyLink('match'));
  get<HTMLButtonElement>('#download-lesson').addEventListener('click', downloadLesson);
  const lessonFile = get<HTMLInputElement>('#lesson-file');
  get<HTMLButtonElement>('#import-lesson').addEventListener('click', () => lessonFile.click());
  lessonFile.addEventListener('change', () => { void importLesson(lessonFile); });
  document.querySelectorAll<HTMLButtonElement>('[data-game]').forEach(button => button.addEventListener('click', () => openGame(button.dataset.game as GameId)));
  updateMaker(titleInput.value, textArea.value);
  updateOnlineStatus();
  setupDemoBanner();
  if (waitingWorker) showUpdateToast();
  if (notice) showToast(notice);
}

function updateMaker(title: string, raw: string): void {
  const result = parsePairs(raw);
  currentList = { title: title.trim() || 'My vocabulary', pairs: result.pairs };
  if (raw.trim() || currentList.title !== 'My vocabulary') {
    writeLocal('wordlist-arcade-draft', raw);
    writeLocal('wordlist-arcade-title', currentList.title);
  } else {
    removeLocal('wordlist-arcade-draft');
    removeLocal('wordlist-arcade-title');
  }
  const status = get<HTMLElement>('#parse-status');
  const count = get<HTMLElement>('#pair-count');
  count.textContent = `${result.pairs.length} ${result.pairs.length === 1 ? 'pair' : 'pairs'}`;
  status.className = 'status';
  if (result.issues.length) {
    status.textContent = `${result.issues[0]} ${result.pairs.length} valid ${result.pairs.length === 1 ? 'pair' : 'pairs'} found.`;
    status.classList.add('error');
  } else if (result.pairs.length < 3) {
    const needed = 3 - result.pairs.length;
    status.textContent = `Add ${needed} ${needed === 1 ? 'pair' : 'pairs'} to choose a game.`;
  } else {
    status.textContent = `${result.pairs.length} pairs ready. Choose any game.`;
    status.classList.add('good');
  }
  const enabled = result.pairs.length >= 3;
  document.querySelectorAll<HTMLButtonElement>('[data-game]').forEach(button => { button.disabled = !enabled; });
  const shareUrl = gameUrl('match');
  get<HTMLButtonElement>('#copy-list').disabled = !enabled;
  get<HTMLButtonElement>('#download-lesson').disabled = !enabled;
  const shareLimit = get<HTMLElement>('#share-limit');
  shareLimit.hidden = !enabled || shareUrl.length <= LONG_LINK_GUIDANCE;
  if (enabled && shareUrl.length > LONG_LINK_GUIDANCE) {
    shareLimit.textContent = `This complete class link is ${shareUrl.length.toLocaleString()} characters. Copy it where long links are accepted. Some learning platforms reject long links. If that happens, download the lesson file. Importing it restores every pair.`;
  }
}

function updateOnlineStatus(online = navigator.onLine): void {
  const banner = document.querySelector<HTMLElement>('#offline-banner');
  if (banner) banner.hidden = online;
}

function gameUrl(game: GameId): string {
  const demoQuery = isDemo() ? '?demo=1' : '';
  return `${location.origin}/play/${game}${demoQuery}#d=${encodeURIComponent(encodeList(currentList))}`;
}

function navigate(url: string): void {
  history.pushState({}, '', url);
  route();
}

async function copyLink(game: GameId): Promise<void> {
  const url = gameUrl(game);
  try {
    await navigator.clipboard.writeText(url);
    showToast(url.length > LONG_LINK_GUIDANCE ? 'Complete class link copied. Some learning platforms reject long links. Download the lesson file if that happens.' : 'Class link copied. Anyone with the link can play.');
  } catch {
    window.prompt('Copy this class link:', url);
  }
}

function lessonFile(): File {
  return new File([lessonArtifact(currentList)], 'wordlist-arcade-lesson.json', { type: 'application/json' });
}

function downloadLesson(): void {
  const file = lessonFile();
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Lesson downloaded. Import it in Wordlist Arcade to restore every pair.');
}

async function importLesson(input: HTMLInputElement): Promise<void> {
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  const imported = parseLessonArtifact(await file.text());
  if (!imported) {
    showToast('That file is not a complete Wordlist Arcade lesson.');
    return;
  }
  currentList = imported;
  renderHome(imported, `Lesson imported: ${imported.pairs.length} pairs are ready to play.`);
  window.requestAnimationFrame(() => get<HTMLTextAreaElement>('#wordlist').focus());
}

function showToast(message: string): void {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.setTimeout(() => { toast.hidden = true; }, 3000);
}

function updateToast(): string {
  return '<div class="toast update-toast" id="update-toast" hidden><span id="update-message" role="status">A new version is ready.</span><button class="button small" id="update-now" type="button">Update now</button></div>';
}

function showUpdateToast(): void {
  const toast = document.querySelector<HTMLElement>('#update-toast');
  const button = document.querySelector<HTMLButtonElement>('#update-now');
  if (!toast || !button || !waitingWorker) return;
  toast.hidden = false;
  button.onclick = () => {
    button.disabled = true;
    const message = document.querySelector<HTMLElement>('#update-message');
    if (message) message.textContent = 'Updating Wordlist Arcade…';
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
  };
}

function openGame(game: GameId): void {
  if (currentList.pairs.length < 3) return;
  navigate(gameUrl(game));
}

function playChrome(game: (typeof games)[number]): string {
  return `<div class="play-page">${header()}${demoBanner()}<section class="play-toolbar" aria-label="Game area">
    <nav class="play-nav shell" aria-label="Game controls">
    <button class="button small" id="back-home" type="button">${icon('back')}<span>Choose a game</span></button>
    <div class="game-title"><span>${esc(currentList.title)}</span><h1 tabindex="-1">${game.name}</h1></div>
    <div class="inline-actions"><button class="button small" id="share-game" type="button" aria-label="Copy game link">${icon('share')}<span>Copy link</span></button><button class="button small" id="fullscreen" type="button">${icon('screen')}<span>Enter fullscreen</span></button></div>
  </nav></section><main class="play-main shell" id="main"><div class="play-meta"><div class="progress-wrap"><div class="progress-label"><span id="progress-text">Ready</span><span id="progress-number">0%</span></div><div class="progress" aria-hidden="true"><span id="progress-bar"></span></div></div><div class="score-box" id="score">Score 0</div></div><section class="game-stage" id="game-stage" aria-live="polite"></section></main>${footer()}</div><div class="toast" id="toast" role="status" hidden></div>${updateToast()}`;
}

function setupPlayControls(game: GameId): void {
  get<HTMLButtonElement>('#back-home').addEventListener('click', () => { navigate(isDemo() ? '/demo#make' : '/#make'); });
  get<HTMLButtonElement>('#share-game').addEventListener('click', () => copyLink(game));
  const fullscreen = get<HTMLButtonElement>('#fullscreen');
  const updateFullscreenLabel = () => {
    const entering = !document.fullscreenElement;
    fullscreen.querySelector('span')!.textContent = entering ? 'Enter fullscreen' : 'Exit fullscreen';
  };
  document.onfullscreenchange = updateFullscreenLabel;
  updateFullscreenLabel();
  fullscreen.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen(); else await document.exitFullscreen();
    } catch { showToast('Fullscreen is not available in this browser.'); }
  });
}

function setMeta(done: number, total: number, score: number, label = 'Progress'): void {
  const percent = total ? Math.round((done / total) * 100) : 0;
  get<HTMLElement>('#progress-text').textContent = `${label}: ${done} of ${total}`;
  get<HTMLElement>('#progress-number').textContent = `${percent}%`;
  get<HTMLElement>('#progress-bar').style.setProperty('--progress', `${percent}%`);
  get<HTMLElement>('#score').textContent = `Score ${score}`;
}

function finishGame(game: GameId, score: number, total: number, message: string): void {
  setMeta(total, total, score, 'Complete');
  get<HTMLElement>('#game-stage').innerHTML = `<div class="finish"><div class="finish-shape" aria-hidden="true">★</div><h2>Round complete!</h2><p>${esc(message)} Your score is ${score}.</p><div class="inline-actions"><button class="button primary" id="play-again" type="button">${icon('refresh')} Play again</button><button class="button" id="choose-game" type="button">Choose another game</button></div></div>`;
  get<HTMLButtonElement>('#play-again').addEventListener('click', () => renderGame(game));
  get<HTMLButtonElement>('#choose-game').addEventListener('click', () => { navigate(isDemo() ? '/demo#make' : '/#make'); });
  get<HTMLButtonElement>('#play-again').focus();
}

function renderGame(gameId: GameId): void {
  const game = games.find(item => item.id === gameId);
  if (!game) return;
  const runId = ++gameRunId;
  currentGame = gameId;
  app.innerHTML = playChrome(game);
  setupPlayControls(gameId);
  setupDemoBanner();
  if (waitingWorker) showUpdateToast();
  if (gameId === 'match') playMatch();
  if (gameId === 'strike') playStrike(runId);
  if (gameId === 'anagram') playAnagram();
  if (gameId === 'reveal') playReveal(runId);
  if (gameId === 'memory') playMemory(runId);
  if (gameId === 'race') playRace(runId);
}

function playMatch(): void {
  const pairs = shuffle(currentList.pairs).slice(0, 8).map((pair, id) => ({ ...pair, id }));
  const terms = shuffle(pairs);
  const definitions = shuffle(pairs);
  const matched = new Set<number>();
  let selectedTerm: number | null = null;
  let selectedDefinition: number | null = null;
  let attempts = 0;
  const stage = get<HTMLElement>('#game-stage');

  const draw = (message = '', kind = '') => {
    setMeta(matched.size, pairs.length, Math.max(0, matched.size * 2 - Math.max(0, attempts - matched.size)));
    stage.innerHTML = `<h2>Make every pair</h2><p class="prompt">Choose one word, then its matching meaning.</p><div class="match-grid"><div class="match-column" role="group" aria-label="Words">${terms.map(pair => `<button class="match-tile ${selectedTerm === pair.id ? 'selected' : ''} ${matched.has(pair.id) ? 'matched' : ''}" data-side="term" data-id="${pair.id}" ${matched.has(pair.id) ? 'disabled' : ''}>${esc(pair.term)}</button>`).join('')}</div><div class="match-column" role="group" aria-label="Meanings">${definitions.map(pair => `<button class="match-tile ${selectedDefinition === pair.id ? 'selected' : ''} ${matched.has(pair.id) ? 'matched' : ''}" data-side="definition" data-id="${pair.id}" ${matched.has(pair.id) ? 'disabled' : ''}>${esc(pair.definition)}</button>`).join('')}</div></div><p class="live-message ${kind}" role="status">${esc(message)}</p>`;
    stage.querySelectorAll<HTMLButtonElement>('[data-side]').forEach(button => button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      if (button.dataset.side === 'term') selectedTerm = id; else selectedDefinition = id;
      if (selectedTerm !== null && selectedDefinition !== null) {
        attempts += 1;
        if (selectedTerm === selectedDefinition) {
          matched.add(selectedTerm);
          selectedTerm = null; selectedDefinition = null;
          if (matched.size === pairs.length) { finishGame('match', Math.max(pairs.length, pairs.length * 2 - (attempts - pairs.length)), pairs.length, 'Every pair found.'); return; }
          draw('That pair fits!', 'good');
        } else {
          selectedTerm = null; selectedDefinition = null;
          draw('Not a pair yet. Try those tiles again.', 'bad');
        }
      } else draw('Now choose from the other side.');
    }));
  };
  draw();
}

function playStrike(runId: number): void {
  const queue = shuffle(currentList.pairs);
  let index = 0;
  let score = 0;
  let locked = false;
  const stage = get<HTMLElement>('#game-stage');
  const draw = (message = '', selected = '') => {
    const pair = queue[index];
    setMeta(index, queue.length, score);
    const options = choicesFor(pair, currentList.pairs, Math.min(6, currentList.pairs.length));
    stage.innerHTML = `<h2>Strike the word</h2><p class="prompt">Which word means “${esc(pair.definition)}”?</p><div class="choice-grid">${options.map(term => `<button class="choice ${selected === term ? (normalized(term) === normalized(pair.term) ? 'correct' : 'wrong') : ''}" data-answer="${esc(term)}" ${locked ? 'disabled' : ''}>${esc(term)}</button>`).join('')}</div><p class="live-message ${message.startsWith('Yes') ? 'good' : message ? 'bad' : ''}" role="status">${esc(message)}</p>`;
    stage.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(button => button.addEventListener('click', () => {
      if (locked) return;
      locked = true;
      const answer = button.dataset.answer || '';
      const correct = normalized(answer) === normalized(pair.term);
      if (correct) score += 1;
      draw(correct ? 'Yes—that’s the one!' : `The answer is “${pair.term}”.`, answer);
      window.setTimeout(() => {
        if (gameRunId !== runId) return;
        index += 1; locked = false;
        if (index >= queue.length) finishGame('strike', score, queue.length, 'You cleared the target field.'); else draw();
      }, 700);
    }));
  };
  draw();
}

function playAnagram(): void {
  // The parser accepts terms up to 60 characters. Anagram must honor that
  // contract, including shared links and imported lessons at the boundary.
  const queue = shuffle(currentList.pairs);
  let index = 0;
  let score = 0;
  const stage = get<HTMLElement>('#game-stage');
  const draw = (message = '', kind = '') => {
    const pair = queue[index];
    const characters = shuffle(Array.from(pair.term.replace(/\s/g, '')));
    setMeta(index, queue.length, score);
    stage.innerHTML = `<h2>Unscramble the word</h2><p class="prompt">Clue: ${esc(pair.definition)}</p><div class="anagram-tiles" role="group" aria-label="Scrambled letters">${characters.map((char, i) => `<span class="letter-tile" style="--tilt:${(i % 3 - 1) * 2}deg">${esc(char.toUpperCase())}</span>`).join('')}</div><form class="answer-form" id="anagram-form"><label class="sr-only" for="anagram-answer">Your answer</label><input id="anagram-answer" autocomplete="off" autocapitalize="none" placeholder="Type the word" required /><button class="button primary" type="submit">Check word</button></form><p class="live-message ${kind}" role="status">${esc(message)}</p>`;
    get<HTMLFormElement>('#anagram-form').addEventListener('submit', event => {
      event.preventDefault();
      const input = get<HTMLInputElement>('#anagram-answer');
      if (normalized(input.value) === normalized(pair.term)) {
        score += 1; index += 1;
        if (index >= queue.length) finishGame('anagram', score, queue.length, 'You rebuilt every word.'); else draw('Correct! Next word.', 'good');
      } else {
        input.select();
        const messageEl = stage.querySelector<HTMLElement>('.live-message');
        if (messageEl) { messageEl.textContent = 'Not quite. Check the letters and try again.'; messageEl.className = 'live-message bad'; }
      }
    });
    get<HTMLInputElement>('#anagram-answer').focus();
  };
  draw();
}

function playReveal(runId: number): void {
  const queue = shuffle(currentList.pairs);
  let index = 0;
  let score = 0;
  let guesses = new Set<string>();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const stage = get<HTMLElement>('#game-stage');
  const draw = (message = '', kind = '') => {
    const pair = queue[index];
    const upper = pair.term.toLocaleUpperCase();
    const letters = new Set(Array.from(upper).filter(char => /\p{L}/u.test(char)));
    const wrong = [...guesses].filter(letter => !letters.has(letter)).length;
    const solved = [...letters].every(letter => guesses.has(letter));
    setMeta(index, queue.length, score, `Misses ${wrong}/6`);
    stage.innerHTML = `<h2>Reveal the word</h2><p class="prompt">Clue: ${esc(pair.definition)}</p><p class="word-rail"><span class="sr-only">Word: ${solved ? esc(pair.term) : 'partly hidden'}</span><span aria-hidden="true">${Array.from(upper).map(char => `<span class="word-slot">${/\p{L}/u.test(char) ? (guesses.has(char) ? esc(char) : '') : esc(char)}</span>`).join('')}</span></p><div class="letter-grid" role="group" aria-label="Choose a letter">${alphabet.map(letter => `<button class="letter-button" data-letter="${letter}" ${guesses.has(letter) || solved || wrong >= 6 ? 'disabled' : ''}>${letter}</button>`).join('')}</div><form class="answer-form reveal-answer" id="reveal-form"><label class="sr-only" for="reveal-answer">Solve the whole word</label><input id="reveal-answer" autocomplete="off" placeholder="Or solve the whole word" ${solved || wrong >= 6 ? 'disabled' : ''} /><button class="button" type="submit" ${solved || wrong >= 6 ? 'disabled' : ''}>Solve</button></form><p class="live-message ${kind}" role="status">${esc(message || `${6 - wrong} misses left`)}</p>`;
    if (solved || wrong >= 6) {
      window.setTimeout(() => {
        if (gameRunId !== runId) return;
        if (solved) score += 1;
        index += 1; guesses = new Set();
        if (index >= queue.length) finishGame('reveal', score, queue.length, 'The word rail is complete.'); else draw(solved ? 'Word revealed!' : `The word was “${pair.term}”.`, solved ? 'good' : 'bad');
      }, 850);
      return;
    }
    stage.querySelectorAll<HTMLButtonElement>('[data-letter]').forEach(button => button.addEventListener('click', () => { guesses.add(button.dataset.letter || ''); draw(letters.has(button.dataset.letter || '') ? 'That letter belongs.' : 'No match for that letter.', letters.has(button.dataset.letter || '') ? 'good' : 'bad'); }));
    get<HTMLFormElement>('#reveal-form').addEventListener('submit', event => {
      event.preventDefault();
      const input = get<HTMLInputElement>('#reveal-answer');
      if (normalized(input.value) === normalized(pair.term)) {
        letters.forEach(letter => guesses.add(letter));
        draw('You solved the whole word!', 'good');
      } else {
        input.select();
        const messageEl = stage.querySelector<HTMLElement>('.live-message');
        if (messageEl) { messageEl.textContent = 'That is not the word yet. Try another letter or answer.'; messageEl.className = 'live-message bad'; }
      }
    });
  };
  draw();
}

function playMemory(runId: number): void {
  const pairs = shuffle(currentList.pairs).slice(0, 6).map((pair, id) => ({ ...pair, id }));
  const cards = shuffle(pairs.flatMap(pair => [
    { id: `${pair.id}-term`, pairId: pair.id, kind: 'Word', text: pair.term },
    { id: `${pair.id}-definition`, pairId: pair.id, kind: 'Meaning', text: pair.definition }
  ]));
  const open = new Set<string>();
  const matched = new Set<number>();
  let first: typeof cards[number] | null = null;
  let locked = false;
  let turns = 0;
  const stage = get<HTMLElement>('#game-stage');
  const draw = (message = '') => {
    setMeta(matched.size, pairs.length, Math.max(0, matched.size * 2 - Math.max(0, turns - matched.size)), 'Pairs');
    stage.innerHTML = `<h2>Find the hidden pairs</h2><p class="prompt">Turn over two cards. Match each word with its meaning.</p><div class="memory-grid">${cards.map((card, index) => { const visible = open.has(card.id) || matched.has(card.pairId); return `<button class="memory-card ${visible ? 'open' : ''} ${matched.has(card.pairId) ? 'matched' : ''}" data-index="${index}" aria-label="${visible ? `${esc(card.kind)}: ${esc(card.text)}` : 'Hidden card'}" ${matched.has(card.pairId) || locked ? 'disabled' : ''}>${visible ? `<span class="card-kind">${card.kind}</span>${esc(card.text)}` : '<span aria-hidden="true">◆</span>'}</button>`; }).join('')}</div><p class="live-message" role="status">${esc(message)}</p>`;
    stage.querySelectorAll<HTMLButtonElement>('[data-index]').forEach(button => button.addEventListener('click', () => {
      if (locked) return;
      const card = cards[Number(button.dataset.index)];
      if (open.has(card.id)) return;
      open.add(card.id);
      if (!first) { first = card; draw('Choose one more card.'); return; }
      turns += 1;
      const firstCard = first;
      first = null;
      if (firstCard.pairId === card.pairId && firstCard.kind !== card.kind) {
        matched.add(card.pairId);
        if (matched.size === pairs.length) { finishGame('memory', Math.max(pairs.length, pairs.length * 2 - (turns - pairs.length)), pairs.length, 'All cards matched.'); return; }
        draw('A match! Those cards stay open.');
      } else {
        locked = true; draw('Not a pair. Remember their places.');
        window.setTimeout(() => {
          if (gameRunId !== runId) return;
          open.delete(firstCard.id); open.delete(card.id); locked = false; draw();
        }, 800);
      }
    }));
  };
  draw();
}

function playRace(runId: number): void {
  const queue = shuffle(currentList.pairs).slice(0, Math.min(5, currentList.pairs.length));
  let index = 0;
  let score = 0;
  let locked = false;
  const stage = get<HTMLElement>('#game-stage');
  const draw = (message = '', selected = '') => {
    const pair = queue[index];
    const options = choicesFor(pair, currentList.pairs, 4);
    setMeta(index, queue.length, score, 'Finish line');
    stage.innerHTML = `<h2>Race to the finish</h2><div class="race-track" role="progressbar" aria-label="Race progress" aria-valuemin="0" aria-valuemax="${queue.length}" aria-valuenow="${index}" aria-valuetext="${index} of ${queue.length} questions completed">${queue.map((_, step) => `<span class="race-step ${step < index ? 'done' : ''}"></span>`).join('')}</div><p class="prompt">Which word matches “${esc(pair.definition)}”?</p><div class="choice-grid">${options.map(term => `<button class="choice ${selected === term ? (normalized(term) === normalized(pair.term) ? 'correct' : 'wrong') : ''}" data-answer="${esc(term)}" ${locked ? 'disabled' : ''}>${esc(term)}</button>`).join('')}</div><p class="live-message ${message.startsWith('Correct') ? 'good' : message ? 'bad' : ''}" role="status">${esc(message)}</p>`;
    stage.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(button => button.addEventListener('click', () => {
      if (locked) return;
      locked = true;
      const answer = button.dataset.answer || '';
      const correct = normalized(answer) === normalized(pair.term);
      if (correct) score += 1;
      draw(correct ? 'Correct—move one step!' : `The answer is “${pair.term}”. Keep racing!`, answer);
      window.setTimeout(() => {
        if (gameRunId !== runId) return;
        index += 1; locked = false;
        if (index >= queue.length) finishGame('race', score, queue.length, 'You reached the finish line.'); else draw();
      }, 750);
    }));
  };
  draw();
}

function setRouteMeta(title: string, description: string, canonicalPath = location.pathname): void {
  const canonicalUrl = `${location.origin}${canonicalPath}`;
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
}

function announceRoute(label: string): void {
  const announcer = document.querySelector<HTMLElement>('#route-announcer');
  if (announcer) announcer.textContent = label;
  window.requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>('h1');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  });
}

function renderNotFound(): void {
  gameRunId += 1;
  currentGame = null;
  app.innerHTML = `${header()}<main class="not-found shell" id="main"><p class="eyebrow">Page missing</p><h1>This page was not found</h1><p>The address may be incomplete. Start a new vocabulary game from the home page.</p><a class="button primary" href="/">Go to Wordlist Arcade</a></main>${footer()}`;
  setRouteMeta('Page not found — Wordlist Arcade', 'This Wordlist Arcade page was not found.');
  announceRoute('This page was not found');
}

function restoreDemoList(): SharedList {
  const raw = readLocal('wordlist-arcade-draft');
  const parsed = parsePairs(raw);
  if (parsed.pairs.length >= 3) return { title: readLocal('wordlist-arcade-title') || DEMO_TITLE, pairs: parsed.pairs };
  writeLocal('wordlist-arcade-draft', EXAMPLE);
  writeLocal('wordlist-arcade-title', DEMO_TITLE);
  return DEMO_LIST;
}

function route(): void {
  const path = location.pathname.replace(/\/$/, '') || '/';
  const legacyHash = location.hash.slice(1);
  const demoNow = isDemo();
  // A browser Back gesture can leave the demo without activating one of the
  // banner links. Clear its separate namespace before the normal route draws.
  if (demoRouteActive && !demoNow) {
    clearDemo();
    currentList = { title: 'My vocabulary', pairs: [] };
    currentGame = null;
  }
  demoRouteActive = demoNow;
  const isLegacyGame = legacyHash.startsWith('play/');
  const isGameRoute = path.startsWith('/play/') || isLegacyGame;
  if (path !== '/' && path !== '/demo' && !path.startsWith('/play/') && !isLegacyGame) {
    renderNotFound();
    return;
  }
  if (isGameRoute) {
    const legacy = isLegacyGame ? legacyHash : '';
    const game = (path.startsWith('/play/') ? path.split('/')[2] : legacy.split('?')[0].split('/')[1]) as GameId;
    const encoded = path.startsWith('/play/')
      ? new URLSearchParams(location.hash.slice(1)).get('d')
      : new URLSearchParams(legacy.split('?')[1] || '').get('d');
    const decoded = encoded ? decodeList(encoded) : null;
    if (!games.some(item => item.id === game) || !decoded) {
      renderHome(undefined, 'That game link is incomplete or damaged. Paste a list to make a new one.');
      setRouteMeta('Wordlist Arcade — vocabulary games for class', 'Make six vocabulary games for class from one word list.');
      announceRoute('Make six vocabulary games');
      return;
    }
    currentList = decoded;
    // A class link opened inside the demo remains entirely in the demo
    // namespace when its player returns to the game chooser.
    if (demoNow) {
      writeLocal('wordlist-arcade-draft', decoded.pairs.map(pair => `${pair.term} — ${pair.definition}`).join('\n'));
      writeLocal('wordlist-arcade-title', decoded.title);
    }
    renderGame(game);
    const gameName = games.find(item => item.id === game)?.name || 'Game';
    setRouteMeta(`${gameName} — Wordlist Arcade`, `Play ${gameName} with a vocabulary list.`);
    announceRoute(gameName);
    return;
  }
  if (isDemo()) {
    currentList = restoreDemoList();
    if (legacyHash === 'make') {
      renderHome(currentList);
      setRouteMeta('Demo — Wordlist Arcade', 'Try a ready-to-play photosynthesis vocabulary game.', '/demo');
      announceRoute('Demo: make vocabulary games');
      window.requestAnimationFrame(() => document.querySelector('#make')?.scrollIntoView());
      return;
    }
    renderGame('match');
    setRouteMeta('Demo — Wordlist Arcade', 'Try a ready-to-play photosynthesis vocabulary game.', '/demo');
    announceRoute('Demo: Match up');
    return;
  }
  renderHome(currentList.pairs.length ? currentList : undefined);
  setRouteMeta('Wordlist Arcade — vocabulary games for class', 'Make six vocabulary games for class from one word list.');
  announceRoute('Make six vocabulary games');
  if (legacyHash === 'make' || legacyHash === 'how') window.requestAnimationFrame(() => document.querySelector(`#${legacyHash}`)?.scrollIntoView());
}

window.addEventListener('hashchange', route);
window.addEventListener('popstate', route);
// This also covers document navigation (including browser Back) that bypasses
// popstate. A reload inside the demo simply re-seeds the shipped sample.
window.addEventListener('pagehide', () => {
  if (isDemo()) clearDemo();
});
window.addEventListener('online', () => updateOnlineStatus(true));
window.addEventListener('offline', () => updateOnlineStatus(false));
route();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const hadController = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.register('/sw.js').then(registration => {
      const offerUpdate = (worker: ServiceWorker | null) => {
        if (!worker) return;
        waitingWorker = worker;
        showUpdateToast();
      };
      offerUpdate(registration.waiting);
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          // `hadController` distinguishes a genuine update from the first
          // install. Use the registration's waiting worker, which is stable
          // after installation and can receive SKIP_WAITING.
          if (installing.state === 'installed' && hadController) offerUpdate(registration.waiting || installing);
        });
      });
    }).catch(() => undefined);
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloading) return;
      reloading = true;
      location.reload();
    });
  });
}
