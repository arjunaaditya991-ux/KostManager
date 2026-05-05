import React from 'react';
import { mockTenants } from '../mockData';
import { formatCurrency } from '../lib/utils';
import { Search, UserPlus, Filter, MoreVertical, Phone, Mail } from 'lucide-react';

export const TenantManagement: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Manajemen Penghuni</h2>
          <p className="text-slate-500">Kelola data penghuni kos aktif Anda di sini.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
          <UserPlus className="w-5 h-5" />
          Tambah Penghuni
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white border border-slate-200 p-2.5 rounded-xl flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input type="text" placeholder="Cari nama, kamar, atau telepon..." className="w-full bg-transparent outline-none text-sm font-medium" />
        </div>
        <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Nama Penghuni</th>
                <th className="px-6 py-4">Kamar</th>
                <th className="px-6 py-4">No. Telepon</th>
                <th className="px-6 py-4">Mulai Sewa</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-secondary font-bold text-sm">{tenant.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="font-bold text-secondary text-sm">{tenant.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-primary rounded-lg text-xs font-bold">Kamar {tenant.roomNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {tenant.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tenant.startDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      tenant.status === 'Active' ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tenant.status === 'Active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-secondary p-1 rounded-lg hover:bg-slate-100 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
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
