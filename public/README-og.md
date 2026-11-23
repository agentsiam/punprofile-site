# og.png and og-en.png, the social share cards

1200x630 each, served straight out of `public/`. `og.png` is the Thai card and
is referenced from `metadata.openGraph` in `src/app/(th)/layout.tsx`; `og-en.png`
is the English one and is referenced the same way from `src/app/(en)/layout.tsx`.
Added 16/08/2026, after a link posted into the Facebook group rendered as a bare
URL.

**The path changed later the same day**, when the `/en` tree split the root
layout into three. See `AGENTS.md` § Routing. Everything below describes the Thai
card; the English one is the same card and the section at the end of this part
says what differs.

## What is on it, and why

**The card is PunProfile, not EU Fit Check.** Paul's call, 16/08/2026, replacing
a first version that led on the assessment. A shared link is the business
introducing itself, and the assessment is one feature of an app that is still
growing, so a card built around it goes stale as the app does.

- **Lime**, `primary` (#9FE870), flat, with the green-black `ink-deep`
  (#163300) as every text colour on it. This is the pairing `design-system.md` calls
  the brand. It is also the one colour a Facebook or LINE feed does not already
  have, and a column of white cards and grey chrome is where this image has to
  compete. Blue is EU Fit Check's identity and would say the wrong thing on a
  card for the business. Olive was this card's colour until the wise template
  replaced it, and it is not in the token file any more.

  **Hierarchy is size and weight, never opacity.** Eyebrow, headline and lead
  are all solid `ink-deep`, separated by 25/56/27px and by weight. Faded text is
  what made the olive card read washed, and on lime there is no second ink worth
  having: #163300 on #9FE870 measures **9.45:1**, AAA, and anything lighter
  spends that for nothing.

  **The chips carry the card's black.** Solid `ink-deep` pills with lime type,
  also 9.45:1. The olive card outlined them in a hairline that vanished below
  about 400px wide, which is the width a link card is actually drawn at. They
  are also the only near-black on the card: without them every value on it sat
  in one narrow band, which is most of why it read dull.

  **The lift is on the right, not on the base.** White at 42% is pooled in a
  radial behind the cutout, where nothing has to stay readable. Measured on the
  shipped pixels the ground there is #A5E979, and every text block to its left
  sits on a clean #9FE870.

- **The dark lockup**, `punprofile-logo.svg`, because the ground is light now,
  so the brand is legible at thumbnail size before anything else is read. It was
  a PNG wordmark until 16/08/2026, and the reversed lockup until the ground
  became lime. The SVG carries its own COACHING sublabel; do not set a second
  one under it.
- **The coaching hook**, `HOOK_EYEBROW`, `HOOK_LINE_1` and `HOOK_LINE_2` from
  `coaching.ts`, which are Paul's own Thai. The first sentence is set large and
  the second smaller: same size for both orphaned a word and gave the card four
  heading lines to read at thumbnail size.

  **Every Thai line break is hand-set with `<br>`, none is left to the browser.**
  Chrome breaks Thai on its own dictionary and gets compounds wrong: left to it,
  `ตั้งเป้า` split across two lines. A measure in `ch` is not a safeguard
  against that, it is what hands the decision to the dictionary.
- **The three service names** from `services.ts`, as chips.
- **A clay cutout from the cast**, `/home/service-direction.png`, the one the
  home page already uses, bled to the bottom edge with a soft ellipse under it
  so it stands on the card rather than floating. `Brand_Guidelines.md` puts
  social headers in the clay family, and says in as many words that the mascot
  stays flat and that there is no clay or 3D mascot. The 3D clay "P" this card
  carried until now is the thing that rule names.

  The cutout is transparent, so the rule about art on a lime band taking a pale
  tint does not bite: there is no second ground to disappear into. A clay scene
  with its own pale tint would need a different layout, not this one.

If any of those strings change, this image is stale. It is not generated from
them, only copied.

## The English card

`og-en.png` is the same card carrying the English members of the same strings:
`HOOK_EYEBROW`, `HOOK_LINE_1` and `HOOK_LINE_2` from `coaching.ts`, and the three
service names from `services.ts`. Nothing about it is decided here. It is the
Thai card's layout with the English copy the repo already ships.

Latin is set in Inter, which `globals.css` puts first in both font stacks, and
its line breaks are hand-set with `<br>` as well. Not for the dictionary reason,
which is Thai's: for the shape of the block, which is a decision and not the
browser's to make at whatever width the column happens to be.

**The headline is 52px, not 56px.** English needs more characters to say what the
Thai headline says, and at 56px its second line runs into the cutout. Everything
else is the Thai card's: left margin 64, the lockup at 58px, eyebrow 25px, lead
27px, chips 43px tall, the cutout 364px wide bled to the bottom edge with its
soft ellipse, and the lift behind it. Both cards put the figure at x 780 to 1143
and y 46 to the bottom edge.

Measured on the shipped pixels, eyebrow, headline and lead all sit on a clean
#9FE870 and the chips on their own `ink-deep`: 9.45:1 for all four, the same as
the Thai card. The lift reaches no text block.

## Which page gets which card

`siteCard(locale)` in `src/lib/seo.ts` answers that, and it is the only place
that answers it. Both root layouts take their image from `SITE_CARD` and
`SITE_CARD_EN`, and `pageMetadata` falls back to whichever the page's own locale
asks for.

**It has to be decided there, not left to the tree.** Next merges metadata
shallowly, so a page that sets its own `openGraph` replaces the root layout's
whole `openGraph`, image included. Nothing is inherited from the tree a page
sits in. Repointing the English layout at `og-en.png` on 16/11/2026 therefore
fixed `/en` alone, and the eleven English pages behind it went on serving the
Thai card until `pageMetadata` was given the same answer later that day.

A blog post overrides both, with its own card from `shareCard(post)`. That is
the one case where the site card is the wrong answer and is meant to lose.

Deliberately not a screenshot of the result screen: at thumbnail size a radar
chart is an unreadable smudge, and a real-looking set of scores on a share card
invites the reading that they are somebody's.

## Rebuilding it

There is no build step, on purpose: it changes when someone decides it should.
The source is a throwaway HTML file rendered in a browser at 1200x630, because
that is the only way to get real Anuphan shaping with correct Thai tone-mark
placement.

1. Write the card as a standalone HTML file into `public/` as `_og-build.html`
   (tokens copied from `tokens.generated.css`, fonts from Google Fonts, images by
   absolute path so `/punprofile-logo.svg` and the cutout resolve). Add a strip
   of calibration patches below the card, 200px each, in colours whose true
   values are known: black, `primary`, `primary-active`, `ink-deep`, `ink`,
   white. Serving `public/` with `python3 -m http.server 3100` is enough; the
   card is static and does not need the Next dev server.
2. Capture it with **headless Chrome**, not with a screenshot of a visible
   window:

   ```
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
     --window-size=1200,690 --virtual-time-budget=6000 \
     --screenshot=raw.png http://localhost:3100/_og-build.html
   ```

3. **Check the patches, then crop.** This is where the process changed on
   16/08/2026, and the change is worth understanding rather than just following.

   The previous method screenshotted a visible browser window, and that capture
   came back in the display's colour space and was re-encoded as sRGB without
   conversion: a flat `primary` arrived with its red channel lifted by about
   fifty, greys untouched, saturated colours quietly duller. The fix was a 3x3
   matrix in linear light fitted from the six patches, and it was mandatory and
   invisible if skipped.

   **Headless Chrome does not do this.** Measured on 16/08/2026, all six patches
   came back byte-exact, every channel, zero error. So the correction step is
   gone. The patches stay, as the check that proves it is still true. If any
   patch is off by more than a unit, something about the capture has changed and
   the old matrix fit is in this file's git history.

   `scripts/lib/og-correct.py`, which fitted and applied that matrix, was
   deleted in the same change. It is in git history if the capture method ever
   goes back to screenshotting a visible window.

   Capturing at `--force-device-scale-factor=1` also matters: the browser
   extension's screenshot runs at DPR 2 and is returned downscaled as JPEG,
   which would mean building a 1200x630 deliverable out of a resampled lossy
   image.
4. Crop to `(0, 0, 1200, 630)`. No resize is needed; the capture is already at
   the right scale.
5. **Measure the contrast on the cropped pixels, not on the CSS.** Sample the
   ground under each text block and compute against the text colour actually
   used. Take the modal colour across the block rather than one pixel: a single
   sample lands on a glyph as often as on the ground, and reads as a failure
   that is not there. The shipped card measures 9.45:1 for eyebrow, headline,
   lead and chips alike, all clearing AAA.
6. Delete `_og-build.html`. It must not stay in `public/`: a copy of the palette
   that nothing generates is exactly what `AGENTS.md` forbids, and this one
   would be served publicly as well.

## After changing it

Facebook caches aggressively and will keep serving the old card. Re-scrape at
`developers.facebook.com/tools/debug/` with the production URL, and change the
filename if a cache refuses to clear.
