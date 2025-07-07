import axios from "axios";

const BASE_URL = "https://exchange-production-1a87.up.railway.app";
const TOTAL_BIDS = 15;
const TOTAL_ASK = 15;
const MARKET = "TATA_INR";
const USER_ID = "5";

async function main() {
    console.log('\n=== Market Maker Cycle Started ===');
    const price = 1000 + Math.random() * 10;
    console.log(`Current price: ${price.toFixed(2)}`);
    
    const openOrders = await axios.get(`${BASE_URL}/api/v1/order/open?userId=${USER_ID}&market=${MARKET}`);
    console.log(`Total open orders: ${openOrders.data.length}`);

    const totalBids = openOrders.data.filter((o: any) => o.side === "buy").length;
    const totalAsks = openOrders.data.filter((o: any) => o.side === "sell").length;
    console.log(`Current bids: ${totalBids}, Current asks: ${totalAsks}`);

    const cancelledBids = await cancelBidsMoreThan(openOrders.data, price);
    const cancelledAsks = await cancelAsksLessThan(openOrders.data, price);
    console.log(`Cancelled ${cancelledBids} bids, ${cancelledAsks} asks`);


    let bidsToAdd = TOTAL_BIDS - totalBids - cancelledBids;
    let asksToAdd = TOTAL_ASK - totalAsks - cancelledAsks;
    console.log(`Need to add ${bidsToAdd} bids, ${asksToAdd} asks`);

    while(bidsToAdd > 0 || asksToAdd > 0) {
        if (bidsToAdd > 0) {
            const bidPrice = (price - Math.random() * 1).toFixed(1);
            console.log(`Adding bid at price: ${bidPrice}`);
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: bidPrice.toString(),
                quantity: "1",
                side: "buy",
                userId: USER_ID
            });
            bidsToAdd--;
        }
        if (asksToAdd > 0) {
            const askPrice = (price + Math.random() * 1).toFixed(1);
            console.log(`Adding ask at price: ${askPrice}`);
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: askPrice.toString(),
                quantity: "1",
                side: "sell",
                userId: USER_ID
            });
            asksToAdd--;
        }
    }

    console.log('=== Cycle completed, waiting 1 second ===');
    await new Promise(resolve => setTimeout(resolve, 1000));

    main();
}

async function cancelBidsMoreThan(openOrders: any[], price: number) {
    let promises: any[] = [];
    let cancelCount = 0;
    openOrders.map(o => {
        if (o.side === "buy" && (o.price > price || Math.random() < 0.1)) {
            console.log(`Cancelling bid: orderId=${o.orderId}, price=${o.price} (current price: ${price.toFixed(2)})`);
            cancelCount++;
            promises.push(axios.delete(`${BASE_URL}/api/v1/order`, {
                data: {
                    orderId: o.orderId,
                    market: MARKET
                }
            }));
        }
    });
    console.log(`Cancelling ${cancelCount} bids that are too high or randomly selected`);
    await Promise.all(promises);
    return promises.length;
}

async function cancelAsksLessThan(openOrders: any[], price: number) {
    let promises: any[] = [];
    let cancelCount = 0;
    openOrders.map(o => {
        if (o.side === "sell" && (o.price < price || Math.random() < 0.5)) {
            console.log(`Cancelling ask: orderId=${o.orderId}, price=${o.price} (current price: ${price.toFixed(2)})`);
            cancelCount++;
            promises.push(axios.delete(`${BASE_URL}/api/v1/order`, {
                data: {
                    orderId: o.orderId,
                    market: MARKET
                }
            }));
        }
    });
    console.log(`Cancelling ${cancelCount} asks that are too low or randomly selected`);

    await Promise.all(promises);
    return promises.length;
}

main();