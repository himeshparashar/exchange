"use client";
import { useState, useMemo } from "react";
import { getTicker } from "../utils/httpClient";
import { useEffect } from "react";

// Function to get asset symbol/icon
function getAssetSymbol(asset: string): string {
    const symbols: { [key: string]: string } = {
        'BTC': '₿',
        'ETH': 'Ξ', 
        'SOL': '◎',
        'MATIC': '⬟',
        'AVAX': '🔺',
        'DOT': '●',
        'LINK': '🔗',
        'ADA': '₳',
        'XRP': '✕',
        'DOGE': '🐕',
        'USDT': '$',
        'USDC': '$',
        'USD': '$',
        'INR': '₹',
        'TATA': '🏢'  // Corporate/company symbol for TATA
    };
    return symbols[asset] || asset.charAt(0);
}

// Function to get asset color
function getAssetColor(asset: string): string {
    const colors: { [key: string]: string } = {
        'BTC': 'from-orange-500 to-yellow-500',
        'ETH': 'from-blue-500 to-purple-500',
        'SOL': 'from-purple-500 to-pink-500',
        'MATIC': 'from-purple-600 to-blue-500',
        'AVAX': 'from-red-500 to-pink-500',
        'DOT': 'from-pink-500 to-purple-500',
        'LINK': 'from-blue-600 to-cyan-500',
        'ADA': 'from-blue-500 to-green-500',
        'XRP': 'from-gray-500 to-blue-500',
        'DOGE': 'from-yellow-500 to-orange-500',
        'USDT': 'from-green-500 to-emerald-500',
        'USDC': 'from-blue-500 to-cyan-500',
        'USD': 'from-green-500 to-emerald-500',
        'INR': 'from-orange-600 to-yellow-600',
        'TATA': 'from-blue-700 to-indigo-700'
    };
    return colors[asset] || 'from-gray-500 to-gray-600';
}

// Function to format price with appropriate decimal places
function formatPrice(price: string): string {
    const num = parseFloat(price);
    if (isNaN(num)) return '0';
    return num > 1 ? num.toFixed(2) : num.toFixed(6);
}

