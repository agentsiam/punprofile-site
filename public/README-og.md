# og.png, the social share card

1200x630. Referenced from `metadata.openGraph` in `src/app/(th)/layout.tsx` and
served straight out of `public/`. Added 16/08/2026, after a link posted into the
Facebook group rendered as a bare URL.

**The path changed later the same day**, when the `/en` tree split the root
layout into three. The Thai tree's layout is the one that owns this card;
`src/app/(en)/layout.tsx` points at the same file and says why an English card
does not exist yet. See `AGENTS.md` § Routing.

## What is on it, and why

**The card is PunProfile, not EU Fit Check.** Paul's call, 16/08/2026, replacing
a first version that led on the assessment. A shared link is the business
introducing itself, and the assessment is one feature of an app that is still
growing, so a card built around it goes stale as the app does.

- **Lime**, `primary` (#9FE870), flat, with the green-black `ink-deep`
  (#163300) as every text colour on it. This is the pairing `design.md` calls
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
