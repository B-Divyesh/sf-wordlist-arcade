# Demo sandbox

Open <https://wordlist-arcade.sociobot.in/?demo=1> or `/demo` to start the
demo. It immediately opens a playable Match up game using six photosynthesis
word pairs from `EXAMPLE` in `src/core.ts`.

The persistent banner says “Demo — sample data, nothing is saved.” **Reset
demo** restores the sample. **Start for real** deletes demo keys and returns to
the normal maker.

Demo storage keys are `demo:wordlist-arcade-draft` and
`demo:wordlist-arcade-title`. Demo mode never reads or writes the real
`wordlist-arcade-*` keys. The service worker caches the demo shell, so the
offline claim is verified through this entry point after its first visit.
