
import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  PieChart as PieIcon, 
  ChevronRight, 
  Search,
  Zap,
  Briefcase,
  Layers,
  Info,
  Bell,
  Plus,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  X,
  Filter,
  BarChart as BarChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie
} from 'recharts';
import { BROKERS_DATA } from './data';
import { BrokerData, StockRecommendation, StockSignal, SignalType } from './types';

// Normalization mapping for scrip aliases
const SCRIP_ALIASES: Record<string, string> = {
  'OGDC': 'OGDCL',
  'OGDCL': 'OGDCL',
  // Add other aliases here if needed in the future
};

const normalizeScrip = (scrip: string) => {
  const clean = scrip.replace('*', '').trim().toUpperCase();
  return SCRIP_ALIASES[clean] || clean;
};

// Components
const Navbar = () => (
  <nav className="sticky top-0 z-50 glass-card px-6 py-4 mb-8 flex justify-between items-center border-b border-white/5">
    <div className="flex items-center gap-3">
      <div className="bg-gradient-to-br from-emerald-400 to-blue-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
        <TrendingUp className="text-white w-6 h-6" />
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">PSX <span className="gradient-text">2026 Lookout</span></h1>
        <p className="text-xs text-slate-400">Master Broker Compilation</p>
      </div>
    </div>
    <div className="hidden md:flex items-center gap-6">
      <a href="#summary" className="text-sm font-medium hover:text-emerald-400 transition-colors">Summary</a>
      <a href="#signals" className="text-sm font-medium hover:text-emerald-400 transition-colors">Signals</a>
      <a href="#analysis" className="text-sm font-medium hover:text-emerald-400 transition-colors">Analysis</a>
      <a href="#brokers" className="text-sm font-medium hover:text-emerald-400 transition-colors">Brokers</a>
      <button className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-500/20 transition-all">
        Live Market
      </button>
    </div>
  </nav>
);

const SectionTitle: React.FC<{ icon: any, title: string, subtitle: string }> = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-blue-500/10 rounded-lg">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
    <p className="text-slate-400 max-w-2xl">{subtitle}</p>
  </div>
);

