import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";
import { http, fallback } from "wagmi";

export const wagmiConfig = getDefaultConfig({
  appName: "SaThuCoin",
  projectId: "5e58e29133e55977b5760f8af4775cb4",
  chains: [base],
  transports: {
    [base.id]: fallback([
      http("https://mainnet.base.org"),
      http("https://base-rpc.publicnode.com"),
    ]),
  },
});
