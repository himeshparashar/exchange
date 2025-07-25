import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./types";

// const BASE_URL = "https://exchange-proxy.100xdevs.com/api/v1";
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/v1`;

export async function getTicker(market: string): Promise<Ticker> {
  const tickers = await getTickers();
  const ticker = Array.isArray(tickers)
    ? tickers.find((t) => t.symbol === market)
    : null;
  if (!ticker) {
    throw new Error(`No ticker found for ${market}`);
  }
  return ticker;
}

export async function getTickers(): Promise<Ticker[]> {
  console.log("Fetching tickers from", `${BASE_URL}/tickers`);

  const response = await axios.get(`${BASE_URL}/tickers`);
  console.log(response.data);
  console.log("yoyoyo");
  return response.data;
}

export async function getDepth(market: string): Promise<Depth> {
  const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
  return response.data;
}
export async function getTrades(market: string): Promise<Trade[]> {
  const response = await axios.get(`${BASE_URL}/trades?symbol=${market}`);
  return response.data;
}

export async function getKlines(
  market: string,
  interval: string,
  startTime: number,
  endTime: number
): Promise<KLine[]> {
  console.log(`Fetching klines for ${market} from ${new Date(startTime * 1000)} to ${new Date(endTime * 1000)}`);
  const response = await axios.get(
    `${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
  );
  const data: KLine[] = response.data;
  console.log(`Received ${data.length} kline records`);
  return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}
