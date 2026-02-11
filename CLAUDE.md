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

- `npm run dev` - Start dev server
- `npm run build` - Build to `dist/`
- `npm run lint` - ESLint flat config
- `npm run test` - Run vitest
- `npm run preview` - Preview production build

## Project Structure

```
src/
  abi/SaThuCoin.json    - Contract ABI (read-only subset)
  components/           - Reusable UI components
  hooks/                - Custom hooks for contract reads
  i18n/                 - i18next config + locale files (en.json, th.json)
  pages/                - Route pages (Home, Donors, Institutions, Stats, About)
  config.js             - Contract address, constants
  wagmi.js              - wagmi/RainbowKit config
  App.jsx               - Root with providers and router
  main.jsx              - Entry point
```

## Code Conventions

- All UI text must use i18n keys via `useTranslation()` hook. No hardcoded strings.
- React functional components with hooks only.
- Tailwind utility classes for styling. Custom theme colors defined in `src/index.css` via `@theme`.
- Contract reads use wagmi `useReadContract` hook with shared ABI from `src/abi/SaThuCoin.json`.
- Format token amounts with `formatUnits(value, 18)` from viem.

## Testing

- vitest with jsdom environment
- Mock wagmi hooks in tests (contract reads require live RPC)
- Focus on rendering correctness and i18n key coverage

## Important

- Contract: `0x974FCaC6add872B946917eD932581CA9f7188AbD` on Base mainnet
- Deployment block: `41959326`
- The frontend is read-only. No write transactions.
- Always run `npm run lint` and `npm run test` before considering work done.
