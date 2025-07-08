"use client";

import { usePathname } from "next/navigation";
import { PrimaryButton, SuccessButton } from "./core/Button"
import { useRouter } from "next/navigation";

export const Appbar = () => {
    const route = usePathname();
    const router = useRouter()

    return (
        <div className="text-white border-b border-slate-800/50 bg-black/80 backdrop-blur-2xl sticky top-0 z-50">
            <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
                <div className="flex items-center space-x-8">
                    <div 
                        className="text-2xl font-black flex items-center cursor-pointer group" 
                        onClick={() => router.push('/')}
                    >
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                            <div className="relative bg-black px-3 py-2 rounded-lg border border-slate-800">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    TradeSphere
                                </span>
                            </div>
                        </div>
                    </div>
                    <nav className="flex items-center space-x-8">
                        <div 
                            className={`text-sm font-semibold cursor-pointer hover:text-blue-400 transition-all duration-300 relative group ${
                                route === '/' ? 'text-blue-400' : 'text-slate-300'
                            }`} 
                            onClick={() => router.push('/')}
                        >
                            Home
                            {route === '/' && (
                                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                            )}
                        </div>
                        <div 
                            className={`text-sm font-semibold cursor-pointer hover:text-blue-400 transition-all duration-300 relative group ${
                                route.startsWith('/markets') ? 'text-blue-400' : 'text-slate-300'
                            }`} 
                            onClick={() => router.push('/markets')}
                        >
                            Markets
                            {route.startsWith('/markets') && (
                                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                            )}
                        </div>
                        <div 
                            className={`text-sm font-semibold cursor-pointer hover:text-blue-400 transition-all duration-300 relative group ${
                                route.startsWith('/trade') ? 'text-blue-400' : 'text-slate-300'
                            }`} 
                            onClick={() => router.push('/trade/BTC_USDT')}
                        >
                            Trade
                            {route.startsWith('/trade') && (
                                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                            )}
                        </div>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                        <SuccessButton>Deposit</SuccessButton>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                        <PrimaryButton>Withdraw</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}