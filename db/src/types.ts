export type DbMessage =
  | {
      type: "TRADE_ADDED";
      data: {
        id: string;
        isBuyerMaker: boolean;
        price: string;
        quantity: string;
        quoteQuantity: string;
        timestamp: number;
        market: string;
      };
    }
  | {
      type: "ORDER_UPDATE";
      data: {
        orderId: string;
        executedQty: number;
        market?: string;
        price?: string;
        quantity?: string;
        side?: "buy" | "sell";
      };
    }
  | {
      type: "TICKER_UPDATED";
      data: TickerData;
    };

export type TickerData = {
  symbol: string;
  lastPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  highPrice24h: number;
  lowPrice24h: number;
  volume24h: number;
  quoteVolume24h: number;
};
