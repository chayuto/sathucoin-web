# SaThuCoin Web

Read-only frontend for the SaThuCoin (SATHU) ERC-20 token on Base. Displays live token statistics, donor balance checking, deed history, and guides for donors and institutions.

## Tech Stack

- Vite 6 + React 19
- wagmi v2 + RainbowKit v2 + viem
- Tailwind CSS v4
- recharts, React Router v7, TanStack React Query v5
- react-i18next (English + Thai)
- vitest + Testing Library

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## Project Structure

```
src/
  abi/            Contract ABI (read-only subset)
  components/     Reusable UI components
  hooks/          Custom hooks for contract reads
  i18n/           Internationalization (en, th)
  pages/          Route pages
  config.js       Contract address and constants
  wagmi.js        Wallet configuration
  App.jsx         Root component with providers
  main.jsx        Entry point
```

## Internationalization

The app supports English and Thai. Language can be switched via the toggle in the navigation bar. Thai is the primary audience language, with Buddhist/charitable terminology used where appropriate.

## Deployment

The site deploys to GitHub Pages automatically on push to `main` via GitHub Actions. Hash-based routing is used for GitHub Pages compatibility.

## Contract

- Address: `0x974FCaC6add872B946917eD932581CA9f7188AbD`
- Chain: Base Mainnet (8453)
- Explorer: https://basescan.org/address/0x974FCaC6add872B946917eD932581CA9f7188AbD

## License

MIT
