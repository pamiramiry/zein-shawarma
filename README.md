# Zein Shawarma

A single-page site for a halal Lebanese shawarma counter on Lawrence Ave E in Scarborough, Ontario.

Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no dependencies. Open `index.html` through a local server and that is the whole thing.

> **Pre-launch.** Every price on the menu reads `$0.00 [verify]` and fifteen items have no photo, because those are still with the shop. The `[verify]` marker is deliberate: nothing on this site invents a number it has not been given. Prices, photos and a few open questions are the remaining work, and none of it is code.

## Running it

```bash
npx serve .
```

Then open the port it prints. **Do not open `index.html` directly from the filesystem**: autoplay policy and relative paths both behave differently on `file://`, so what you see will not be what ships.

## What is worth reading about

`DESIGN-RULES.md` is the locked design system and carries the reasoning behind each decision. A few things in here were more interesting than expected:

**The marquee engine.** The reels and the stats ticker are one continuously drifting band each, sharing a single `makeMarquee()` in `main.js`. The loop is seamless because the shift distance is **measured from the live layout** rather than assumed to be `50%`: a flex `gap` makes the two halves uneven, and a half-gap error shows up as a visible stutter once per lap. Speed is fixed in pixels per second, so adding videos changes how long a lap takes and never how fast things move.

**The reel band answers a finger.** Hold it and it tracks your thumb, let go and it coasts, then the drift picks up again from wherever you left it. That is why the reel band alone is positioned from a `requestAnimationFrame` loop rather than a CSS keyframe: a keyframe cannot be interrupted and resumed from an arbitrary offset, and native scroll cannot wrap an endless track without killing the fling at the seam. The ticker is untouched and still runs on the compositor. Past 8px of travel a touch counts as a drag and its click is swallowed, so a swipe never launches a video by accident.

**Cards arrive already playing.** Two `IntersectionObserver` rings sit outside the viewport, an outer one that buffers and an inner one that plays, so a card is never visible while still showing its poster. The concurrent-playback cap is sized to the viewport rather than hardcoded.

**Hours are computed in the shop's timezone**, not the visitor's. `HOURS` and `SPECIAL_HOURS` in `main.js` are the only place opening times are written down, and one dated entry moves the live status pill, the hours line, the note and a banner together. That exists because a halal kitchen changes hours completely for Ramadan, and a site confidently reporting **Open now** at a shut shop is worse than one that says nothing.

**Heavy media is conditional.** The hero clip is 4.97 MB. On `saveData` or a 2g connection the poster stands in and the video is never requested, taking a first visit from 5.22 MB to 0.07 MB. Reduced motion takes the same path.

**No `aggregateRating` in the structured data.** Tempting for rich snippets, and against Google's own policy when the ratings were collected from Google. The rating stays visible text.

**Accessibility is measured, not assumed.** Contrast is checked against the brightest pixel actually behind each glyph, sampled from real line boxes rather than element boxes, and across several frames of the hero video rather than one lucky screenshot. Both moving bands have pause controls per WCAG 2.2.2, and each duplicated track is hidden from assistive tech with a plain-text equivalent alongside.

## Layout

```
index.html      one page, all sections
styles.css      design tokens at the top, then sections in document order
main.js         REELS array at the top; edit that to change the videos
DESIGN-RULES.md the locked design system, read before changing anything
404.html
```

The videos are declared in a single `REELS` array. Array order is display order, `off: true` parks a clip, and a file that fails to load degrades to a styled placeholder rather than a black square. Changing the reels needs no HTML or CSS edits.

## Licence

None. All rights reserved. This is client work, published for reference.
