# Wordlist Arcade visual thesis

## Direction: generative geometry, made for the classroom

Wordlist Arcade turns one tidy list into six different ways to play. The visual
system makes that transformation visible: words are small paper-like tiles that
move through a geometric "game machine" and emerge as six distinct shapes. It
feels inventive and energetic without looking like a casino, a toy ad, or a
generic education dashboard. Decoration always explains transformation,
matching, sequencing, or progress.

The interface uses a deliberately light treatment. A dark theme would make a
projected classroom screen harsher and reduce the paper-and-marker character;
the warm, explicitly painted background is the product's single-mode thesis.

## Palette

The colors come from a classroom table: warm exercise-book paper, black marker,
blue counting blocks, tomato-red correction pencil, green answer ticks, and
yellow sticky notes.

| Token | Value | Role |
| --- | --- | --- |
| Paper | `#F7F2E8` | page background |
| Chalk | `#FFFCF5` | raised surfaces |
| Ink | `#17211B` | primary text and outlines |
| Graphite | `#526058` | secondary text |
| Cobalt | `#1746A2` | primary actions and focus |
| Cobalt dark | `#103477` | pressed actions |
| Tomato | `#C83B2D` | emphasis and errors |
| Sprout | `#18794E` | success |
| Mustard | `#F3BF3B` | selected/playful accent |
| Lavender | `#D9D3F8` | supporting geometry |

Ink-on-paper and graphite-on-paper meet WCAG AA for body text. Cobalt and
tomato are used with white only at sufficiently dark values. State is always
reinforced with labels, symbols, or shape rather than color alone.

## Typography

- Display: `Arial Rounded MT Bold`, `Trebuchet MS`, system sans-serif. Rounded,
  sturdy counters echo word tiles and remain legible from the back of a room.
- Utility/body: `Atkinson Hyperlegible`, `Verdana`, system sans-serif. The
  system fallback avoids a font download and prioritizes letter distinction for
  language learners.
- Scale: 16px body; 18px lead; 21px section title; 28px game title; fluid
  40–68px hero. Line-height is 1.5 for prose and 1.05–1.2 for display.

No third-party or runtime fonts are loaded.

## Spacing and shape

- Base rhythm: 4px; primary steps: 8, 12, 16, 24, 32, 48, 72px.
- Content max width: 1180px; reading measure: 68ch.
- Corners are purposeful: 10px on controls, 18px on independent game tiles,
  irregular clipped polygons only in decorative/game geometry.
- Outlines are 2px ink lines with crisp 3–5px offset shadows, like stacked
  classroom cards rather than floating SaaS glass.
- Targets are at least 44×44px, with 8px separation.

## Interaction grammar

The maker follows one obvious path: paste → check the parsed pairs → choose a
game → play/share. The editor and game shelf sit together, so generation feels
instant. Every game shares a stable top bar and progress language while its
play surface uses a different geometric rule:

1. Match up: paired capsules and connecting selection.
2. Word strike: a six-cell target field.
3. Anagram: draggable-looking letter tiles operated by buttons/keyboard.
4. Word reveal: a segmented word rail with letter guesses.
5. Memory: a strict tile grid and paired symbols.
6. Quiz race: two geometric lanes, one for progress and one for the current
   multiple-choice turn.

Primary buttons compress by 2px on press. Correct answers lock into place with
a short scale/opacity confirmation; incorrect answers use a small lateral nudge
and a plain-language message. Shared links use the URL hash and never contact a
server.

## Motion policy

- UI transitions: 160–240ms, transform and opacity only.
- Tiles enter from the location that created them; progress moves along a
  visible track; nothing animates indefinitely.
- `prefers-reduced-motion: reduce` removes translation, scale, smooth scroll,
  and celebration motion while preserving instant opacity/state changes.

## Responsive intent

At 390px the maker becomes one column, game descriptions shorten, the editor
actions stack, and the decorative hero machine moves behind the heading as a
quiet watermark. During play, supporting copy is dropped, grids use two or
three columns, and the action bar remains in normal flow so it never covers the
game or a phone safe area. Fullscreen is available when supported, but is never
required.

## Asset plan and provenance

The hero asset is an original, AI-generated editorial still of the geometric
word machine. It provides the visual metaphor once; all game controls and icons
are authored in HTML/CSS/SVG for crispness and accessibility.

- File: `public/assets/word-machine.webp` (responsive source also exported as
  `word-machine-640.webp`).
- Social preview: `public/assets/word-machine-social.jpg` is a 1200×630 crop
  composed locally from the original hero image. It uses no new third-party
  artwork and supplies Open Graph and Twitter previews.
- Source and prompt: `assets/src/word-machine.png` and
  `assets/src/word-machine.prompt.json`.
- Generator: Azure AI Foundry factory image deployment via
  `/opt/fleet/lib/gen-image.sh`.
- Generation date: 2026-08-27.
- License/provenance: original generated imagery created for Wordlist Arcade;
  no real people, brands, copyrighted characters, or source images.

### Prompt sheet

Use case: stylized-concept. Asset type: wide landing-page hero illustration.
Scene: a small tabletop arcade machine assembled from precise educational
geometry, where blank cream word cards enter on the left and emerge as six
different playful geometric game paths. Subject: abstract cobalt ramps,
tomato-red paddles, mustard discs, green tracks, lavender arches, paper word
tiles with abstract non-letter marks. Medium: tactile cut-paper and painted wood
editorial still life, subtle grain, crisp edges, handmade but meticulously
composed. Composition: landscape 3:2, isometric three-quarter view, machine
weighted to the right with breathable warm-paper negative space on the left.
Light: soft north-window studio light, gentle grounded shadows, cheerful and
calm. Palette: exercise-book cream, ink black, cobalt blue, tomato red, sprout
green, mustard yellow, pale lavender. Lens: 50mm equivalent, high detail.
Avoid: readable text, letters, numbers, logos, watermarks, real people, hands,
screenshots, neon glow, glossy 3D plastic, casino imagery, clutter, gradients.

The site footer discloses that the hero illustration is AI-generated.

The install icons are original derivatives of the existing hand-authored
Wordlist Arcade mark, rasterized locally from `public/icons/pwa-icon.svg` into
the required 192px and 512px PNG files. They use the palette above and retain a
warm-paper safe zone for Android maskable icon cropping; no third-party artwork
or runtime icon service is used.
