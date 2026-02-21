# SaThuCoin Web

Read-only frontend for the SaThuCoin (SATHU) ERC-20 token on Base (chain 8453). Displays token stats, donor balance checking, and deed history from on-chain data.

## Tech Stack

- Vite 6 + React 19
- wagmi v2 + RainbowKit v2 + viem (wallet/contract reads)
- Tailwind CSS v4 (`@tailwindcss/vite` plugin, CSS-based config in `src/index.css`)
- recharts (charts)
- React Router DOM v7 (hash-based routing for GitHub Pages)
- TanStack React Query v5
- react-i18next (English + Thai)
- vitest + @testing-library/react

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Build to `dist/`
- `npm run lint` — ESLint flat config
- `npm run test` — Run vitest unit tests
- `npm run test:integration` — Run integration tests (requires live RPC)
- `npm run test:coverage` — Run tests with coverage report
- `npm run validate:i18n` — Check i18n key consistency between locales and source
- `npm run preview` — Preview production build

Always run `npm run lint` and `npm run test` before considering work done.

## Project Structure

```
src/
  abi/SaThuCoin.json    — Contract ABI (read-only subset)
  components/           — Reusable UI components
  components/__tests__/ — Component tests
  hooks/                — Custom hooks wrapping wagmi contract reads
  hooks/__tests__/      — Hook tests
  i18n/                 — i18next config + locale files (en.json, th.json)
  pages/                — Route pages (Home, Donors, Institutions, Stats, About)
  pages/__tests__/      — Page tests
  utils/                — Utility functions (formatAmount)
  utils/__tests__/      — Utility tests
  test/setup.js         — Vitest setup (imports @testing-library/jest-dom)
  config.js             — Contract address, constants
  wagmi.js              — wagmi/RainbowKit config
  App.jsx               — Root with providers and router
  main.jsx              — Entry point
  index.css             — Tailwind CSS v4 config with custom theme
scripts/
  validate-i18n.js      — i18n key validation script
docs/
  thai-glossary.md      — Thai language reference for natural UX copy
  asset-integration.md  — Image asset integration guide
```

## Code Conventions

### i18n

- All UI text MUST use i18n keys via `useTranslation()` hook. No hardcoded user-facing strings.
- Locale files: `src/i18n/locales/en.json` and `src/i18n/locales/th.json`.
- Keys are nested by section: `common.*`, `home.*`, `donors.*`, `institutions.*`, `stats.*`, `about.*`, `seo.*`.
- When adding new UI text, add the key to BOTH `en.json` and `th.json`.
- Thai is the primary audience language (fallback). Refer to `docs/thai-glossary.md` for natural Thai copy.
- Run `npm run validate:i18n` to verify key consistency.

### React

- Functional components with hooks only. No class components.
- Tailwind utility classes for styling. Custom theme colors defined in `src/index.css` via `@theme`.
- Custom CSS classes: `glass-card`, `gold-underline`, `animate-fade-in-up`.
- All `<img>` tags must have alt text using i18n keys.
- ESLint includes `jsx-a11y` plugin — all elements must be accessible.

### Contract Reads

- Contract reads use wagmi `useReadContract` hook with shared ABI from `src/abi/SaThuCoin.json`.
- Use `query: { enabled: !!condition }` to disable queries when inputs are missing.
- Return plain objects from hooks: `{ data, isLoading, isError }`.
- Format token amounts with `formatTokenAmount()` from `src/utils/formatAmount.js`.
- All contract values use 18 decimals. Use BigInt arithmetic with `n` suffix (e.g., `10n ** 18n`).
- Constants are in `src/config.js` (CONTRACT_ADDRESS, DEPLOYMENT_BLOCK, CHAIN_ID, etc.).

## Testing

### How to Mock wagmi

All wagmi hooks must be mocked at the module level. This is the standard pattern:

```js
const mockUseReadContract = vi.fn();
vi.mock("wagmi", () => ({
  useReadContract: (...args) => mockUseReadContract(...args),
}));
```

Reset mocks in `beforeEach`, not globally. For multi-call hooks, use `mockImplementation` keyed on `functionName`.

### Component Tests

Components using `useTranslation()` need `<I18nextProvider>`. Pages using `<Link>` need `<MemoryRouter>`:

```jsx
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import i18n from "../../i18n";

beforeAll(async () => { await i18n.changeLanguage("en"); });

render(
  <I18nextProvider i18n={i18n}>
    <MemoryRouter><MyPage /></MemoryRouter>
  </I18nextProvider>,
);
```

### Test Focus

- Rendering correctness and i18n key coverage
- Hook return values with loading, error, success, and undefined states
- User interactions (input validation, button clicks)
- Edge cases: zero values, large numbers, missing data

## Important

- Contract: `0x974FCaC6add872B946917eD932581CA9f7188AbD` on Base mainnet
- Deployment block: `41959326`
- The frontend is read-only. No write transactions. No backend server.
- Thai is the primary audience; use natural Thai from `docs/thai-glossary.md`.
