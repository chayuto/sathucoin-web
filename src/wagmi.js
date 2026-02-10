import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";
import { http } from "wagmi";

export const wagmiConfig = getDefaultConfig({
  appName: "SaThuCoin",
  projectId: "sathucoin-web",
  chains: [base],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
});
