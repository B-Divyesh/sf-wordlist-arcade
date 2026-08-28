# Demo sandbox

Open <https://wordlist-arcade.sociobot.in/?demo=1> or `/demo` to start the
demo. It immediately opens a playable Match up game using six photosynthesis
word pairs from `EXAMPLE` in `src/core.ts`.

The persistent banner says “Demo — sample data, nothing is saved.” **Reset
demo** restores the sample. **Start for real** deletes every demo key and
returns to the normal maker. Browser Back and other navigation away from the
demo also delete every demo key. The Back exit and Reset → play → Start for
real paths are covered by `@claim:demo-discard`.

Demo storage keys are `demo:wordlist-arcade-draft` and
`demo:wordlist-arcade-title`. Demo mode never reads or writes the real
`wordlist-arcade-*` keys. After the first visit, the service worker keeps the
demo, a saved real list, and a copied game link available offline. The offline
claim warms the real maker and shared game route, disables network access, and
checks both outcomes.

A class link opened while demo mode is active is restored only into those demo
keys. Returning to **Choose a game** keeps that shared sample list inside the
demo and never copies it into a real draft.
