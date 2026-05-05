import React from 'react';
import { mockTransactions } from '../mockData';
import { formatCurrency } from '../lib/utils';
import { Download, Plus, Search, Calendar, CreditCard, ChevronDown } from 'lucide-react';

export const Payments: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Pembayaran & Buku Besar</h2>
          <p className="text-slate-500">Lacak semua pembayaran masuk dan kelola status transaksi.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Download className="w-5 h-5" />
            Unduh CSV
          </button>
          <button className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            Catat Pembayaran
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary p-6 rounded-[1.5rem] text-white shadow-xl shadow-primary/20">
          <p className="text-sm font-medium opacity-80">Diterima Bulan Ini</p>
          <h3 className="text-3xl font-bold mt-2">{formatCurrency(65500000)}</h3>
          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-white/60">
            <Calendar className="w-4 h-4" />
            Sampai 22 April 2024
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-[1.5rem]">
          <p className="text-sm font-medium text-slate-500">Pembayaran Tertunda</p>
          <h3 className="text-3xl font-bold mt-2 text-secondary">{formatCurrency(12400000)}</h3>
          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-orange-500">
            8 penghuni menunggu
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-[1.5rem]">
          <p className="text-sm font-medium text-slate-500">Jatuh Tempo Tertagih</p>
          <h3 className="text-3xl font-bold mt-2 text-secondary">92%</h3>
          <div className="flex items-center gap-2 mt-4 text-xs font-bold text-accent">
            +5% dari bulan lalu
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h4 className="font-bold text-secondary">Riwayat Transaksi</h4>
          <div className="flex gap-2">
            <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari..." className="bg-transparent outline-none text-xs font-medium w-32" />
            </div>
            <button className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
              Metode <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">ID Transaksi</th>
                <th className="px-6 py-4">Penghuni</th>
                <th className="px-6 py-4">Jumlah</th>
                <th className="px-6 py-4">Metode</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{tx.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-secondary text-sm">{tx.tenantName}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-secondary">{formatCurrency(tx.amount)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      {tx.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      tx.status === 'Paid' ? 'bg-accent/10 text-accent' : 
                      tx.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'
                    }`}>
                      {tx.status === 'Paid' ? 'Lunas' : tx.status === 'Pending' ? 'Tertunda' : 'Jatuh Tempo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
