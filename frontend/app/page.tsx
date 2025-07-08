import Image from "next/image";
import { Markets } from "./components/Markets";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Static Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/10 to-purple-950/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)]" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="relative px-6 lg:px-8 py-32">
          <div className="mx-auto max-w-6xl text-center">
            {/* Platform Badge */}
            <div className="mb-8 inline-flex">
              <span className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 text-base font-medium backdrop-blur-sm">
                🚀 Next-Generation Trading Platform
              </span>
            </div>

            {/* Main Heading */}
            <div className="relative mb-12">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tight leading-none">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  TRADE
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent relative">
                  SPHERE
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Experience institutional-grade cryptocurrency trading with 
              <span className="text-blue-400 font-semibold"> advanced analytics</span>, 
              <span className="text-purple-400 font-semibold"> real-time data</span>, and 
              <span className="text-pink-400 font-semibold"> lightning-fast execution</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/markets" className="group relative">
                <div className="relative inline-flex items-center px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl">
                  Explore Markets
                  <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
              
              <Link href="/trade/BTC_USDT" className="group relative">
                <div className="relative inline-flex items-center px-10 py-5 rounded-2xl border-2 border-slate-600 text-white font-bold text-lg hover:border-blue-500 hover:bg-slate-900/50 transition-all duration-300 backdrop-blur-sm">
                  Start Trading
                  <div className="ml-3 w-6 h-6 border-2 border-current rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-blue-400 mb-2">24/7</div>
                <div className="text-slate-400 text-sm font-medium">Market Access</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2">0.1%</div>
                <div className="text-slate-400 text-sm font-medium">Trading Fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-pink-400 mb-2">50+</div>
                <div className="text-slate-400 text-sm font-medium">Trading Pairs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-black text-green-400 mb-2">1ms</div>
                <div className="text-slate-400 text-sm font-medium">Execution</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features Section */}
      <div className="relative z-10 py-32 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Why Choose 
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> TradeSphere</span>?
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Built by traders, for traders. Experience the ultimate trading platform designed for the modern digital asset economy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 hover:border-blue-500/50 transition-all duration-500 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Lightning Execution</h3>
                <p className="text-slate-400 leading-relaxed">
                  Execute trades in under 1ms with our high-performance matching engine. Zero slippage, maximum precision.
                </p>
                <div className="mt-6 flex items-center text-blue-400 font-semibold">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Sub-millisecond latency
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 hover:border-purple-500/50 transition-all duration-500 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Military-Grade Security</h3>
                <p className="text-slate-400 leading-relaxed">
                  Your assets are protected with enterprise-level security, multi-sig wallets, and real-time threat detection.
                </p>
                <div className="mt-6 flex items-center text-purple-400 font-semibold">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Bank-level encryption
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 hover:border-green-500/50 transition-all duration-500 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h3>
                <p className="text-slate-400 leading-relaxed">
                  Professional trading tools, real-time market data, and AI-powered insights to maximize your trading potential.
                </p>
                <div className="mt-6 flex items-center text-green-400 font-semibold">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Real-time insights
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-10">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">Powered by Cutting-Edge Technology</h3>
                <p className="text-slate-400 text-lg">Enterprise-grade infrastructure built for scale</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-70">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-400 font-bold text-xl">TS</span>
                  </div>
                  <span className="text-slate-400 text-sm">TypeScript</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-400 font-bold text-xl">⚡</span>
                  </div>
                  <span className="text-slate-400 text-sm">Redis</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-400 font-bold text-xl">🐘</span>
                  </div>
                  <span className="text-slate-400 text-sm">PostgreSQL</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-400 font-bold text-xl">WS</span>
                  </div>
                  <span className="text-slate-400 text-sm">WebSocket</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-pink-400 font-bold text-xl">⚛️</span>
                  </div>
                  <span className="text-slate-400 text-sm">Next.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Markets Section */}
      <div className="relative z-10 px-6 lg:px-8 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-900/30 backdrop-blur-2xl border border-slate-800 rounded-3xl overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Live Markets</h2>
                  <p className="text-slate-400">Real-time prices and market data</p>
                </div>
                <Markets />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
