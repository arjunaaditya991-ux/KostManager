import React from 'react';
import { StatsCard } from './StatsCard';
import { 
  Users, 
  TrendingUp, 
  DoorClosed, 
  DoorOpen, 
  Plus, 
  MoreHorizontal 
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { mockTransactions } from '../mockData';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Ringkasan Dashbor</h2>
          <p className="text-slate-500">Selamat datang kembali! Inilah statistik kos Anda saat ini.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">
            Ekspor Laporan
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            Penghuni Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Penghuni" 
          value="48" 
          icon={Users} 
          trend="+4" 
          trendType="positive"
        />
        <StatsCard 
          title="Pendapatan Bulan Ini" 
          value={formatCurrency(75000000)} 
          icon={TrendingUp} 
          trend="+12%" 
          trendType="positive"
        />
        <StatsCard 
          title="Kamar Terisi" 
          value="42" 
          icon={DoorClosed} 
          trend="84%" 
          trendType="neutral"
        />
        <StatsCard 
          title="Kamar Kosong" 
          value="8" 
          icon={DoorOpen} 
          trend="-2" 
          trendType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-bold text-secondary">Transaksi Terakhir</h4>
            <button className="text-primary text-sm font-semibold hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Penghuni</th>
                  <th className="px-6 py-4 font-semibold">Tanggal</th>
                  <th className="px-6 py-4 font-semibold">Jumlah</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-secondary text-sm">{tx.tenantName}</p>
                      <p className="text-xs text-slate-500">Kamar {tx.id.replace('T', '10')}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{tx.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-secondary">{formatCurrency(tx.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        tx.status === 'Paid' ? 'bg-accent/10 text-accent' : 
                        tx.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {tx.status === 'Paid' ? 'Lunas' : tx.status === 'Pending' ? 'Tertunda' : 'Jatuh Tempo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-secondary">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <div className="p-6 border-b border-slate-100">
            <h4 className="font-bold text-secondary">Pengingat Cepat</h4>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-yellow-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-secondary">Tinjau Harga Sewa</p>
                <p className="text-xs text-slate-500 mt-1">Tinjau harga sewa untuk kamar lantai 3 minggu depan.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="text-red-500 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-secondary">Kontrak Berakhir</p>
                <p className="text-xs text-slate-500 mt-1">Budi Santoso dan 2 lainnya memiliki kontrak yang berakhir bulan ini.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
