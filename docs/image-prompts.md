# Image prompts for the new services

Style reference: the existing `servicio-gas.webp` and `servicio-hidrolavado.webp` (photorealistic, cinematic, close detail, no visible faces, warm golden-hour light, Pinamar pine forest and dunes).

## Shared specs

- Format: PNG or WebP, sRGB.
- Generate in portrait **2:3 (1024x1536)**. We crop to **4:5 (final 1122x1402)**, so keep the subject centered with margin on all sides.
- Palette to echo (do not paint it flat): deep forest green `#173f38`, pine green `#285f51`, sage `#7f9684`, warm cream `#f5f2eb`, golden sunlight.
- Never: readable text, logos, brand names, watermarks, visible faces, extra fingers, cartoon look.
- Suffix for every prompt: `photorealistic, cinematic natural light, shallow depth of field, 35mm, high detail, no text, no logos, no watermark`.

## 1. Required: `servicio-fumigaciones.webp` (hero of /servicios/fumigaciones/)

Professional pest-control technician, seen from behind or cropped at the shoulders (no face), in a clean white protective suit and half-face respirator, spraying along the base of a modern coastal house wall with a stainless-steel garden sprayer wand. Fine mist catching the golden low sun. Wooden deck, pine trunks and dune grass softly blurred in the background. Calm, careful, trustworthy mood.

## 2. Required: `servicio-jardineria.webp` (hero of /servicios/jardineria/)

Close low-angle view of a gardener's boots and a red push lawn mower cutting a bright green lawn in front of a modern coastal house with tall pines, fresh grass clippings flying, long stripes in the cut lawn, golden hour backlight, dune grass at the edge. No face visible. Orderly, cared-for, professional mood.

## 3. Optional: `servicio-poda.webp` (pruning section)

Hands in work gloves holding professional pruning shears cutting a branch of an ornamental shrub, a pine and a hedge softly blurred behind, clean cut leaves falling, morning light, coastal Argentina garden. No face visible.

## 4. Optional: `servicio-plagas.webp` (pest control section)

Macro-style, clean and tasteful: a technician's gloved hand placing a discreet bait station along a stone garden path beside a house foundation, dune grass and pine needles, soft golden light. No insects in focus, no gore, no fear imagery.

## 5. Required: `servicio-murcielagos.webp` (bat exclusion, fumigaciones page)

Dusk over a coastal pine forest: three or four bats flying out from under the roof eave of a modern wooden house, while a technician in a white protective suit, seen from behind on a ladder, installs a one-way exclusion net over the gap with a headlamp on. Deep pine green sky fading to warm orange, soft rim light on the roof edge. Respectful, non-violent mood, bats clearly visible and unharmed, no face visible.

Variant for the hero (if you want a single image for the page): same scene, but add the technician's sprayer backpack and a thin mist near the wall base, bats still flying out of the eave.

## Delivery

Send the links; I will crop to 4:5, convert to WebP (about 80% quality, under 200 KB), save as `apps/www/public/images/<name>.webp` and replace the temporary 3D captures.
