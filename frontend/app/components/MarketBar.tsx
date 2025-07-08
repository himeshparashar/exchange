"use client";
import { useEffect, useState } from "react";
import type { Ticker } from "../utils/types";
import { getTicker } from "../utils/httpClient";
import { SignalingManager } from "../utils/SignalingManager";

export const MarketBar = ({ market }: { market: string }) => {
  const [ticker, setTicker] = useState<Ticker | null>(null);

  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const data = await getTicker(market);
        console.log("Ticker data:", data); // Debug log
        setTicker(data);
      } catch (error) {
        console.error("Error fetching ticker:", error);
      }
    };

    fetchTicker();

    SignalingManager.getInstance().registerCallback(
      "ticker",
      (data: Partial<Ticker>) => {
        console.log("Ticker update received:", data); // Debug log
        setTicker((prevTicker) => {
          const updatedTicker = {
            firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? "",
            high: data?.high ?? prevTicker?.high ?? "",
            lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? "",
            low: data?.low ?? prevTicker?.low ?? "",
            priceChange: data?.priceChange ?? prevTicker?.priceChange ?? "",
            priceChangePercent:
              data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? "",
            quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? "",
            symbol: data?.symbol ?? prevTicker?.symbol ?? "",
            trades: data?.trades ?? prevTicker?.trades ?? "",
            volume: data?.volume ?? prevTicker?.volume ?? "",
          };
          console.log("Updated ticker state:", updatedTicker); // Debug log
          return updatedTicker;
        });
      },
      `TICKER-${market}`
    );

    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`ticker.${market}`],
    });

    return () => {
      SignalingManager.getInstance().deRegisterCallback(
        "ticker",
        `TICKER-${market}`
      );
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`ticker.${market}`],
      });
    };
  }, [market]);

  if (!ticker) {
    return (
      <div className="w-full bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 px-6 py-4">
        <div className="flex items-center space-x-6 animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-24"></div>
          <div className="h-4 bg-slate-700 rounded w-16"></div>
          <div className="h-4 bg-slate-700 rounded w-20"></div>
          <div className="h-4 bg-slate-700 rounded w-16"></div>
        </div>
      </div>
    );
  }

  const priceChange = parseFloat(ticker.priceChangePercent || "0");
  const isPositive = priceChange >= 0;

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return num > 1
      ? num.toLocaleString("en-US", { maximumFractionDigits: 2 })
      : num.toFixed(6);
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num > 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num > 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Market Symbol */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {ticker.symbol.split("_")[0].charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {ticker.symbol.replace("_", "/")}
              </h1>
              <div className="text-sm text-slate-400">
                {ticker.symbol.split("_")[0]} to {ticker.symbol.split("_")[1]}
              </div>
            </div>
          </div>

          {/* Price Information */}
          <div className="flex items-center space-x-6">
            <div>
              <div className="text-sm text-slate-400">Last Price</div>
              <div className="text-2xl font-bold text-white">
                ${formatPrice(ticker.lastPrice)}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400">24h Change</div>
              <div
                className={`flex items-center space-x-1 text-lg font-semibold ${
                  isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                <span>{isPositive ? "↗" : "↘"}</span>
                <span>{Math.abs(priceChange).toFixed(2)}%</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400">24h High</div>
              <div className="text-lg font-semibold text-white">
                ${formatPrice(ticker.high)}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400">24h Low</div>
              <div className="text-lg font-semibold text-white">
                ${formatPrice(ticker.low)}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400">24h Volume</div>
              <div className="text-lg font-semibold text-white">
                {formatVolume(ticker.volume)}{" "}
                {ticker.symbol.split("_")[0]}
              </div>
            </div>
          </div>
        </div>

        {/* Market Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function MarketDisplay({ market }: { market: string }) {
  return (
    <div className="flex h-[60px] shrink-0 space-x-4">
      <div className="flex flex-row relative ml-2 -mr-4">
        <img
          alt="SOL Logo"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          className="z-10 rounded-full h-6 w-6 mt-4 outline-baseBackgroundL1"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVvBqZC_Q1TSYObZaMvK0DRFeHZDUtVMh08Q&s"
        />
        <img
          alt="USDC Logo"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          className="h-6 w-6 -ml-2 mt-4 rounded-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVvBqZC_Q1TSYObZaMvK0DRFeHZDUtVMh08Q&s"
        />
      </div>
      <button type="button" className="react-aria-Button" data-rac="">
        <div className="flex items-center justify-between flex-row cursor-pointer rounded-lg p-3 hover:opacity-80">
          <div className="flex items-center flex-row gap-2 undefined">
            <div className="flex flex-row relative">
              <p className="font-medium text-sm undefined">
                {market.replace("_", " / ")}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
