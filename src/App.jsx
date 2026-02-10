import { HashRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { wagmiConfig } from "./wagmi";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Donors from "./pages/Donors";
import Institutions from "./pages/Institutions";
import Stats from "./pages/Stats";
import About from "./pages/About";

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <HashRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="donors" element={<Donors />} />
                <Route path="institutions" element={<Institutions />} />
                <Route path="stats" element={<Stats />} />
                <Route path="about" element={<About />} />
              </Route>
            </Routes>
          </HashRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
