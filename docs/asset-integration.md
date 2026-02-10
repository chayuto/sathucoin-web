# Asset Integration Task

## Context

The SaThuCoin contract repo contains brand assets that need to be integrated into the web frontend. The frontend is currently functional but uses no images. This task adds visual branding to make the site feel polished and trustworthy for Thai donors and institutions.

## Source Assets

Copy these from the contract repo (`assets/images/`) into `public/assets/` in this repo:

| File | Purpose |
|------|---------|
| `sathu_banner.png` | Hero banner for the landing page |
| `sathu_coin.png` | Token icon used in headers, MetaMask prompt, and favicon |
| `sathu_mascot.png` | Mascot character for friendly visual accents |

## Where to Use Each Asset

### sathu_banner.png -- Landing Page Hero

- **File:** `src/pages/Home.jsx`
- Place as a background or inline image in the hero section, above or behind the tagline
- Should be responsive: full-width on mobile, constrained to `max-w-6xl` on desktop
- Keep text readable over the image (use an overlay or place text below)
- Alt text: use the i18n key `home.hero_tagline`

### sathu_coin.png -- Token Icon

Use in these locations:

1. **Navbar brand** (`src/components/Navbar.jsx`) -- small icon (24x24 or 32x32) next to the "SaThuCoin" text
2. **Stats cards** (`src/pages/Home.jsx`, `src/pages/Stats.jsx`) -- beside SATHU amounts to reinforce the token identity
3. **Add to MetaMask section** (`src/pages/Donors.jsx`) -- beside the "Add to MetaMask" heading
4. **Favicon** -- replace the default Vite favicon in `index.html`. Create a 32x32 and 180x180 version if the source is large enough:
   - `<link rel="icon" type="image/png" href="/sathucoin-web/assets/sathu_coin.png" />`
   - `<link rel="apple-touch-icon" href="/sathucoin-web/assets/sathu_coin.png" />`

### sathu_mascot.png -- Friendly Visual Accents

Use sparingly for warmth:

1. **Empty states** -- when DeedList has no results, show the mascot with the "no deeds found" message
2. **Wallet setup guide** (`src/pages/Donors.jsx`) -- beside the step-by-step instructions to make it feel approachable
3. **About page** (`src/pages/About.jsx`) -- in the mission section

## Design Guidelines

- **Color palette:** Base blue `#0052FF` as primary, gold `#F5A623` as accent. These are already defined in `src/index.css` as `--color-base-blue` and `--color-sathu-gold`.
- **Image sizing:** Use Tailwind utility classes (`w-8 h-8`, `max-w-md`, etc.). No inline pixel widths.
- **Responsive:** All images must work on mobile (320px) through desktop (1280px). Use `object-contain` or `object-cover` as appropriate.
- **Performance:** Add `loading="lazy"` to images below the fold. The hero banner should load eagerly.
- **Alt text:** Every `<img>` must have meaningful alt text using i18n translation keys, not hardcoded English.
- **No emojis** in any text or alt attributes.
- **Base path:** All asset references must use the Vite base path. Use `import.meta.env.BASE_URL + "assets/filename.png"` or relative paths from `public/`.

## File Structure After Integration

```
public/
  assets/
    sathu_banner.png
    sathu_coin.png
    sathu_mascot.png
```

## i18n Keys to Add

Add these keys to both `src/i18n/locales/en.json` and `src/i18n/locales/th.json`:

```json
{
  "common": {
    "alt_banner": "SaThuCoin banner",
    "alt_token_icon": "SATHU token icon",
    "alt_mascot": "SaThuCoin mascot"
  }
}
```

Thai translations:

```json
{
  "common": {
    "alt_banner": "แบนเนอร์สาธุคอยน์",
    "alt_token_icon": "ไอคอนโทเคน SATHU",
    "alt_mascot": "มาสคอตสาธุคอยน์"
  }
}
```

## Verification

After integration:

1. `npm run build` passes without errors
2. `npm run lint` passes without errors
3. All existing tests still pass (`npm run test`)
4. Hero banner displays correctly on mobile and desktop
5. Token icon appears in navbar, stats, and as favicon
6. Mascot appears in empty states and guide sections
7. All images have alt text that changes when switching EN/TH
8. No broken image links when served from `/sathucoin-web/` base path
