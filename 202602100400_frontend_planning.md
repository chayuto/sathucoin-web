# SaThuCoin Frontend — Planning Document

> Seed document for the frontend coding agent.
> This contains all context needed to build the SaThuCoin web app from scratch.
> The frontend lives in a **separate repo** from the smart contract.

---

## Project Context

SaThuCoin (SATHU) is an ERC-20 token on Base (Ethereum L2, chain ID 8453) that rewards charitable donors. Every token is minted in response to a verified donation. There is no initial supply — all tokens are created through verified deeds.

The smart contract is deployed and verified on Base Mainnet:
- **Contract:** `0x974FCaC6add872B946917eD932581CA9f7188AbD`
- **BaseScan:** https://basescan.org/address/0x974FCaC6add872B946917eD932581CA9f7188AbD#code
- **Token name:** SaThuCoin
- **Symbol:** SATHU
- **Decimals:** 18
- **Supply cap:** 1,000,000,000 SATHU
- **Daily mint limit:** 500,000 SATHU/day
- **Per-tx mint limit:** 10,000 SATHU

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Vite + React | Fast, simple, no server needed |
| Wallet connection | wagmi v2 + RainbowKit | Industry standard for React dApps |
| Contract reads | viem (bundled with wagmi) | Type-safe, lightweight, replaces ethers.js |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Charts | recharts | React-native charting, simple API |
| Hosting | GitHub Pages | Free, deploys from repo |
| Build | GitHub Actions | Auto-deploy on push to main |

**No backend required.** All data comes from on-chain reads via public RPC. The user's browser talks directly to Base.

---

## Network Configuration

```javascript
const BASE_MAINNET = {
  id: 8453,
  name: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.base.org"] },
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://basescan.org" },
  },
};

const CONTRACT_ADDRESS = "0x974FCaC6add872B946917eD932581CA9f7188AbD";
```

---

## Contract ABI (Frontend Subset)

The frontend only needs read-only functions and events. No write functions required.

```json
[
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{ "type": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{ "type": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [{ "type": "uint8" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "cap",
    "inputs": [],
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{ "name": "account", "type": "address" }],
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "paused",
    "inputs": [],
    "outputs": [{ "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "dailyMintedToday",
    "inputs": [],
    "outputs": [{ "name": "minted", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_DAILY_MINT",
    "inputs": [],
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_MINT_PER_TX",
    "inputs": [],
    "outputs": [{ "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "DeedRewarded",
    "inputs": [
      { "name": "recipient", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false },
      { "name": "deed", "type": "string", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      { "name": "from", "type": "address", "indexed": true },
      { "name": "to", "type": "address", "indexed": true },
      { "name": "value", "type": "uint256", "indexed": false }
    ]
  }
]
```

---

## User Types

The site serves four audiences. Each page should be clear about who it's for.

| User | Who they are | Primary need |
|------|-------------|--------------|
| **General public** | First-time visitor, may not know crypto | Understand what SaThuCoin is and why it exists |
| **Donor** | Person who donated to a participating institution | Check their token balance, see their deed history |
| **Temple/Institution** | Organization that receives donations | Learn how to participate, collect donor wallet addresses |
| **Tech enthusiast** | Developer, crypto-native, auditor | Explore contract stats, verify on-chain data |

---

## Site Map

```
Landing page (/)               — General public
  ├── For Donors (/donors)     — Balance checker, deed history, wallet setup guide
  ├── For Institutions (/institutions) — How to join, what to collect, integration info
  ├── Token Dashboard (/stats) — Live stats, charts, recent events
  └── About (/about)           — Mission, team, FAQ
```

---

## Pages and Features

### 1. Landing Page (`/`) — General Public

The first thing anyone sees. Must answer "What is this?" in 5 seconds.

**Hero section:**
- One-line tagline: "Every token represents a verified act of generosity"
- Brief explanation (2-3 sentences, no jargon)
- Live stats from the contract:

| Stat | Contract call | Display |
|------|--------------|---------|
| Total minted | `totalSupply()` | e.g. "12,500 SATHU minted" |
| Supply cap | `cap()` | "of 1,000,000,000" |
| Supply progress | totalSupply / cap | Progress bar (percentage) |
| Donors rewarded | Count of unique `DeedRewarded` event recipients | e.g. "43 donors rewarded" |
| Contract status | `paused()` | Green "Active" or red "Paused" |

**Navigation cards** (route users to the right section):
- "I'm a Donor" → `/donors`
- "I'm an Institution" → `/institutions`
- "View Token Stats" → `/stats`

**Footer:** Contract address link to BaseScan, GitHub repo link.

### 2. For Donors (`/donors`) — Donor

Everything a donor needs in one page.

