import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { analyticsData } from '../mockData';
import { formatCurrency } from '../lib/utils';
import { TrendingUp, ArrowUpRight, DollarSign, PieChart } from 'lucide-react';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Laporan Pendapatan</h2>
          <p className="text-slate-500">Analisis pendapatan properti dan pertumbuhan kos Anda dari waktu ke waktu.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary/10">
            <option>6 Bulan Terakhir</option>
            <option>Tahun Terakhir</option>
            <option>Semua Waktu</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm font-medium text-slate-500">Pertumbuhan Pendapatan</p>
              <h3 className="text-xl font-bold text-secondary">Performa Bulanan</h3>
            </div>
            <div className="flex items-center gap-2 text-accent font-bold text-sm bg-accent/10 px-3 py-1.5 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
              +24%
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  tickFormatter={(value) => `Rp${value / 1000000}jt`}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                  formatter={(value: number) => [formatCurrency(value), 'Pendapatan']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="glass-card p-6 flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pendapatan Tahun Ini</p>
              <h3 className="text-2xl font-bold text-secondary mt-1">{formatCurrency(36700000)}</h3>
              <p className="text-xs text-accent font-bold mt-1">Melebihi target sebesar 12%</p>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center gap-6">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <PieChart className="w-7 h-7 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rata-rata Hunian</p>
              <h3 className="text-2xl font-bold text-secondary mt-1">88.5%</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Rata-rata semua properti</p>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center gap-6">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-purple-600 w-7 h-7" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Proyeksi Pertumbuhan</p>
              <h3 className="text-2xl font-bold text-secondary mt-1">+Rp12.5jt</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Berdasarkan tren pemesanan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
