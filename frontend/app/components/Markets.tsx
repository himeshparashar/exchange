"use client";

import { useEffect, useState } from "react";
import { Ticker } from "../utils/types";
import { getTickers } from "../utils/httpClient";
import { useRouter } from "next/navigation";

export const Markets = () => {
  const [tickers, setTickers] = useState<Ticker[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTickers().then((m) => {
      setTickers(m);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 max-w-[1280px] w-full">
        <div className="flex flex-col min-w-[700px] flex-1 w-full">
          <div className="flex flex-col w-full rounded-lg bg-slate-900/50 backdrop-blur-sm border border-slate-800 px-5 py-3">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded mb-4"></div>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-700 rounded mb-2"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 max-w-[1280px] w-full space-y-6">
      {/* Header Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Live Cryptocurrency Markets
        </h1>
        <p className="text-slate-300 text-lg">
          Real-time prices and advanced trading opportunities
        </p>
      </div>

      {/* Market Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="text-green-400 text-sm font-bold tracking-wide">ACTIVE MARKETS</div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-3xl font-black text-white">{Array.isArray(tickers) ? tickers.length : 0}</div>
            <div className="text-slate-400 text-sm mt-1">Trading pairs available</div>
          </div>
        </div>
        
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="text-blue-400 text-sm font-bold tracking-wide">24H VOLUME</div>
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-3xl font-black text-white">
              ${Array.isArray(tickers) ? 
                (tickers.reduce((sum, t) => sum + parseFloat(t.quoteVolume || "0"), 0) / 1000000).toFixed(1) 
                : "0"}M
            </div>
            <div className="text-slate-400 text-sm mt-1">Total trading volume</div>
          </div>
        </div>
        
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="text-purple-400 text-sm font-bold tracking-wide">GAINERS</div>
              <div className="text-green-400">↗</div>
            </div>
            <div className="text-3xl font-black text-white">
              {Array.isArray(tickers) ? 
                tickers.filter(t => parseFloat(t.priceChangePercent) > 0).length 
                : 0}
            </div>
            <div className="text-slate-400 text-sm mt-1">Markets in profit</div>
          </div>
        </div>
        
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/50 to-red-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="text-orange-400 text-sm font-bold tracking-wide">LOSERS</div>
              <div className="text-red-400">↘</div>
            </div>
            <div className="text-3xl font-black text-white">
              {Array.isArray(tickers) ? 
                tickers.filter(t => parseFloat(t.priceChangePercent) < 0).length 
                : 0}
            </div>
            <div className="text-slate-400 text-sm mt-1">Markets declining</div>
          </div>
        </div>
      </div>

      {/* Markets Table */}
      <div className="flex flex-col min-w-[700px] flex-1 w-full">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-600/20 to-slate-700/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative flex flex-col w-full rounded-3xl bg-slate-800/30 backdrop-blur-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
            <div className="px-8 py-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Live Markets</h2>
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Real-time</span>
                </div>
              </div>
            </div>
            <table className="w-full table-auto">
              <MarketHeader />
              {Array.isArray(tickers) && tickers.length > 0 ? 
                tickers.map((m) => <MarketRow key={m.symbol} market={m} />) :
                <tr>
                  <td colSpan={5} className="text-center py-20 text-slate-400">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center">
                          <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500/20 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-xl font-semibold text-slate-300">Markets Loading</div>
                      <div className="text-sm max-w-md text-center">
                        Markets will appear here once the market maker starts generating trading data
                      </div>
                      <div className="flex items-center space-x-2 text-blue-400 text-sm">
                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                        <span>Waiting for market data...</span>
                      </div>
                    </div>
                  </td>
                </tr>
              }
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

function MarketRow({ market }: { market: Ticker }) {
  const router = useRouter();
  const priceChange = parseFloat(market.priceChangePercent);
  const isPositive = priceChange >= 0;
  
  // Get crypto icon based on symbol
  const getCryptoIcon = (symbol: string) => {
    const icons = {
      'BTC_USDT': '₿',
      'ETH_USDT': 'Ξ',
      'SOL_USDT': '◎',
      'MATIC_USDT': '⬡',
      'AVAX_USDT': '🔺',
      'DOT_USDT': '●',
      'LINK_USDT': '🔗',
      'ADA_USDT': '₳',
      'XRP_USDT': '✕',
      'DOGE_USDT': '🐕'
    };
    return icons[symbol as keyof typeof icons] || '₿';
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return num > 1 ? num.toLocaleString('en-US', { maximumFractionDigits: 2 }) : num.toFixed(6);
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num > 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num > 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  return (
    <tr
      className="cursor-pointer border-t border-slate-700/50 hover:bg-slate-800/30 transition-all duration-200 group"
      onClick={() => router.push(`/trade/${market.symbol}`)}
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {getCryptoIcon(market.symbol)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white text-base group-hover:text-blue-400 transition-colors">
              {market.symbol.replace('_', '/')}
            </span>
            <span className="text-slate-400 text-sm">
              {market.symbol.split('_')[0]}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-white font-semibold text-base">
            ${formatPrice(market.lastPrice)}
          </span>
          <span className="text-slate-400 text-sm">
            ${formatPrice(market.high)} H
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-white font-medium">
            ${formatVolume(market.volume)}
          </span>
          <span className="text-slate-400 text-sm">
            {market.trades} trades
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-white font-medium">
          ${formatVolume(market.quoteVolume)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            <span>{isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(priceChange).toFixed(2)}%</span>
          </div>
        </div>
      </td>
    </tr>
  );
}

function MarketHeader() {
  return (
    <thead className="bg-slate-800/30">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <span>Market</span>
          </div>
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <span>Price</span>
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M7 8h10" />
            </svg>
          </div>
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <span>Volume</span>
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <span>24h Volume</span>
          </div>
        </th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <span>24h Change</span>
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </th>
      </tr>
    </thead>
  );
}