**Section A — Check Your Balance:**

Two ways to check:

*Option A — Paste address:*
- Text input for wallet address
- Validate with viem `isAddress()`
- Call `balanceOf(address)` and display result
- Link to BaseScan token page for that address

*Option B — Connect wallet:*
- RainbowKit connect button
- Auto-read `balanceOf(connectedAddress)`
- Show "Add to MetaMask" button if connected

Display:
- SATHU balance (formatted with commas, 2 decimal places)
- List of DeedRewarded events for that address (deed name + amount + date)
- Link to BaseScan transaction for each deed

**Section B — Wallet Setup Guide:**

For donors who don't have a wallet yet. Simple steps:

1. Install MetaMask from metamask.io
2. Create a wallet, save your recovery phrase
3. Copy your wallet address (starts with `0x`)
4. Share your address with the donation organization
5. After verification, tokens appear in your wallet

**Section C — Add SATHU to MetaMask:**

"Add to MetaMask" button (uses `wallet_watchAsset` API).
Explanation: "Adding the token lets you see your SATHU balance directly in MetaMask."

**Section D — FAQ for Donors:**
- Does this cost me anything? (No)
- What can I do with SATHU? (It's a recognition token, permanent proof of donation)
- Which network is this on? (Base, an Ethereum L2 by Coinbase)
- Is my Ethereum address the same as my Base address? (Yes)
- I don't see my tokens? (Make sure you added the custom token, check the correct address)

### 3. For Institutions (`/institutions`) — Temple/Institution

Guide for organizations that want to participate.

**Section A — What is SaThuCoin?**
- Brief explanation tailored for institutions (not technical)
- "Your donors receive digital tokens as recognition for their generosity"
- "Each token is a permanent, verifiable record on the blockchain"

**Section B — How It Works:**
1. Donors provide their wallet address when making a donation
2. Your institution reports the donation to SaThuCoin
3. Tokens are minted and sent directly to the donor's wallet
4. The deed is recorded on-chain with the institution name

**Section C — What You Need to Collect:**
- Donor's wallet address (starts with `0x`, 42 characters)
- Simple validation: must start with `0x`, exactly 42 characters, hexadecimal only
- Example: `0xEeB5c90edaA4a029752273644D40801E83329268`
- Provide a sample form field or text donors can understand:
  "Please provide your Ethereum/Base wallet address to receive your SaThuCoin reward"

**Section D — Integration (for tech-savvy institutions):**
- Contract address and BaseScan link
- How to verify a donor received tokens (check BaseScan)
- Contact information for partnership inquiries

**Section E — FAQ for Institutions:**
- Do we need to handle cryptocurrency? (No, you only collect addresses)
- Does the donor need to pay anything? (No)
- How do we verify a token was sent? (Check BaseScan with the donor's address)
- What wallet should we recommend to donors? (MetaMask — link to donor guide)

### 4. Token Dashboard (`/stats`) — Tech Enthusiast

Live on-chain data. Everything is verifiable.

| Widget | Data source |
|--------|-------------|
| Total supply vs cap | `totalSupply()`, `cap()` — donut chart |
| Daily mint usage | `dailyMintedToday()` / `MAX_DAILY_MINT()` — progress bar |
| Recent deeds | Last 20 `DeedRewarded` events — scrollable list with deed text, amount, recipient, tx link |
| Top recipients | Aggregate `DeedRewarded` events by recipient — bar chart |
| Contract info | Address, chain, verified source link, deployment block |

**Links for verification:**
- "View verified source on BaseScan" → contract link
- "View on GitHub" → contract repo
- Contract constants: cap, daily limit, per-tx limit

### 5. About (`/about`)

- Mission statement: what SaThuCoin is trying to achieve
- How it works (simple diagram)
- Links to all docs and resources
- Contact / social links

---

## Add to MetaMask Button

```javascript
async function addToMetaMask() {
  if (!window.ethereum) {
    alert("MetaMask is not installed");
    return;
  }
  await window.ethereum.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: "0x974FCaC6add872B946917eD932581CA9f7188AbD",
        symbol: "SATHU",
        decimals: 18,
        // image: "https://sathucoin.github.io/assets/token-icon.png",
      },
    },
  });
}
```

---

## Reading On-chain Data (wagmi + viem)

### Setup

```javascript
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const client = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});
```

### Read total supply

```javascript
const totalSupply = await client.readContract({
  address: CONTRACT_ADDRESS,
  abi: SATHU_ABI,
  functionName: "totalSupply",
});
// Returns BigInt — divide by 10n**18n for human-readable
```

### Read balance

```javascript
const balance = await client.readContract({
  address: CONTRACT_ADDRESS,
  abi: SATHU_ABI,
  functionName: "balanceOf",
  args: ["0xUserAddress"],
});
```

### Read recent DeedRewarded events

```javascript
const logs = await client.getLogs({
  address: CONTRACT_ADDRESS,
  event: {
    type: "event",
    name: "DeedRewarded",
    inputs: [
      { name: "recipient", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "deed", type: "string", indexed: false },
    ],
  },
  fromBlock: 41959326n, // deployment block
  toBlock: "latest",
});
```

### Using wagmi React hooks (alternative)

```javascript
import { useReadContract } from "wagmi";

function TokenStats() {
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SATHU_ABI,
    functionName: "totalSupply",
  });

  const { data: cap } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SATHU_ABI,
    functionName: "cap",
  });

  // Render stats...
}
```

---

## Formatting Token Amounts

All contract values use 18 decimals. To display human-readable amounts:

```javascript
import { formatUnits } from "viem";

// BigInt from contract → human readable string
const display = formatUnits(totalSupply, 18);
// e.g. 1000000000000000000000n → "1000.0"

// Format with commas
const formatted = Number(display).toLocaleString(undefined, {
  maximumFractionDigits: 2,
});
// "1,000.00"
```

---

## GitHub Pages Deployment

### Vite config for GitHub Pages

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/sathucoin-web/", // repo name
});
```

### GitHub Actions workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v4
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

### SPA routing on GitHub Pages

GitHub Pages doesn't support client-side routing natively. Add a 404.html redirect:

```bash
# In the build step, copy index.html to 404.html
cp dist/index.html dist/404.html
```

Or use hash routing (`/#/balance` instead of `/balance`).

