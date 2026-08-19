# DESIGN-RULES.md: Zein Shawarma

**Read this file first in every session on this project. Never re-introduce anything on the avoid-list.**

The reference is a [merlin-site.com](https://www.merlin-site.com/) build: an Instagram profile that grew into a website. Not a brochure. The page is one mobile-shaped scroll where **vertical video is the spine**, everything is thumb-reachable, and the fastest path is always "order".

The mood is a **charcoal spit at night**, handled with restraint: near-black room, one flame accent, warm paper white. Assured, not loud. Think a well-run counter with a real designer, not a fine-dining room and not a startup landing page.

## The governing rule

**Restraint is the brand.** The failure mode this page was rebuilt to escape is the AI-landing-page look: glowing shadows, gradient-filled buttons, accent colour on every element, big pill radii, and a shouty display face. If a change adds glow, gradient, saturation or roundness, it is almost certainly wrong.

## Token system (CSS custom properties, use these exclusively)

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B0B0C` | page base |
| `--coal` | `#121214` | raised surface |
| `--coal-2` | `#191A1C` | hover fill |
| `--line` | `#232426` | hairline |
| `--line-2` | `#33353A` | hairline, emphasised |
| `--ember` | `#D62F44` | the accent, on fills. used sparingly, on purpose |
| `--ember-ink` | `#EE4358` | the storefront sign red. text, rules, focus rings |
| `--paper` | `#F1EDE6` | primary text |
| `--smoke` | `#8D8A84` | secondary text |
| `--faint` | `#5A5854` | tertiary text, fine print, the `[verify]` marker |
| `--flame` | `#D9862B` | the amber off their halal badge. status dot and eyebrow rule only, always at hairline scale |

**One warm colour, at hairline scale.** Every other warm pixel on this page comes from the food photography: `--flame` is the only warmth the design itself contributes, and it is taken off the amber flame in the halal badge on their own storefront sign. It replaced `--open: #5BAE7F`, a stock UI green that appeared nowhere in this brand. On a charcoal spit an ember dot reads "the grill is on" better than a generic green, and the words beside it always state the actual status, so the colour never carries the meaning.

**It lives on exactly two things: the live status dot, and the 60x1px rule after each eyebrow.** Put it on a button, a border, a price or a heading and it becomes a second accent, which breaks the three-things-per-screen rule and undoes the restraint the whole page is built on.

Radius scale: `--r-lg: 14px` (media), `--r-md: 8px` (cards), `--r-sm: 5px` (buttons, chips). Nothing else. **No 999px pills.**

**Type**
- Display: **Bitter** 600, with 400 reserved for running text. Hero h1, section h2, stat numerals, the wordmark, the hours heading, the review quotes. A **slab** serif: squared off and low contrast, so it reads sturdy rather than refined. It replaced Instrument Serif, which was elegant but pitched the page at fine dining. This is a counter shop.
- **Keeping a serif is the point.** The specific face is negotiable; dropping to a sans is not. Sans headings on a dark page is what every generic template does, and the serif is a large part of what keeps this one off that pile.
- **Weights:** 600 for headings, numerals and the wordmark. **400 for the review quotes**, which are five-line paragraphs: a slab at 600 over that length reads shouted rather than quoted. Nothing uses italic.
- Bitter sets far wider than the old face, so **the scale came down with it**: hero h1 `clamp(40px,8.8vw,76px)`, section h2 `clamp(25px,4.3vw,44px)`, measure widened to `43ch`. A slab at 600 carries more presence per pixel, so it needs fewer of them. Do not restore the old sizes.
- Body and UI: **Archivo** 400/500/600. Everything else.
- Two families only. Google Fonts, `font-display: swap`, system fallbacks. No third family, no Inter.
- Small caps labels (11px, `.2em` tracking, uppercase) carry hierarchy instead of colour or weight. This is the structural device of the page.

## Vertical rhythm: the padding lands twice

`.sec` padding applies to the top **and** the bottom, so between any two sections you get the value doubled. At the original `clamp(64px,10vw,120px)` that was **251px of empty black at desktop, 28% of a viewport, three times down the page**. It is `clamp(52px,5.4vw,72px)` now, giving 149px between sections, and the page lost 475px of nothing.

**Measure the gap, not the padding**, and measure it as a percentage of the viewport. Anything past about 20% of a screen reads as the page having stopped.

Nothing on the page is centred. The "Order online" button used to be, via `margin: 28px auto 0` on `.btn--block`, and it was the only centred element anywhere. If something looks stranded, the fix is its width, not its alignment.

## Hours are one line, not seven rows

The hours table printed the identical string seven times, because every entry in the `HOURS` / `SPECIAL_HOURS` model applies one label to all seven days. A per-day table could only ever repeat itself.

It is now `EVERY DAY` over the times set large in the display face, which also gives the hours column a focal point instead of a wall of small text. Under it sit the practical visit facts (parking, service, payment) as hairline rows, which is what balances that column against the map now the table is gone. Somebody checking when the shop opens is the same person wondering whether they can park.

If the shop ever does keep different hours on different days, the model has to change first: bring the table back then, not before.

## The menu has to sell food

`.item__thumb` is **84px**, not the 52px it started at. 52px is smaller than a favicon at 2x, and this is the one section of a food site whose job is to make somebody hungry. It sits directly under a marquee of full-bleed video, so anything undersized there reads as an afterthought.

Items with no photo get a hairline and a small spit mark rather than a flat dead square, the same honesty device the empty reel tile uses. **Fifteen items still have no photo at all**, which is the real fix and needs the owner.

## The two signature elements (the fingerprints. Keep these, keep everything else quiet)

1. **The 9:16 media card.** One object repeated at three scales: hero, marquee card, menu thumb. Always `aspect-ratio: 9/16`, always `--r-lg`, always a hairline border that firms up on hover. This repetition is what makes the page read as a profile rather than a template.
2. **The hairline.** Structure comes from 1px rules in `--line`, never from filled boxes: section tops, menu rows, stat columns, the strip dividers, the hero meta rule. Cards with backgrounds are the exception, not the default.

## Avoid-list (this is what makes sites look AI-generated. Never do these)

- **No glow.** No coloured `box-shadow`, ever. That single effect is the strongest tell.
- **No gradient fills on buttons, chips or the dock.** Flat colour only. Gradients are for photographic scrims and nothing else.
- **No large radii.** Nothing above 14px, and that is reserved for media.
- Accent colour appears on roughly three things per screen. If ember is on the eyebrow, the price, the dot, the border and the icon at once, strip it back.
- No em dashes or en dashes anywhere: copy, comments, docs. Use colons or full stops.
- No purple/blue gradients, no glassmorphism, no blurred blobs.
- No emoji in headings.
- No generic three-icon feature row ("Fresh Ingredients / Fast Service / Great Taste").
- No "01 / 02 / 03" numbered cards.
- No hotlinked stock photos. Missing media renders as a styled empty 9:16 tile, never a broken element.
- No menu photo that shows a different item than the one it labels. A chicken crop next to "Beef Shawarma Wrap" is a lie; the placeholder is honest.
- No fabricated review quotes and no testimonials with invented names. Ratings are cited as numbers with a source link.
- No claim the reviews do not evidence. "Scarborough's best" is not ours to write.
- No light or cream page background. Video needs the dark room.
- No Instagram embed script. All media is self-hosted.

## Two moving bands, and the rule that keeps them apart

The page has exactly two: the **video reel** (media cards) and the **stats ticker** (text). They share one engine, `makeMarquee(box, track, opts)` in `main.js`, and coexist only because they are deliberately different species:

| | Video reel | Stats ticker |
|---|---|---|
| Content | 9:16 media cards | text, no surface |
| Speed | 42 px/s | 22 px/s |
| Direction | leftward | rightward (`.is-reverse`) |
| Position | above the menu | below the menu |

**Never add a third, and never make the ticker a card carousel.** Two card carousels of the same size and shape compete directly and read as busy. The whole reason a text band works alongside a video band is that it does not look like one.

**They must never be on screen together.** Verified at 390 / 1440 / 1280x1600: zero overlapping scroll positions, minimum 1220px apart. If a future section is added between them, re-check this. Each band also self-pauses when its own box leaves the viewport, and each owns its own hold set, so hovering one never touches the other.

## Removed: the highlight circles

The row of six circular story bubbles between the action strip and the reels was **removed 2026-08-16 at the client's request**. It was the most literal borrowing from the Instagram-profile reference: circles labelled Chicken, Wraps, Platters, Burgers, Dessert, Toum, each deep-linking to a menu tab.

**Do not put it back without being asked.** Two reasons it is not missed:

- It was **duplicate navigation**. The action strip sits directly above it and the menu tabs sit directly below, so it was a third route to the same six panels.
- The page has since grown a real identity of its own: the logo, the sign red, the reels marquee, the stats band. It no longer needs to quote Instagram's furniture to read as a profile.

The `.strip` already carried its own `border-bottom`, so nothing was left with a missing or doubled rule. The six crops still sit unused in `assets/img/highlights/`, which is not committed.

## The reel marquee

Videos are a **continuously drifting marquee, never a stacked grid and never a stepping carousel**. It never comes to rest: cards slide off the left edge and reappear on the right, forever. Stepping between slides reads as a widget; constant drift reads as a band of atmosphere, which is the whole point.

**How the loop is seamless.** The track holds enough duplicate copies of the card set to cover the viewport at least twice, then a `linear infinite` animation slides it left by exactly one copy and restarts. Copy 2 sits precisely where copy 1 began, so the restart is invisible.

- `--shift` is **measured from the live layout** in JS (first card to its twin in the next copy), never assumed to be `50%`. A flex `gap` makes the two halves uneven, and a half-gap error shows up as a visible stutter once a lap.
- Speed is constant in **pixels per second** (`PX_PER_SEC`, currently 42), and the duration is derived from the shift. Adding or removing videos changes how long a lap takes, never how fast things move.
- Copies are appended in a loop until the track covers `2x` the viewport, so an ultrawide screen gets more copies automatically. Re-measure on resize and after fonts load, or the width is taken before layout settles.
- The marquee is **full-bleed** (`margin-left: calc(50% - 50vw)`). A marquee that stops at a container edge looks like a bug.
- The edge `mask-image` is what sells cards entering and leaving rather than being abruptly clipped. Do not remove it.
- All cards sit at full opacity. There is no "active" card: with nothing at rest, singling one out means nothing.

### Pausing

The drift runs only when **every** hold is clear. Any single hold parks it exactly where it stands, by toggling `animation-play-state`, so nothing jumps.

| Hold | Set by | Cleared by |
|---|---|---|
| `hover` | pointer enters the marquee | pointer leaves |
| `touch` | `pointerdown` | 4 seconds after the last one |
| `viewer` | fullscreen player opens | it closes |
| `tab` | tab goes to the background | it comes back |

It also stops when the marquee scrolls off screen, and never starts under `prefers-reduced-motion`, where the track becomes a plain scrollable row with no duplicates.

### Why the track is `aria-hidden`

The duplicate copies would read the same six captions two or three times to a screen reader, and a card whose position is animating cannot be scrolled into view on focus because the marquee is `overflow: hidden`. So the cards are `tabindex="-1"` and the track is hidden from assistive tech, with the **"Play the videos" button** in the section head as the equivalent accessible path: it opens the same clips in the player, which has real keyboard navigation (arrows, Esc, focus return). Remove that button and the videos become mouse-only. Do not.

**The pause control is not optional.** WCAG 2.2.2 requires a way to stop motion that auto-starts and runs beyond five seconds. Hover covers mouse users and nobody else. It hides itself under reduced motion, where there is no motion to stop.

### Cards must arrive already playing

A card that slides in showing a still poster and then starts is the one thing that makes the marquee look cheap. Two mechanisms keep that from happening, and both matter:

1. **Two observer rings, both outside the visible area.** The outer ring (`460px`) flips `preload` to `auto` and calls `load()` so the file is buffered well ahead. The inner ring (`220px`, `threshold: 0`) calls `play()`. At 42px/s that is roughly 11 seconds of buffer lead and 5 seconds of playback lead.
2. **`MAX_PLAYING` is tuned to the viewport in `tuneCap()`**, not fixed. It was hardcoded at 4 while a 1440px screen shows 6 to 7 cards, so two or three visible cards sat frozen at all times. It is now `cardsOnScreen + 3`, clamped to 12.

When the cap does bind, the free slot goes to whichever queued video is **closest to the middle of the screen**, not whichever queued first.

Measured cost: the drift animation itself is free (identical frame rate running or parked, since it is a composited transform). Going from 1 clip to 7 cost 3fps under software decoding, and real hardware decodes on the GPU.

## Where the red comes from

The accent was originally `#C8442A`, a warm brick invented for the site. **It is now taken off the storefront sign**, which is the version of the brand customers actually stand in front of on Lawrence.

- `--ember-ink` **is** the sign red, `#EE4358`, a pink-leaning crimson. It carries text, rules and focus rings, and measures 5.23 on `--ink`.
- `--ember` is that same hue dropped in lightness to `#D62F44`, because **the sign red itself only reaches 3.81 under white text** and fails AA on a button. Fills use it, and white on it measures 4.83.
- Button text moved from the old warm off-white `#FFF6F2` to pure `#FFF`. That off-white was tuned to a brick-orange accent and costs about 0.35 of contrast against a red this pink.

**Three different reds exist in this project and only two of them are ours.** The sign is `#EE4358`. The logo PNG the shop supplied is `#FA0001`, a flat pure red that does not match their own sign. The site palette follows the sign. **Do not recolour the logo to match it**, and do not chase the logo file with the tokens: the mark keeps its own colour and the sign is the better reference.

What deliberately did **not** change: the type, the layout, the hairline structure, the serif wordmark, the charcoal room. The brief was to move toward the sign while keeping the site recognisably itself, and colour was the lever that does that without touching anything the shop already liked.

**The sign also says "MEDITERRANEAN FOOD", where the site says "Halal Lebanese".** Both are true and Lebanese is the more specific term, which is also what reviewers use, so the visible copy still says Lebanese. `Mediterranean` was added to `servesCuisine` in the JSON-LD so the structured data carries both. If the shop wants their own sign wording on the page, that is their call to make.

## The logo

The shop's mark is a shawarma spit whose carved face forms a `Z`. It appears in exactly two places, both times locked up with the type: the bar at **36px** and the footer at **46px**. Do not put it in the hero, where it would fight the `h1`, and do not scale it below 32px, where the carving detail turns to mush.

- **The mark keeps its own red.** It is roughly `#FA0001`, hotter than `--ember`. A logo is allowed to be itself. Do not recolour it to match the palette, and do not move `--ember` to match the logo: pure red fails AA under white button text.
- **The mark is decorative in markup** (`alt=""`). The anchor already carries `aria-label="Zein Shawarma"` and the wordmark text is right beside it. An `alt` here would make screen readers say the name three times.
- Always serve it at 3x the display height with `width`/`height` set, so it stays crisp and reserves its box before load.
- Source art arrived on a black square, not transparent. The keying method is recorded in the project's private media notes if it is ever re-exported.

### The bar has its own scrim now

The hero scrim runs bottom-up on narrow screens, so the **top** of the frame is unprotected and the bar sits on raw video. The `SHAWARMA` sub-label measured **3.04** there against 4.5 required. Two changes fixed it, and both need to stay:

1. `.bar::before`, a 120px top-down gradient that fades out once `.is-stuck` paints the bar solid.
2. The sub-label is full `--paper` **in the bar only**. Size and tracking carry the hierarchy instead of dimming, which is the same fix the hero kicker uses. The footer copy keeps `--smoke`: it sits on solid ink and measures 5.72 there.

Re-measure both if the hero clip is ever swapped, and **sample more than one frame**: a single screenshot can land on a dark moment and pass a check the rest of the clip fails.

## Quoting reviews

**`#proof` is one section holding both halves of the social proof**, merged 2026-08-15 from what used to be a separate `#proof` and `#says`. Two consecutive sections with near-identical heads ("What the record shows." then "What people actually wrote.") read as repetition, and each carried its own footer linking to Google.

The order inside it is deliberate: **numbers first, words second.**

1. One head: `Reputation` / **What the record shows.** It covers figures and quotes both.
2. The **stats ticker**, full-bleed. Fast credibility for someone who has just left the menu.
3. The **pause control immediately under the band**, using the same `.railfoot` pattern as the video reel. It used to sit at the very bottom of the section, which after the merge would have put it 600px away from the only thing it controls.
4. The **four quotes**, static, in the usual hairline grid. Quotes in the display face at **400**, attribution in small caps. No cards, no avatars, no quotation-mark glyphs.
5. **One foot**, one sentence, one link: "Four of more than 500 reviews. The full set, good and bad, is on Google."

**There is no sub-heading above the quotes and there should not be.** Every quote already carries a `GOOGLE, JULY 2026` attribution line, which says what they are. Adding a second eyebrow would rebuild the section head this merge exists to remove.

The quotes **never move on their own**, and the ticker's screen position did not change in the merge, so the two-bands separation still holds: re-verified at 390 / 1440 / 1920, zero overlapping scroll positions, minimum gap 1207px.

### Below 860px the quotes are a swipe track

Four stacked quotes make a very long column on a phone. Under the grid breakpoint `.says` becomes a horizontal scroll-snap track, one quote per view, with hairline dots underneath.

**This is not a third moving band and must never become one.** The distinction is the whole reason it is allowed: a marquee moves on a timer, this moves on a finger. **Do not add auto-advance, and do not add a timer of any kind.** If it ever animates by itself the page has three moving things and the two-bands rule is dead.

- The track is **native CSS scroll-snap**. It swipes with `main.js` deleted; the script only adds the dots. Build it that way round.
- **Dots count reachable scroll stops, not quotes.** At the grid breakpoint the track stops scrolling, the stop count drops to zero, and the dots remove themselves rather than sitting there dead.
- All four quotes stay in the DOM at every width. Nothing is hidden from a screen reader by the carousel; the track is a labelled, focusable `role="group"`.
- Slides are flex children with `margin-top:auto` on the attribution, so quotes of different lengths line their names up and the dots do not jump as you swipe.

- **Trim for length only.** Every word on the page is the reviewer's, in their order. A square-bracket substitution is allowed where a trim orphans a pronoun (`[a name]` for `he`), which is the standard convention and stays visibly an edit.
- **No stars.** Google gives Food / Service / Atmosphere sub-scores on these reviews, not the single overall star. Drawing five stars would be inventing a number, which is the same failure as the misattributed rating described in the content rules.
- **No `Review` or `aggregateRating` in the JSON-LD**, for the reason already in the content rules.
- **Nothing that names a competitor.** Several genuine reviews rank this shop against neighbouring businesses on the same block, some of them visible in the map embed. True, quotable, and still not something to publish on a neighbour's doorstep.
- **Do not name staff as fact anywhere outside a quote.** Reviewers give conflicting names for the person behind the counter, and disagree on who the owner is. Until the shop confirms, a name only appears inside quotation marks, attributed to the reviewer who wrote it.
- **The note under the quotes stays, and stays short.** "Four of more than 500 reviews" plus a link to the full set, good and bad. Four selected five-star quotes with no such line reads as a curated wall; the same four with it reads as an excerpt. That count and that one link are the whole job.

It briefly carried five source links and a "quoted as written and trimmed for length" clause. Both went: **the ticker items above already name their own source inline** ("4.8 on Google", "500+ Google reviews", "1.5K on Instagram"), so most of the list repeated what was already on screen, and Yelp backed no claim on the page at all. Five citation links on a shawarma shop's homepage reads like a footnoted paper, not a counter.

**This is not a licence to stop checking sources.** The rule below about attribution is about what ships, not about what is printed underneath it: never publish a figure whose source you have not verified. The working is kept in the project's private media notes. One ticker item, "2 TikTok features", has no inline source; its two creator handles are recorded there.

## The map

`#find` carries the **real Google Maps place embed** for Zein Shawarma, not a drawn stand-in. It replaced a hairline grid with a decorative pin, which was honest enough as a placeholder but told a visitor nothing about where the shop actually sits on Lawrence.

- **Do not filter or invert the iframe.** A `filter: invert()` would dark-mode the map to match the page, and it is a common trick, but it also recolours Google's own logo and attribution inside the frame, which their terms forbid. The map stays a bright rectangle in the dark room on purpose. If it ever needs softening, do it with the frame around it, never with a filter on it.
- `loading="lazy"` is load-bearing, not decoration. The embed pulls roughly 30 requests of Google script and tiles. Verified: **0 requests before the section is scrolled to**, 33 after. Never remove it, and never move the map above the fold.
- The iframe needs a `title`. It is the only description a screen reader gets, since the map contents are cross-origin.
- **The caption sits outside the frame.** The address line and the "Open in Google Maps" link live in a `<figcaption>` below it, because the iframe swallows pointer events and a link layered on top of a pannable map is unusable. The caption reads "Scarborough, ON M1R 2Y3" alone: the section `h2` already carries the street address, so repeating it there is noise.

## Hours are computed, and they are computed in Toronto

`HOURS` and `SPECIAL_HOURS` at the top of `main.js` are the **only** place opening times are written down. They drive the live chip, the hours table, the note under it and the banner, together.

- **Shop time, not device time.** The chip reads `America/Toronto` through `Intl.DateTimeFormat`. It used to read `new Date().getHours()`, which told a visitor in Vancouver at 21:30 that a shop shut since 00:30 Toronto was open.
- **`SPECIAL_HOURS` is not optional decoration.** A halal kitchen changes hours completely for Ramadan, and often closes or shortens for Eid. Regular hours left running through Ramadan is how a customer drives to a shut shop while the site says **Open now**. Add one dated entry and the chip, the table, the note and the banner all follow it.
- A close smaller than the open means the kitchen runs past midnight, which is the normal Ramadan shape. Verified at 16:00 to 02:00: open at 01:00, shut at 03:00.
- A closure is an entry with `open` and `close` identical and `label: 'Closed'`.
- The banner is **allowed the accent**, unlike almost everything else on this page. A changed opening time is the one thing here where missing it costs somebody a wasted trip.
- Prose elsewhere ("open to midnight every day", the meta description, the JSON-LD `opens`/`closes`) is static. For a long special period, edit those too. The banner is what carries it day to day.

## Heavy media is conditional

The hero clip is 4.97 MB and this audience is overwhelmingly a phone on mobile data.

- `heavyMediaOK()` in `main.js` returns false on `saveData`, on `2g` and `slow-2g`. The hero then paints its poster as a background and **never requests the video**: 5.22 MB becomes 0.07 MB. The poster is the clip's first frame, so it reads as paused, not broken.
- Reduced motion takes the same path. It used to build the video with `preload = 'metadata'`, which cost **19 MB across the rail**, because these MP4s were never re-encoded with faststart: their moov atom sits at the end and Chrome drags most of the file to read it. It is `preload = 'none'` now, and the poster is all a reduced-motion visitor ever sees anyway.
- **If the videos are ever re-encoded, add `-movflags +faststart`.** It is what makes `metadata` cheap and streaming start sooner.

## Large orders

`#trays` exists because group orders are the highest-ticket thing this shop sells and the site had no route to them at all.

The platter itself is **confirmed**: it is the hero clip, the parked `reel-01` family tray, and the item reviewers call the "beef and chicken family plate". Everything the shop has not confirmed is marked `[verify]` rather than guessed, **including whether phone is actually the right route**. Do not quietly fill those in.

The section routes to a **phone call, not the ordering app**. A tray is worth several regular tickets and is exactly the order worth taking commission-free.

## Motion rules

- Videos autoplay muted, start before they are visible, and pause once well clear of the viewport.
- One quiet scroll-reveal (opacity plus 12px rise), used on section entry only.
- Card hover firms the hairline border only. No glow, nothing bounces, nothing parallaxes.
- `prefers-reduced-motion: reduce` disables all autoplay and all reveals. Posters plus an explicit play button instead. This is a hard requirement, not a nicety.

## Accessibility invariants

- WCAG AA contrast, measured against the **brightest pixel** actually behind each glyph, not eyeballed. The hero was failing at 1.57 on mobile until the scrim was rebuilt; verify after any hero video swap.
- **Sample glyph rects, not element boxes.** `Range.getClientRects()` on the text node, never `element.getBoundingClientRect()`. An `h1` is block level, so its box spans the full hero width and picks up bright pixels far to the right of any letter. That mistake reported the hero `h1` at **1.68** on a line that actually measures **8.47**, and nearly bought a needlessly darkened scrim that would have buried the food. Sample **several timestamps** across the clip too, not one screenshot.
- The hero carries its own scrim, separate from the reel cards: bottom-up on narrow screens, left-to-right on wide ones so the food stays clear on the right.
- Never dim small text with opacity over video. The hero kicker is full `--paper` for exactly this reason.
- Text on `--ember` is near-white, never dark text on ember.
- One `<h1>`. Logical heading order.
- Reel tiles are real `<button>` elements: Enter opens, arrows move, Esc closes, focus returns to the tile that opened the viewer.
- Visible focus rings everywhere, skip link, `aria-label` on every icon-only control.
- The sticky mobile bar never overlaps the footer: the body carries matching bottom padding.

## The dock waits for the hero

The sticky mobile bar starts translated off screen and slides up only once the hero is behind you, measured from the hero's own height rather than a fixed pixel count so it stays correct as the viewport changes.

It is not decoration. **Over the hero the dock is the same two actions twice**: the hero already carries Order and Directions at full size, so the dock was covering 62px of the one frame whose whole job is to sell the food. Everywhere below the hero there is no other persistent call to action, which is exactly where it earns its space.

## Content rules

- Every unconfirmed price or fact ships as `[verify]`. Never quietly invent a number. **The menu no longer needs it**: prices came off the shop's own in-store board in August 2026, so the marker is down to a single row in Find Us. One `SPECIAL` marker now uses the same `.item__price em` slot the 21 `[verify]`s used to fill.
- **The board is the menu's source of truth, not the videos.** Burgers and Desserts had been read off the shop's own footage and were dropped once the board turned out not to list them: a menu offering something the kitchen will not make is worse than one that omits a special. Footage is evidence a dish exists, not evidence it is on sale.
- **Check what a number actually measures before attributing it.** An early build shipped a `9.4/10` rating in two places, credited to a directory that turned out to hold **zero** reviews for this shop. The number had come from a different site, as a bare score with no methodology and no review count. Both instances were replaced by figures the client confirmed directly. **A number plus the wrong source is worse than no number**, and this is the single most important content rule here.
- **Do not add `aggregateRating` to the JSON-LD.** Google's structured-data policy prohibits marking up ratings collected from Google itself, and self-serving rating markup risks a manual action. The 4.8 stays visible text only.
- Ratings and counts age. `4.8`, `500+` and `1.5K` are point-in-time snapshots, unlike the address or the hours. `1.5K` is deliberately rounded **down** from 1,536 so it stays true for a while.
- Verified facts: 1837 Lawrence Ave E, Scarborough ON M1R 2Y3. 647-295-4555. Daily 10:30 AM to 12:00 AM. @zein.shawarma. Certified halal. Lebanese-style.
- Primary CTA is always Order Online. Call and Directions are secondary, everywhere, on every screen.

## Headline: chosen plus alternates

- **Chosen:** "Off the spit, into the pita."
- Alt 1: "Lawrence Ave runs on this wrap."
- Alt 2: "Charcoal, garlic, and no shortcuts."

## Section headings: the voice, and why they are all short

The five `.sec__h2` lines are **Better shown than told.** / **Carved to order, all day.** / **What the record shows.** / **What people actually wrote.** / **1837 Lawrence Ave E**.

Three rules hold them together. Break any one and the new heading is the only thing on the page that looks wrong:

1. **Three to five words, concrete, full stop at the end.**
2. **About the food or the record, never about the website.** No heading points at itself or at the act of communicating. That is the line between a confident shop and a landing page.
3. **They all set to the same measure.** `.sec__head` is capped at `43ch` and `.sec__h2` is `clamp(25px,4.3vw,44px)`. Every heading is **one line** on narrow screens and **two** from about 1024px up. A new heading has to land in that range or it will be the only ragged one.

   **The set is not uniform at literally every width, and never was.** Tested at ten widths, the five headings split at **860px**, where the short address heading flips to two lines before the rest. The previous face split at **720 and 860**. Chasing perfect uniformity distorts the type scale for a band a few pixels wide, so the bar is: no heading overflows its box at any width, and the set is even at the common ones.

**Rejected, and worth recording so it is not re-proposed:** "We can show you better than we can tell you." At 44 characters it runs two lines on mobile and three or four on desktop, it is a stock restaurant-marketing phrase, and it is the only candidate that talks about the site instead of the shop. "Better shown than told." keeps the idea and the confidence at 23 characters, and measures 240px, right in the middle of the existing set.

The eyebrow above the reel stays **"From the shop"**: it carries the provenance, and the **"Play the videos"** button carries the instruction, so the heading is free to be a statement rather than a direction.
