import axios from "axios";

const BASE_URL = "https://exchange-production-1a87.up.railway.app";
const TOTAL_BIDS = 15;
const TOTAL_ASK = 15;

// Multiple markets with realistic data
const MARKETS = [
    { symbol: "BTC_USDT", basePrice: 45000, volatility: 0.05, userId: "5" },
    { symbol: "ETH_USDT", basePrice: 2800, volatility: 0.07, userId: "6" },
    { symbol: "SOL_USDT", basePrice: 180, volatility: 0.12, userId: "7" },
    { symbol: "MATIC_USDT", basePrice: 0.85, volatility: 0.15, userId: "8" },
    { symbol: "AVAX_USDT", basePrice: 28, volatility: 0.10, userId: "9" },
    { symbol: "DOT_USDT", basePrice: 6.5, volatility: 0.08, userId: "10" },
    { symbol: "LINK_USDT", basePrice: 14, volatility: 0.09, userId: "11" },
    { symbol: "ADA_USDT", basePrice: 0.45, volatility: 0.13, userId: "12" },
    { symbol: "XRP_USDT", basePrice: 0.52, volatility: 0.11, userId: "13" },
    { symbol: "DOGE_USDT", basePrice: 0.08, volatility: 0.18, userId: "14" }
];

let marketIndex = 0;

async function main(): Promise<void> {
    try {
        console.log('\n=== Market Maker Cycle Started ===');
        
        // Rotate through markets
        const currentMarket = MARKETS[marketIndex];
        marketIndex = (marketIndex + 1) % MARKETS.length;
        
        // Generate more realistic price movements
        const priceChange = (Math.random() - 0.5) * 2 * currentMarket.volatility;
        const price = currentMarket.basePrice * (1 + priceChange);
        
        console.log(`Working on ${currentMarket.symbol} - Price: ${price.toFixed(6)}`);
        
        // Add timeout and better error handling
        console.log(`Fetching open orders for ${currentMarket.symbol}...`);
        
        let openOrders;
        try {
            openOrders = await axios.get(`${BASE_URL}/api/v1/order/open?userId=${currentMarket.userId}&market=${currentMarket.symbol}`, {
                timeout: 10000 // 10 second timeout
            });
            console.log(`✅ Successfully fetched orders. Total: ${openOrders.data.length}`);
        } catch (error: any) {
            console.log(`❌ Error fetching open orders:`, error.response?.data || error.message);
            console.log(`🔄 Skipping ${currentMarket.symbol} and trying next market...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return main(); // Try next market
        }

        const totalBids = openOrders.data.filter((o: any) => o.side === "buy").length;
        const totalAsks = openOrders.data.filter((o: any) => o.side === "sell").length;
        console.log(`Current bids: ${totalBids}, Current asks: ${totalAsks}`);

        const cancelledBids = await cancelBidsMoreThan(openOrders.data, price, currentMarket.symbol);
        const cancelledAsks = await cancelAsksLessThan(openOrders.data, price, currentMarket.symbol);
        console.log(`Cancelled ${cancelledBids} bids, ${cancelledAsks} asks`);

        let bidsToAdd = TOTAL_BIDS - totalBids - cancelledBids;
        let asksToAdd = TOTAL_ASK - totalAsks - cancelledAsks;
        console.log(`Need to add ${bidsToAdd} bids, ${asksToAdd} asks`);

        while(bidsToAdd > 0 || asksToAdd > 0) {
            if (bidsToAdd > 0) {
                try {
                    const bidSpread = price * (0.001 + Math.random() * 0.01); // 0.1% to 1% spread
                    const bidPrice = (price - bidSpread).toFixed(price > 1 ? 2 : 6);
                    const quantity = (Math.random() * 5 + 0.1).toFixed(4); // Random quantity between 0.1 and 5
                    
                    console.log(`Adding bid for ${currentMarket.symbol} at price: ${bidPrice}, qty: ${quantity}`);
                    await axios.post(`${BASE_URL}/api/v1/order`, {
                        market: currentMarket.symbol,
                        price: bidPrice.toString(),
                        quantity: quantity,
                        side: "buy",
                        userId: currentMarket.userId
                    }, { timeout: 5000 });
                    bidsToAdd--;
                } catch (error: any) {
                    console.log(`❌ Error adding bid:`, error.response?.data || error.message);
                    bidsToAdd--; // Skip this one and continue
                }
            }
            if (asksToAdd > 0) {
                try {
                    const askSpread = price * (0.001 + Math.random() * 0.01); // 0.1% to 1% spread
                    const askPrice = (price + askSpread).toFixed(price > 1 ? 2 : 6);
                    const quantity = (Math.random() * 5 + 0.1).toFixed(4); // Random quantity between 0.1 and 5
                    
                    console.log(`Adding ask for ${currentMarket.symbol} at price: ${askPrice}, qty: ${quantity}`);
                    await axios.post(`${BASE_URL}/api/v1/order`, {
                        market: currentMarket.symbol,
                        price: askPrice.toString(),
                        quantity: quantity,
                        side: "sell",
                        userId: currentMarket.userId
                    }, { timeout: 5000 });
                    asksToAdd--;
                } catch (error: any) {
                    console.log(`❌ Error adding ask:`, error.response?.data || error.message);
                    asksToAdd--; // Skip this one and continue
                }
            }
        }

        console.log(`=== ${currentMarket.symbol} cycle completed, waiting 500ms ===`);
        
    } catch (error: any) {
        console.log(`💥 Unexpected error in main cycle:`, error.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    main();
}

async function cancelBidsMoreThan(openOrders: any[], price: number, market: string) {
    let promises: any[] = [];
    let cancelCount = 0;
    openOrders.map(o => {
        if (o.side === "buy" && (o.price > price || Math.random() < 0.1)) {
            console.log(`Cancelling bid: orderId=${o.orderId}, price=${o.price} (current price: ${price.toFixed(2)})`);
            cancelCount++;
            promises.push(axios.delete(`${BASE_URL}/api/v1/order`, {
                data: {
                    orderId: o.orderId,
                    market: market
                }
            }));
        }
    });
    console.log(`Cancelling ${cancelCount} bids that are too high or randomly selected`);
    await Promise.all(promises);
    return promises.length;
}

async function cancelAsksLessThan(openOrders: any[], price: number, market: string) {
    let promises: any[] = [];
    let cancelCount = 0;
    openOrders.map(o => {
        if (o.side === "sell" && (o.price < price || Math.random() < 0.5)) {
            console.log(`Cancelling ask: orderId=${o.orderId}, price=${o.price} (current price: ${price.toFixed(2)})`);
            cancelCount++;
            promises.push(axios.delete(`${BASE_URL}/api/v1/order`, {
                data: {
                    orderId: o.orderId,
                    market: market
                }
            }));
        }
    });
    console.log(`Cancelling ${cancelCount} asks that are too low or randomly selected`);

    await Promise.all(promises);
    return promises.length;
}

main();