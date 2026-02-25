# SaThuCoin Web — Copilot Instructions

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

- `pnpm dev` — Start dev server
- `pnpm build` — Build to `dist/`
- `pnpm lint` — ESLint flat config
- `pnpm test` — Run vitest unit tests
- `pnpm test:integration` — Run integration tests (requires live RPC)
- `pnpm test:coverage` — Run tests with coverage report
- `pnpm validate:i18n` — Check i18n key consistency between locales and source
- `pnpm preview` — Preview production build

Always run `pnpm lint` and `pnpm test` before considering work done.

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

### i18n (Internationalization)

- All UI text MUST use i18n keys via `useTranslation()` hook. No hardcoded user-facing strings.
- Locale files: `src/i18n/locales/en.json` and `src/i18n/locales/th.json`.
- Keys are nested by section: `common.*`, `home.*`, `donors.*`, `institutions.*`, `stats.*`, `about.*`, `seo.*`.
- When adding new UI text, add the key to BOTH `en.json` and `th.json`.
- Thai is the primary audience language (fallback). Refer to `docs/thai-glossary.md` for natural Thai UX copy.
- Run `pnpm validate:i18n` to verify key consistency.

```jsx
import { useTranslation } from "react-i18next";

export default function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t("section.key_name")}</h1>;
}
```

### React Components

- React functional components with hooks only. No class components.
- Tailwind utility classes for styling. Custom theme colors defined in `src/index.css` via `@theme`.
- Custom CSS classes: `glass-card`, `gold-underline`, `animate-fade-in-up`, `animate-fade-in-up-delay-1`.
- All `<img>` tags must have alt text using i18n keys.
- Use `loading="lazy"` for images below the fold.

### Contract Reads (Hooks)

- Contract reads use wagmi `useReadContract` hook with shared ABI from `src/abi/SaThuCoin.json`.
- All hooks live in `src/hooks/` and follow a consistent pattern:

```js
import { useReadContract } from "wagmi";
import abi from "../abi/SaThuCoin.json";
import { CONTRACT_ADDRESS } from "../config";

export function useMyHook(address) {
  const { data, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
  return { data, isLoading, isError };
}
```

- Use `query: { enabled: !!condition }` to disable queries when inputs are missing.
- Return plain objects with descriptive keys: `{ balance, isLoading, isError }`.
- Format token amounts with `formatUnits(value, 18)` from viem or `formatTokenAmount()` from `src/utils/formatAmount.js`.

### Token Amounts

- All contract values use 18 decimals. Use BigInt arithmetic (`n` suffix for literals, e.g., `10n ** 18n`).
- Use `formatTokenAmount()` from `src/utils/formatAmount.js` for display.
- Sub-token amounts (< 1 SATHU) display in "boon" (smallest unit).
- Token amounts show max 2 decimal places with thousands separators.

### Constants

All constants are in `src/config.js`:
- `CONTRACT_ADDRESS`: `0x974FCaC6add872B946917eD932581CA9f7188AbD`
- `DEPLOYMENT_BLOCK`: `41959326n`
- `CHAIN_ID`: `8453` (Base Mainnet)
- `BASESCAN_URL`: `https://basescan.org`
- `TOKEN_SYMBOL`: `SATHU`
- `TOKEN_DECIMALS`: `18`

## Testing

### Test Framework

- vitest with jsdom environment
- `@testing-library/react` for component/hook testing
- Tests colocated in `__tests__/` directories next to source files
- Integration tests use suffix `.integration.test.js` (separate config, real RPC, 30s timeout)

### Mocking wagmi Hooks

All wagmi hooks MUST be mocked at the module level. This is the standard pattern used across the codebase:

```js
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockUseReadContract = vi.fn();
vi.mock("wagmi", () => ({
  useReadContract: (...args) => mockUseReadContract(...args),
}));

describe("useMyHook", () => {
  beforeEach(() => {
    mockUseReadContract.mockReset();
  });

  it("returns data", () => {
    mockUseReadContract.mockReturnValue({
      data: 1000000000000000000n,
      isLoading: false,
      isError: false,
    });
    const { result } = renderHook(() => useMyHook("0x..."));
    expect(result.current.data).toBe(1000000000000000000n);
  });
});
```

For hooks using multiple wagmi functions, use `mockImplementation` with `functionName`:

```js
mockUseReadContract.mockImplementation(({ functionName }) => {
  const values = {
    totalSupply: { data: 1000000000000000000n },
    cap: { data: 1000000000000000000000000000n },
  };
  return values[functionName] || { data: undefined };
});
```

### Testing Components with i18n and Routing

Components that use `useTranslation()` need an i18n provider. Pages that use `<Link>` need a router:

```jsx
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import i18n from "../../i18n";

beforeAll(async () => {
  await i18n.changeLanguage("en");
});

render(
  <I18nextProvider i18n={i18n}>
    <MemoryRouter>
      <MyPage />
    </MemoryRouter>
  </I18nextProvider>,
);
```

### What to Test

- Rendering correctness: components render expected text (using i18n keys)
- Hook return values with various mock data (loading, error, success, undefined)
- User interactions (input validation, button clicks)
- Edge cases: zero values, large numbers, missing data, null/undefined

## Important

- The frontend is read-only. No write transactions. No backend server.
- Contract: `0x974FCaC6add872B946917eD932581CA9f7188AbD` on Base mainnet
- Deployment block: `41959326`
- All data comes from on-chain reads via public RPC.
- Thai is the primary audience; use natural Thai from `docs/thai-glossary.md`.
- ESLint includes `jsx-a11y` plugin — all elements must be accessible.