---

## Design Notes

- Keep it minimal and professional. No excessive animations.
- Color palette: use Base blue (#0052FF) as primary accent.
- Mobile-responsive — many donors will check on their phones.
- Dark mode optional, not required for MVP.
- Token amounts always show 2 decimal places maximum.
- Addresses should be truncated in UI: `0xEeB5...9268`
- Link addresses to BaseScan: `https://basescan.org/address/{address}`
- Link transactions to BaseScan: `https://basescan.org/tx/{txHash}`

---

## Assets Available

The contract repo has these images that can be reused:

```
assets/images/sathu_banner.png   — banner/hero image
assets/images/sathu_coin.png     — token icon
assets/images/sathu_mascot.png   — mascot character
```

Copy these to the frontend repo's `public/` directory.

---

## Project Structure (Suggested)

```
sathucoin-web/
  public/
    assets/           — images (token icon, banner, mascot)
  src/
    abi/
      SaThuCoin.json  — ABI subset from above
    components/
      AddToMetaMask.jsx
      BalanceChecker.jsx
      ConnectButton.jsx
      DeedList.jsx
      StatsCard.jsx
      SupplyProgress.jsx
    pages/
      Home.jsx
      Balance.jsx
      Stats.jsx
      Guide.jsx
    config.js         — contract address, chain config
    App.jsx
    main.jsx
  index.html
  vite.config.js
  tailwind.config.js
  package.json
```

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "viem": "^2.0.0",
    "wagmi": "^2.0.0",
    "@rainbow-me/rainbowkit": "^2.0.0",
    "@tanstack/react-query": "^5.0.0",
    "recharts": "^2.0.0"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

---

## Key Contract Facts for the Frontend

| Fact | Value | Source |
|------|-------|--------|
| Contract address | `0x974FCaC6add872B946917eD932581CA9f7188AbD` | Deployed |
| Chain | Base Mainnet (8453) | hardhat.config.js |
| Deployment block | `41959326` | data/deployment.json |
| Token name | SaThuCoin | `name()` |
| Symbol | SATHU | `symbol()` |
| Decimals | 18 | `decimals()` |
| Supply cap | 1,000,000,000 SATHU | `cap()` |
| Daily mint limit | 500,000 SATHU | `MAX_DAILY_MINT()` |
| Per-tx limit | 10,000 SATHU | `MAX_MINT_PER_TX()` |
| Initial supply | 0 | By design |
| Public RPC | `https://mainnet.base.org` | Free, rate-limited |
| Block explorer | `https://basescan.org` | Free |
| Deed event | `DeedRewarded(address indexed recipient, uint256 amount, string deed)` | Contract ABI |
| Mint event | `Transfer(address indexed from, address indexed to, uint256 value)` where `from == 0x0` | ERC-20 standard |

---

## What the Frontend Does NOT Do

- No write transactions (no minting, no admin functions)
- No backend server
- No database
- No user authentication
- No private key handling
- No token trading or swaps

The frontend is a **read-only dashboard** with wallet connection for balance checking and MetaMask token import.