export function SwapUI({ market }: {market: string}) {
    const [amount, setAmount] = useState('');
    const [activeTab, setActiveTab] = useState('buy');
    const [type, setType] = useState('limit');
    const [currentPrice, setCurrentPrice] = useState('0');
    const [limitPrice, setLimitPrice] = useState('0');
    const [isLoadingPrice, setIsLoadingPrice] = useState(true);

    // Parse market to get base and quote assets
    const { baseAsset, quoteAsset, baseSymbol, quoteSymbol } = useMemo(() => {
        const [base, quote] = market.split('_');
        return {
            baseAsset: base,
            quoteAsset: quote,
            baseSymbol: getAssetSymbol(base),
            quoteSymbol: getAssetSymbol(quote)
        };
    }, [market]);

    useEffect(() => {
        // Fetch current market price
        setIsLoadingPrice(true);
        getTicker(market).then(ticker => {
            setCurrentPrice(ticker.lastPrice);
            setLimitPrice(ticker.lastPrice);
            setIsLoadingPrice(false);
        }).catch(error => {
            console.error('Error fetching ticker:', error);
            setIsLoadingPrice(false);
        });
    }, [market]);

    return <div>
        <div className="flex flex-col">
            {/* Market Header */}
            <div className="px-3 py-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getAssetColor(baseAsset)} flex items-center justify-center text-white text-sm font-bold`}>
                                {baseSymbol}
                            </div>
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getAssetColor(quoteAsset)} flex items-center justify-center text-white text-xs font-bold -ml-2`}>
                                {quoteSymbol}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-baseTextHighEmphasis">
                                {baseAsset}/{quoteAsset}
                            </h3>
                            <p className="text-xs text-baseTextMedEmphasis">
                                {isLoadingPrice ? (
                                    <span className="animate-pulse">Loading...</span>
                                ) : (
                                    `$${formatPrice(currentPrice)}`
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-row h-[60px]">
                <BuyButton activeTab={activeTab} setActiveTab={setActiveTab} />
                <SellButton activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="flex flex-col gap-1">
                <div className="px-3">
                    <div className="flex flex-row flex-0 gap-5 undefined">
                        <LimitButton type={type} setType={setType} />
                        <MarketButton type={type} setType={setType} />                       
                    </div>
                </div>
                <div className="flex flex-col px-3">
                    <div className="flex flex-col flex-1 gap-3 text-baseTextHighEmphasis">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between flex-row">
                                <p className="text-xs font-normal text-baseTextMedEmphasis">Available Balance</p>
                                <p className="font-medium text-xs text-baseTextHighEmphasis">36.94 {quoteAsset}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-normal text-baseTextMedEmphasis">
                                Price
                            </p>                            <div className="flex flex-col relative">
                                <input 
                                    step="0.01" 
                                    placeholder="0" 
                                    className="h-12 rounded-lg border-2 border-solid border-baseBorderLight bg-[var(--background)] pr-12 text-right text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis ring-0 transition focus:border-accentBlue focus:ring-0" 
                                    type="text" 
                                    value={isLoadingPrice ? 'Loading...' : (type === 'limit' ? limitPrice : formatPrice(currentPrice))}
                                    onChange={(e) => type === 'limit' && setLimitPrice(e.target.value)}
                                    readOnly={type === 'market'}
                                />
                                <div className="flex flex-row absolute right-1 top-1 p-2">
                                    <div className="relative">
                                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getAssetColor(quoteAsset)} flex items-center justify-center text-white text-xs font-bold`}>
                                            {quoteSymbol}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-normal text-baseTextMedEmphasis">
                            Quantity
                        </p>
                        <div className="flex flex-col relative">
                            <input 
                                step="0.01" 
                                placeholder="0" 
                                className="h-12 rounded-lg border-2 border-solid border-baseBorderLight bg-[var(--background)] pr-12 text-right text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis ring-0 transition focus:border-accentBlue focus:ring-0" 
                                type="text" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <div className="flex flex-row absolute right-1 top-1 p-2">
                                <div className="relative">
                                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getAssetColor(baseAsset)} flex items-center justify-center text-white text-xs font-bold`}>
                                        {baseSymbol}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end flex-row">
                            <p className="font-medium pr-2 text-xs text-baseTextMedEmphasis">
                                ≈ {formatPrice((parseFloat(amount || '0') * parseFloat(type === 'limit' ? limitPrice : currentPrice || '0')).toString())} {quoteAsset}
                            </p>
                        </div>
                        <div className="flex justify-center flex-row mt-2 gap-3">
                            <div className="flex items-center justify-center flex-row rounded-full px-[16px] py-[6px] text-xs cursor-pointer bg-baseBackgroundL2 hover:bg-baseBackgroundL3">
                                25%
                            </div>
                            <div className="flex items-center justify-center flex-row rounded-full px-[16px] py-[6px] text-xs cursor-pointer bg-baseBackgroundL2 hover:bg-baseBackgroundL3">
                                50%
                            </div>
                            <div className="flex items-center justify-center flex-row rounded-full px-[16px] py-[6px] text-xs cursor-pointer bg-baseBackgroundL2 hover:bg-baseBackgroundL3">
                                75%
                            </div>
                            <div className="flex items-center justify-center flex-row rounded-full px-[16px] py-[6px] text-xs cursor-pointer bg-baseBackgroundL2 hover:bg-baseBackgroundL3">
                                Max
                            </div>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        className={`font-semibold focus:ring-blue-200 focus:none focus:outline-none text-center h-12 rounded-xl text-base px-4 py-2 my-4 active:scale-98 transition-colors ${
                            activeTab === 'buy' 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-red-600 hover:bg-red-700 text-white'
                        }`} 
                        data-rac=""
                    >
                        {activeTab === 'buy' ? `Buy ${baseAsset}` : `Sell ${baseAsset}`}
                    </button>
                    <div className="flex justify-between flex-row mt-1">
                        <div className="flex flex-row gap-2">
                            <div className="flex items-center">
                                <input className="form-checkbox rounded border border-solid border-baseBorderMed bg-base-950 font-light text-transparent shadow-none shadow-transparent outline-none ring-0 ring-transparent checked:border-baseBorderMed checked:bg-base-900 checked:hover:border-baseBorderMed focus:bg-base-900 focus:ring-0 focus:ring-offset-0 focus:checked:border-baseBorderMed cursor-pointer h-5 w-5" id="postOnly" type="checkbox" data-rac="" />
                                <label className="ml-2 text-xs">Post Only</label>
                            </div>
                            <div className="flex items-center">
                                <input className="form-checkbox rounded border border-solid border-baseBorderMed bg-base-950 font-light text-transparent shadow-none shadow-transparent outline-none ring-0 ring-transparent checked:border-baseBorderMed checked:bg-base-900 checked:hover:border-baseBorderMed focus:bg-base-900 focus:ring-0 focus:ring-offset-0 focus:checked:border-baseBorderMed cursor-pointer h-5 w-5" id="ioc" type="checkbox" data-rac="" />
                                <label className="ml-2 text-xs">IOC</label>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
}

function LimitButton({ type, setType }: { type: string, setType: any }) {
    return <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('limit')}>
    <div className={`text-sm font-medium py-1 border-b-2 ${type === 'limit' ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-baseTextMedEmphasis hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis"}`}>
        Limit
    </div>
</div>
}

function MarketButton({ type, setType }: { type: string, setType: any }) {
    return  <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('market')}>
    <div className={`text-sm font-medium py-1 border-b-2 ${type === 'market' ? "border-accentBlue text-baseTextHighEmphasis" : "border-b-2 border-transparent text-baseTextMedEmphasis hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis"} `}>
        Market
    </div>
    </div>
}

function BuyButton({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: any }) {
    return <div className={`flex flex-col mb-[-2px] flex-1 cursor-pointer justify-center border-b-2 p-4 ${activeTab === 'buy' ? 'border-b-greenBorder bg-greenBackgroundTransparent' : 'border-b-baseBorderMed hover:border-b-baseBorderFocus'}`} onClick={() => setActiveTab('buy')}>
        <p className="text-center text-sm font-semibold text-greenText">
            Buy
        </p>
    </div>
}

function SellButton({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: any }) {
    return <div className={`flex flex-col mb-[-2px] flex-1 cursor-pointer justify-center border-b-2 p-4 ${activeTab === 'sell' ? 'border-b-redBorder bg-redBackgroundTransparent' : 'border-b-baseBorderMed hover:border-b-baseBorderFocus'}`} onClick={() => setActiveTab('sell')}>
        <p className="text-center text-sm font-semibold text-redText">
            Sell
        </p>
    </div>
}