const BrokerCard: React.FC<{ data: BrokerData, index: number, onClick: () => void, isSelected: boolean }> = ({ data, index, onClick, isSelected }) => {
  const topStock = data.recommendations[0];
  
  return (
    <div 
      onClick={onClick}
      className={`glass-card p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 group ${isSelected ? 'border-emerald-500/50 bg-emerald-500/5' : 'hover:border-white/20'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold group-hover:gradient-text transition-all">{data.name}</h3>
          <p className="text-xs text-slate-500">Target Index: <span className="text-slate-300 font-medium">{data.indexTarget}</span></p>
        </div>
        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
          <Zap className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Top Conviction</span>
          <span className="text-white font-bold">{topStock.stock}</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-blue-500 h-full transition-all duration-1000" 
            style={{ width: `${(index + 1) * 12}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Details</span>
        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

const StockTable: React.FC<{ recommendations: StockRecommendation[] }> = ({ recommendations }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-widest">
          <th className="py-4 px-4 font-semibold">Stock</th>
          <th className="py-4 px-4 font-semibold text-right">Target Price</th>
          <th className="py-4 px-4 font-semibold text-right">Potential Upside</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {recommendations.map((rec, i) => (
          <tr key={i} className="hover:bg-white/5 transition-colors group">
            <td className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  {rec.stock.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-200">{rec.stock}</span>
              </div>
            </td>
            <td className="py-4 px-4 text-right">
              <span className="text-sm font-mono text-emerald-400">{rec.tp || 'N/A'}</span>
            </td>
            <td className="py-4 px-4 text-right">
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${rec.upside ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-600'}`}>
                {rec.upside ? (typeof rec.upside === 'number' ? `${rec.upside}%` : rec.upside) : '--'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SignalFlashcard: React.FC<{ signal: StockSignal; onDelete: (id: string) => void }> = ({ signal, onDelete }) => {
  const typeColors = {
    long: 'border-emerald-500/30 bg-emerald-500/5 shadow-emerald-500/10',
    moderate: 'border-blue-500/30 bg-blue-500/5 shadow-blue-500/10',
    swing: 'border-amber-500/30 bg-amber-500/5 shadow-amber-500/10'
  };

  const badgeColors = {
    long: 'bg-emerald-500/20 text-emerald-400',
    moderate: 'bg-blue-500/20 text-blue-400',
    swing: 'bg-amber-500/20 text-amber-400'
  };

  return (
    <div className={`glass-card p-5 rounded-2xl relative overflow-hidden group border transition-all duration-500 hover:scale-[1.02] shadow-xl ${typeColors[signal.type]}`}>
      <button 
        onClick={() => onDelete(signal.id)}
        className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-2xl font-black text-white tracking-tighter">{signal.symbol}</h4>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase mt-2 inline-block ${badgeColors[signal.type]}`}>
            {signal.type}
          </span>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Buy Range</p>
          <p className="text-sm font-mono text-white">{signal.buyingRange}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase mb-1">TP 1</p>
          <p className="text-md font-black text-emerald-400">{signal.tp1}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase mb-1">TP 2</p>
          <p className="text-md font-black text-emerald-500">{signal.tp2}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center border border-red-500/10">
          <p className="text-[10px] text-slate-500 uppercase mb-1">SL</p>
          <p className="text-md font-black text-red-400">{signal.sl}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
        <Clock className="w-3 h-3 text-slate-600" />
        <span className="text-[10px] text-slate-500 font-medium">
          Added {new Date(signal.timestamp).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedBroker, setSelectedBroker] = useState<BrokerData>(BROKERS_DATA[0]);
  const [selectedAnalysisStock, setSelectedAnalysisStock] = useState<string>('OGDCL');
  const [signals, setSignals] = useState<StockSignal[]>([
    {
      id: '1',
      symbol: 'MEBL',
      buyingRange: '440-450',
      tp1: 520,
      tp2: 600,
      sl: 420,
      type: 'long',
      timestamp: Date.now()
    },
    {
      id: '2',
      symbol: 'SYS',
      buyingRange: '205-210',
      tp1: 240,
      tp2: 275,
      sl: 195,
      type: 'swing',
      timestamp: Date.now()
    }
  ]);

  const [isAddingSignal, setIsAddingSignal] = useState(false);
  const [newSignal, setNewSignal] = useState<Omit<StockSignal, 'id' | 'timestamp'>>({
    symbol: '',
    buyingRange: '',
    tp1: 0,
    tp2: 0,
    sl: 0,
    type: 'moderate'
  });

  // Get all unique stock symbols from all brokers, normalized for duplicates like OGDC/OGDCL
  const allAvailableStocks = useMemo(() => {
    const stocks = new Set<string>();
    BROKERS_DATA.forEach(b => b.recommendations.forEach(r => stocks.add(normalizeScrip(r.stock))));
    return Array.from(stocks).sort();
  }, []);

  // Analysis Data for specific stock across all brokers, including normalized aliases
  const crossBrokerData = useMemo(() => {
    const results: any[] = [];
    BROKERS_DATA.forEach(broker => {
      // Find matches using normalized names (handles OGDC vs OGDCL)
      const rec = broker.recommendations.find(r => normalizeScrip(r.stock) === selectedAnalysisStock);
      if (rec && rec.tp !== "") {
        const tpVal = typeof rec.tp === 'string' ? parseFloat(rec.tp) : rec.tp;
        results.push({
          broker: broker.name,
          tp: tpVal,
          upside: rec.upside || 'N/A'
        });
      }
    });
    return results;
  }, [selectedAnalysisStock]);

  const consensusMetrics = useMemo(() => {
    if (crossBrokerData.length === 0) return null;
    const tps = crossBrokerData.map(d => d.tp);
    const avg = tps.reduce((a, b) => a + b, 0) / tps.length;
    return {
      avg: Math.round(avg),
      high: Math.max(...tps),
      low: Math.min(...tps),
      count: crossBrokerData.length
    };
  }, [crossBrokerData]);

  const handleAddSignal = (e: React.FormEvent) => {
    e.preventDefault();
    const signal: StockSignal = {
      ...newSignal,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setSignals([signal, ...signals]);
    setIsAddingSignal(false);
    setNewSignal({
      symbol: '',
      buyingRange: '',
      tp1: 0,
      tp2: 0,
      sl: 0,
      type: 'moderate'
    });
  };

  const deleteSignal = (id: string) => {
    setSignals(signals.filter(s => s.id !== id));
  };

  // Derived Analytics Data
  const topUpsideData = useMemo(() => {
    const list: any[] = [];
    BROKERS_DATA.forEach(b => {
      b.recommendations.forEach(r => {
        if (r.upside) {
          const val = typeof r.upside === 'string' ? parseFloat(r.upside) : r.upside;
          list.push({ stock: r.stock, upside: val, broker: b.name });
        }
      });
    });
    return list.sort((a, b) => b.upside - a.upside).slice(0, 8);
  }, []);

  const sectorDistribution = [
    { name: 'Banks', value: 35, fill: '#10b981' },
    { name: 'Fertilizers', value: 25, fill: '#3b82f6' },
    { name: 'E&P', value: 20, fill: '#f59e0b' },
    { name: 'Cement', value: 15, fill: '#ef4444' },
    { name: 'Others', value: 5, fill: '#8b5cf6' },
  ];

  return (
    <div className="min-h-screen pb-20 relative">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero / Summary Section */}
        <section id="summary" className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              2026 MARKET OUTLOOK
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
              Pakistan's <br />
              <span className="gradient-text">Bullish Horizon</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
              Synthesizing data from top institutional brokers to provide the most comprehensive 
              equities outlook for 2026. Discover high-conviction picks and target price trajectories.
            </p>
            
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Avg. Target', value: '211k', icon: Target },
                { label: 'Top Sector', value: 'Banks', icon: Briefcase },
                { label: 'Sentiment', value: 'Positive', icon: TrendingUp },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-4 rounded-xl">
                  <stat.icon className="w-5 h-5 text-emerald-400 mb-2" />
                  <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 glass-card rounded-3xl p-6 min-h-[400px]">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Target Index Distribution
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={BROKERS_DATA}>
                  <defs>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="name" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorTarget)" 
                    name="Broker"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="indexTarget" 
                    stroke="#10b981" 
                    fillOpacity={0.1} 
                    fill="#10b981" 
                    name="Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-widest font-bold">
              Aggregated Broker Index Targets for KSE-100
            </p>
          </div>
        </section>

        {/* Signals Section */}
        <section id="signals" className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <SectionTitle 
              icon={Bell} 
              title="Stock Signals" 
              subtitle="High precision trade entry points and price targets for active monitoring." 
            />
            <button 
              onClick={() => setIsAddingSignal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-5 h-5" />
              Add Signal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {signals.map(signal => (
              <SignalFlashcard key={signal.id} signal={signal} onDelete={deleteSignal} />
            ))}
            {signals.length === 0 && (
              <div className="col-span-full py-20 text-center glass-card rounded-3xl border-dashed">
                <p className="text-slate-500">No active signals found. Start by adding one above.</p>
              </div>
            )}
          </div>
        </section>

        {/* Analysis Section (Now with Scrip Normalization) */}
        <section id="analysis" className="mb-20">
          <SectionTitle 
            icon={Search} 
            title="Stock Intelligence" 
            subtitle="Analyze how different brokers perceive the same stock. Cross-institutional comparison with merged alias support (e.g. OGDC/OGDCL)." 
          />

          <div className="glass-card rounded-3xl p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-10">
              <div className="w-full md:w-1/3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Select Scrip</label>
                <div className="relative">
                  <select 
                    value={selectedAnalysisStock}
                    onChange={(e) => setSelectedAnalysisStock(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none focus:outline-none focus:border-blue-500 transition-all font-bold"
                  >
                    {allAvailableStocks.map(stock => (
                      <option key={stock} value={stock} className="bg-slate-900">{stock}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                {consensusMetrics && (
                  <div className="mt-8 space-y-4">
                    <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Market Consensus TP</p>
                      <p className="text-3xl font-black text-white">{consensusMetrics.avg} <span className="text-sm font-medium text-slate-500">PKR</span></p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Bullish Target</p>
                        <p className="text-xl font-bold text-emerald-400">{consensusMetrics.high}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Conservative</p>
                        <p className="text-xl font-bold text-red-400">{consensusMetrics.low}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 italic text-center">Based on coverage from {consensusMetrics.count} brokers</p>
                  </div>
                )}
              </div>

              <div className="w-full md:w-2/3">
                <div className="h-[350px] w-full bg-white/5 rounded-2xl p-4 border border-white/5">
                  <h4 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2">
                    <BarChartIcon className="w-4 h-4 text-emerald-400" />
                    Target Price Variance Analysis
                  </h4>
                  {crossBrokerData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={crossBrokerData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="broker" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
                        <Tooltip 
                          contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="tp" radius={[8, 8, 0, 0]} barSize={40}>
                          {crossBrokerData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.tp >= (consensusMetrics?.avg || 0) ? '#10b981' : '#3b82f6'} 
                              fillOpacity={0.8}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500">
                      No comparative data available for this selection.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/5">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Financial Institution</th>
                    <th className="px-6 py-4">2026 Price Target</th>
                    <th className="px-6 py-4">Projected Upside</th>
                    <th className="px-6 py-4 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {crossBrokerData.map((data, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-200">{data.broker}</td>
                      <td className="px-6 py-4 font-mono text-emerald-400">{data.tp}</td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-bold">
                          {data.upside}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <div key={star} className={`w-1.5 h-3 rounded-full ${star <= (i % 3 + 3) ? 'bg-blue-500' : 'bg-slate-800'}`} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Brokers Selection Grid */}
        <section id="brokers" className="mb-20">
          <SectionTitle 
            icon={Layers} 
            title="Institutional Lookouts" 
            subtitle="Browse individual broker reports and their high-conviction recommendations for the 2026 fiscal cycle." 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {BROKERS_DATA.map((broker, idx) => (
              <BrokerCard 
                key={idx} 
                data={broker} 
                index={idx} 
                isSelected={selectedBroker.name === broker.name}
                onClick={() => setSelectedBroker(broker)}
              />
            ))}
          </div>

          {/* Selected Broker Details */}
          {selectedBroker && (
            <div className="glass-card rounded-3xl p-1 overflow-hidden animate-in fade-in duration-500">
              <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">{selectedBroker.name}</h3>
                  <div className="flex gap-4 items-center">
                    <span className="flex items-center gap-2 text-sm text-slate-400">
                      <Target className="w-4 h-4 text-emerald-400" />
                      Target: <b className="text-white">{selectedBroker.indexTarget}</b>
                    </span>
                    <span className="flex items-center gap-2 text-sm text-slate-400">
                      <Info className="w-4 h-4 text-blue-400" />
                      Recommendations: <b className="text-white">{selectedBroker.recommendations.length}</b>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl">
                   <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {i}
                        </div>
                      ))}
                   </div>
                   <span className="text-xs text-slate-500 px-2">Top Tiers</span>
                </div>
              </div>
              <div className="bg-slate-900/30">
                <StockTable recommendations={selectedBroker.recommendations} />
              </div>
            </div>
          )}
        </section>

        {/* Analytics Section */}
        <section id="analytics" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SectionTitle 
              icon={BarChart3} 
              title="Top Upside Potential" 
              subtitle="Aggregated list of stocks across all brokers with the highest projected capital gain potential." 
            />
            <div className="glass-card rounded-2xl p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topUpsideData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="stock" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                  />
                  <Bar dataKey="upside" radius={[0, 4, 4, 0]} barSize={20}>
                    {topUpsideData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index < 3 ? '#10b981' : '#3b82f6'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <SectionTitle 
              icon={PieIcon} 
              title="Sector Exposure" 
              subtitle="Where the big money is expected to flow in 2026 according to top institutional strategy papers." 
            />
            <div className="glass-card rounded-2xl p-6 h-[400px] flex flex-col items-center">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {sectorDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 w-full px-4">
                {sectorDistribution.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.fill }} />
                    <span className="text-[10px] text-slate-400 truncate">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Modal for adding signal */}
        {isAddingSignal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <div className="glass-card w-full max-w-lg rounded-3xl p-8 border-white/10 animate-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white">Create Signal</h3>
                <button onClick={() => setIsAddingSignal(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddSignal} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1 mb-1 block">Stock Symbol</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. MEBL" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                      value={newSignal.symbol}
                      onChange={e => setNewSignal({...newSignal, symbol: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1 mb-1 block">Buy Range</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 440-450" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                      value={newSignal.buyingRange}
                      onChange={e => setNewSignal({...newSignal, buyingRange: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1 mb-1 block">TP 1</label>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      value={newSignal.tp1 || ''}
                      onChange={e => setNewSignal({...newSignal, tp1: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1 mb-1 block">TP 2</label>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      value={newSignal.tp2 || ''}
                      onChange={e => setNewSignal({...newSignal, tp2: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1 mb-1 block">Stop Loss</label>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                      value={newSignal.sl || ''}
                      onChange={e => setNewSignal({...newSignal, sl: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-bold ml-1 mb-2 block">Investment Horizon</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['long', 'moderate', 'swing'] as SignalType[]).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewSignal({...newSignal, type})}
                        className={`py-3 rounded-xl text-xs font-bold uppercase transition-all ${
                          newSignal.type === type 
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest mt-4 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  Confirm Signal
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer info */}
        <footer className="mt-24 pt-12 border-t border-white/5 text-center">
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Zap className="w-4 h-4 text-emerald-400" />
              Powered by GenAI Market Analysis
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Fiscal 2026 Strategy
            </div>
          </div>
          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            Investment in securities market are subject to market risks. Please read all relevant documents 
            carefully before investing. Data aggregated from public broker reports as of late 2025.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
