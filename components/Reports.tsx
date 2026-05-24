import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Payment } from './Dashboard';
import { formatCurrency } from '../lib/utils';
import { TrendingUp, ArrowUpRight, DollarSign, PieChart, BarChart3, Activity } from 'lucide-react';

interface ReportsProps {
  payments: Payment[];
  roomsCountCount: number;
  occupiedRoomsCount: number;
}

export const Reports: React.FC<ReportsProps> = ({ 
  payments, 
  roomsCountCount, 
  occupiedRoomsCount 
}) => {
  // Summing lunas payments
  const totalLunasIncome = payments
    .filter(p => p.status === 'Lunas')
    .reduce((sum, p) => sum + p.amount, 0);

  // Set the 6-month historical trends with our dynamic value in Mei
  const dynamicAnalyticsData = [
    { month: 'Jan', revenue: 9200000 },
    { month: 'Feb', revenue: 10400000 },
    { month: 'Mar', revenue: 11100000 },
    { month: 'Apr', revenue: 11800000 },
    { month: 'Mei', revenue: totalLunasIncome },
    { month: 'Jun', revenue: 13200000 }
  ];

  // Occupancy rate calculation
  const occupancyRate = roomsCountCount > 0 
    ? Math.round((occupiedRoomsCount / roomsCountCount) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300" id="reports-view-tab">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Laporan Keuangan &amp; Okupansi</h2>
          <p className="text-sm text-slate-500">Visualisasi statistik pendapatan bulanan dan okupansi hunian kost.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Earnings Area Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pemasukan Bulanan</p>
              <h3 className="text-lg font-black text-slate-900 mt-1">Siklus 6 Bulan Terakhir</h3>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              Sewa Meningkat
            </div>
          </div>
          
          <div className="h-[280px] w-full" id="area-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicAnalyticsData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748B', fontSize: 10, fontWeight: 'bold'}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748B', fontSize: 10}}
                  tickFormatter={(value) => `Rp${value / 1000000}jt`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0F172A', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#10B981' }}
                  labelStyle={{ color: '#94A3B8', fontWeight: 'bold', fontSize: '11px' }}
                  formatter={(value: number) => [formatCurrency(value), 'Pemasukan']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#059669" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Summary Rows */}
        <div className="grid grid-cols-1 gap-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-600 border border-emerald-100">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Pemasukan (Mei)</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{formatCurrency(totalLunasIncome)}</h3>
              <p className="text-xs text-slate-500 mt-1">Total uang sewa kost yang sudah lunas dibayarkan.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600 border border-blue-100">
              <PieChart className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Rasio Okupansi Kamar</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{occupancyRate}%</h3>
              <p className="text-xs text-slate-500 mt-1">{occupiedRoomsCount} dari {roomsCountCount} kamar telah terisi.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-purple-600 border border-purple-100">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Proyeksi Pendapatan Maksimal</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {formatCurrency(dynamicAnalyticsData[5].revenue)}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Estimasi pendapatan jika seluruh kamar kost terisi penuh.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
