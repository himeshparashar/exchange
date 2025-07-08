"use client";

import { usePathname } from "next/navigation";
import { PrimaryButton, SuccessButton } from "./core/Button"
import { useRouter } from "next/navigation";

export const Appbar = () => {
    const route = usePathname();
    const router = useRouter()

    return (
        <div className="text-white border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
                <div className="flex items-center space-x-8">
                    <div 
                        className="text-2xl font-bold flex items-center cursor-pointer bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" 
                        onClick={() => router.push('/')}
                    >
                        <span className="mr-2 text-2xl">⚡</span>
                        CryptoEx
                    </div>
                    <nav className="flex items-center space-x-6">
                        <div 
                            className={`text-sm font-medium cursor-pointer hover:text-blue-400 transition-colors ${
                                route === '/' ? 'text-white' : 'text-slate-400'
                            }`} 
                            onClick={() => router.push('/')}
                        >
                            Home
                        </div>
                        <div 
                            className={`text-sm font-medium cursor-pointer hover:text-blue-400 transition-colors ${
                                route.startsWith('/markets') ? 'text-white' : 'text-slate-400'
                            }`} 
                            onClick={() => router.push('/markets')}
                        >
                            Markets
                        </div>
                        <div 
                            className={`text-sm font-medium cursor-pointer hover:text-blue-400 transition-colors ${
                                route.startsWith('/trade') ? 'text-white' : 'text-slate-400'
                            }`} 
                            onClick={() => router.push('/trade/BTC_USDT')}
                        >
                            Trade
                        </div>
                    </nav>
                </div>
                <div className="flex items-center space-x-3">
                    <SuccessButton>Deposit</SuccessButton>
                    <PrimaryButton>Withdraw</PrimaryButton>
                </div>
            </div>
        </div>
    );
}