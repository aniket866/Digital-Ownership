import React, { useMemo, useState } from "react";

type Asset = {
  symbol: string;
  name: string;
  chain: string;
  balance: number;
  price: number;
  dayChange: number;
  kind: "volatile" | "stable";
};

const assets: Asset[] = [
  { symbol: "ETH", name: "Ether", chain: "Ethereum", balance: 1.82, price: 3678, dayChange: 2.3, kind: "volatile" },
  { symbol: "USDC", name: "USD Coin", chain: "Polygon", balance: 11850, price: 1, dayChange: 0.0, kind: "stable" },
  { symbol: "ARB", name: "Arbitrum", chain: "Arbitrum", balance: 4230, price: 0.83, dayChange: -1.5, kind: "volatile" },
  { symbol: "OP", name: "Optimism", chain: "Optimism", balance: 1670, price: 2.55, dayChange: 3.1, kind: "volatile" },
  { symbol: "MATIC", name: "Polygon", chain: "Polygon", balance: 810, price: 0.75, dayChange: 4.2, kind: "volatile" },
  { symbol: "DAI", name: "Dai", chain: "Ethereum", balance: 3100, price: 1, dayChange: 0.0, kind: "stable" },
];

const history = [78, 81, 80, 84, 89, 87, 90, 93, 95, 98, 101, 99, 103, 107];

function usd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value >= 1000 ? 0 : 2 }).format(value);
}

function assetValue(asset: Asset) {
  return asset.balance * asset.price;
}

export default function PortfolioOverview() {
  const [chain, setChain] = useState("All");
  const [kind, setKind] = useState<"all" | "stable" | "volatile">("all");
  const [query, setQuery] = useState("");

  const chains = useMemo(() => ["All", ...new Set(assets.map((a) => a.chain))], []);

  const filtered = useMemo(() => {
    return assets.filter((asset) => {
      const matchesChain = chain === "All" || asset.chain === chain;
      const matchesKind = kind === "all" ? true : asset.kind === kind;
      const matchesQuery =
        `${asset.symbol} ${asset.name} ${asset.chain}`.toLowerCase().includes(query.toLowerCase());
      return matchesChain && matchesKind && matchesQuery;
    });
  }, [chain, kind, query]);

  const value = filtered.reduce((sum, asset) => sum + assetValue(asset), 0);
  const gain = filtered.reduce((sum, asset) => sum + assetValue(asset) * (asset.dayChange / 100), 0);
  const largest = [...filtered].sort((a, b) => assetValue(b) - assetValue(a))[0];
  const smallest = [...filtered].sort((a, b) => assetValue(a) - assetValue(b))[0];

  return (
    <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Real-Time Multi-Chain Portfolio Overview</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
            Aggregate balances, inspect asset allocation, and compare chain exposure with a clean, filterable Web3 portfolio interface.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Portfolio value" value={usd(value)} />
          <Metric label="24h change" value={usd(gain)} tone={gain >= 0 ? "positive" : "negative"} />
          <Metric label="Largest" value={largest ? largest.symbol : "—"} />
          <Metric label="Smallest" value={smallest ? smallest.symbol : "—"} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <div className="flex flex-wrap gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by asset, chain, or name"
              className="min-w-0 flex-1 rounded-2xl border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:focus:border-white"
            />
            <select value={chain} onChange={(e) => setChain(e.target.value)} className="rounded-2xl border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none dark:border-slate-700">
              {chains.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={kind} onChange={(e) => setKind(e.target.value as any)} className="rounded-2xl border border-slate-300 bg-transparent px-4 py-2 text-sm outline-none dark:border-slate-700">
              <option value="all">All assets</option>
              <option value="stable">Stablecoins</option>
              <option value="volatile">Volatile</option>
            </select>
          </div>

          <div className="mt-4 space-y-3">
            {filtered.map((asset) => (
              <AssetRow key={`${asset.chain}-${asset.symbol}`} asset={asset} />
            ))}
            {!filtered.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No assets match the current filter set.
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Allocation & trend</h2>

          <div className="mt-4 space-y-4">
            {filtered.map((asset) => {
              const pct = value ? (assetValue(asset) / value) * 100 : 0;
              return (
                <div key={asset.symbol}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{asset.symbol}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-900">
                    <div className="h-3 rounded-full bg-slate-900 dark:bg-white" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Portfolio trend</div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">Recent value profile</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">14 points</div>
            </div>
            <svg viewBox="0 0 300 140" className="mt-4 h-32 w-full">
              <path
                d="M10,110 C35,88 50,84 68,74 C86,64 110,42 128,56 C147,70 156,92 180,78 C200,65 217,46 238,44 C258,42 278,34 290,30 L290,130 L10,130 Z"
                fill="rgba(15,23,42,0.10)"
                className="dark:fill-white/10"
              />
              <path
                d="M10,110 C35,88 50,84 68,74 C86,64 110,42 128,56 C147,70 156,92 180,78 C200,65 217,46 238,44 C258,42 278,34 290,30"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-900 dark:text-white"
              />
            </svg>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "positive" | "negative" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-2 text-sm font-semibold ${tone === "positive" ? "text-emerald-600" : tone === "negative" ? "text-rose-600" : "text-slate-900 dark:text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function AssetRow({ asset }: { asset: Asset }) {
  const value = assetValue(asset);
  return (
    <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-900 dark:text-white">
            {asset.symbol} <span className="text-xs text-slate-500 dark:text-slate-400">on {asset.chain}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{asset.name}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">{usd(value)}</div>
          <div className={`text-xs ${asset.dayChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {asset.dayChange >= 0 ? "+" : ""}{asset.dayChange.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Balance: {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
        <span>Price: {usd(asset.price)}</span>
      </div>
    </div>
  );
}
