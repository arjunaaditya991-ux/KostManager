import React, { useState } from 'react';
import { Tenant, Room } from './Dashboard';
import { formatCurrency, getTenantStatus } from '../lib/utils';
import { Search, UserPlus, Phone, Calendar, Trash2, Send, Filter, CheckCircle2, Clock } from 'lucide-react';

interface TenantManagementProps {
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  triggerAlert: (text: string, type?: 'success' | 'error') => void;
}

export const TenantManagement: React.FC<TenantManagementProps> = ({
  tenants,
  setTenants,
  rooms,
  setRooms,
  triggerAlert
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Lunas' | 'Unpaid'>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  // New tenant states
  const [name, setName] = useState('');
  const [roomNum, setRoomNum] = useState('');
  const [phone, setPhone] = useState('');
  const [rent, setRent] = useState('');
  const [dueDate, setDueDate] = useState('2026-05-25');

  const handleRegisterTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roomNum.trim()) return;

    // Find custom room
    const roomIdx = rooms.findIndex(r => r.number.toLowerCase() === roomNum.trim().toLowerCase());
    if (roomIdx === -1) {
      triggerAlert('Nomor Kamar tidak ditemukan!', 'error');
      return;
    }

    if (rooms[roomIdx].status === 'Terisi') {
      triggerAlert('Kamar tersebut sedang ditempati penyewa lain!', 'error');
      return;
    }

    const rentPrice = parseInt(rent) || rooms[roomIdx].price;

    const newTenant: Tenant = {
      id: 'T' + (tenants.length + 1),
      name: name.trim(),
      roomNumber: roomNum.trim().toUpperCase(),
      phone: phone.trim() || '0812-3456-7890',
      dueDate,
      status: 'Belum Bayar',
      monthlyRent: rentPrice
    };

    setTenants(prev => [...prev, newTenant]);
    
    // Update rooms status
    setRooms(prev => prev.map(r => 
      r.number.toUpperCase() === roomNum.trim().toUpperCase()
        ? { ...r, status: 'Terisi', tenant: name.trim() }
        : r
    ));

    setShowAddModal(false);
    setName('');
    setRoomNum('');
    setPhone('');
    triggerAlert(`Penyewa ${newTenant.name} terdaftar pada Kamar ${newTenant.roomNumber}`);
  };

  const handleRemoveTenant = (tenantId: string, roomNumber: string) => {
    const t = tenants.find(ten => ten.id === tenantId);
    if (!t) return;

    // Clear tenant from tenants state
    setTenants(prev => prev.filter(ten => ten.id !== tenantId));

    // Clear room state so it is Kosong
    setRooms(prev => prev.map(r => 
      r.number.toUpperCase() === roomNumber.toUpperCase()
        ? { ...r, status: 'Kosong', tenant: undefined }
        : r
    ));

    triggerAlert(`Penyewa ${t.name} dikeluarkan. Kamar ${roomNumber} kini tersedia.`);
  };

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.roomNumber.toLowerCase().includes(search.toLowerCase()) || 
                          t.phone.includes(search);
    
    let matchesStatus = true;
    const dynamicStatus = getTenantStatus(t.dueDate, t.status);
    if (statusFilter === 'Lunas') {
      matchesStatus = dynamicStatus === 'Lunas';
    } else if (statusFilter === 'Unpaid') {
      matchesStatus = dynamicStatus !== 'Lunas';
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300" id="tenant-management-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Penghuni</h2>
          <p className="text-sm text-slate-500">Administrasikan biodata penghuni, sewa jatuh tempo, dan riwayat kontak WhatsApp.</p>
        </div>
        <button 
          id="btn-tambah-penghuni-tab"
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/10 self-start sm:self-auto active:scale-95 duration-100"
        >
          <UserPlus className="w-5 h-5" />
          Daftarkan Penghuni Baru
        </button>
      </div>

      {/* Filters and search row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search */}
        <div className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-xl flex items-center gap-3 shadow-xs">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama penghuni, nomor kamar, atau WA..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-xs sm:text-sm font-medium text-slate-800"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2">
          {(['Semua', 'Lunas', 'Unpaid'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                statusFilter === filter
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter === 'Unpaid' ? 'Belum Bayar' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Tenants Table inside a Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden" id="tenants-table-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]/none">
                <th className="py-4 px-6">Nama Lengkap</th>
                <th className="py-4 px-6">Unit Kamar</th>
                <th className="py-4 px-6">Hubungi WhatsApp</th>
                <th className="py-4 px-6">Tanggal Tagihan</th>
                <th className="py-4 px-6">Sewa Bulanan</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTenants.map((ten) => (
                <tr key={ten.id} className="hover:bg-slate-50/55 transition-colors" id={`tenant-row-${ten.id}`}>
                  {/* Name and avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center border border-emerald-100">
                        {ten.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-950 text-sm leading-tight">{ten.name}</p>
                        <p className="text-[10px] text-slate-400 mt-1">ID Penyewa: {ten.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Room number tag */}
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-slate-100 font-extrabold text-slate-800 text-xs rounded-lg">
                      Kamar {ten.roomNumber}
                    </span>
                  </td>

                  {/* Phone contact */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-mono text-xs">{ten.phone}</span>
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="py-4 px-6 font-bold flex items-center gap-1.5 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-450" />
                    <span>{ten.dueDate}</span>
                  </td>

                  {/* Rent amount */}
                  <td className="py-2 px-6 font-extrabold text-slate-900">
                    {formatCurrency(ten.monthlyRent)}
                  </td>

                  {/* Payment status tag */}
                  <td className="py-2 px-6">
                    {(() => {
                      const dynamicStatus = getTenantStatus(ten.dueDate, ten.status);
                      return (
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${
                          dynamicStatus === 'Lunas' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                          dynamicStatus === 'Terlambat' ? 'bg-red-100 text-red-800 border-red-205' :
                          dynamicStatus === 'Jatuh Tempo Hari Ini' ? 'bg-orange-100 text-orange-800 border-orange-200 animate-pulse' :
                          'bg-amber-100 text-amber-805 border-amber-200'
                        }`}>
                          {dynamicStatus}
                        </span>
                      );
                    })()}
                  </td>

                  {/* Action items */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(() => {
                        const dynamicStatus = getTenantStatus(ten.dueDate, ten.status);
                        if (dynamicStatus !== 'Lunas') {
                          const formattedRent = formatCurrency(ten.monthlyRent);
                          const text = `Halo Kak ${ten.name}, kami mengingatkan bahwa pembayaran sewa kamar ${ten.roomNumber} sebesar ${formattedRent} jatuh tempo pada ${ten.dueDate}. Terima kasih.`;
                          return (
                            <a 
                              href={`https://wa.me/${ten.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Kirim Tagihan WhatsApp"
                              className="p-1.5 bg-emerald-55 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-150 inline-flex items-center gap-1 text-xs font-black active:scale-95"
                              id={`btn-wa-tenant-${ten.id}`}
                            >
                              <Send className="w-3.2 h-3.2 text-emerald-600" />
                              <span className="hidden lg:inline">Tagih</span>
                            </a>
                          );
                        }
                        return null;
                      })()}
                      
                      <button
                        onClick={() => handleRemoveTenant(ten.id, ten.roomNumber)}
                        title="Keluarkan Penyewa"
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg border border-slate-200 hover:border-red-100 transition-colors"
                        id={`btn-del-tenant-${ten.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredTenants.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3">
          <UserPlus className="w-12 h-12 text-slate-350 mx-auto animate-bounce" />
          <h3 className="font-extrabold text-slate-800 text-base">Tidak ada data penyewa ditemukan</h3>
          <p className="text-xs text-slate-450 max-w-sm mx-auto">
            Silakan sesuaikan kata kunci pencarian Anda atau rekrut penghuni baru pada unit kosong.
          </p>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-150 animate-in zoom-in-95 duration-110">
            <h3 className="text-lg font-black text-slate-900 mb-1">Mendaftarkan Penyewa Baru</h3>
            <p className="text-xs text-slate-500 mb-4">Pastikan data kamar telah disiapkan dengan status kosong sebelum menginput.</p>
            
            <form onSubmit={handleRegisterTenant} className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Penyewa</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Muhammad Budi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 px-4 outline-none transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Kamar</label>
                  <select
                    value={roomNum}
                    onChange={(e) => {
                      setRoomNum(e.target.value);
                      const matchedRoom = rooms.find(r => r.number === e.target.value);
                      if (matchedRoom) {
                        setRent(matchedRoom.price.toString());
                      }
                    }}
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-3 outline-none font-bold text-slate-705"
                  >
                    <option value="">Pilih--</option>
                    {rooms.filter(r => r.status === 'Kosong').map((room) => (
                      <option key={room.number} value={room.number}>Kamar {room.number}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sesuaikan Harga Sewa (Rp)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="Contoh: 750000"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">No. HP Aktif WA</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 px-4 outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mulai Tanggal Jatuh Tempo</label>
                <input 
                  type="date" 
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none font-bold"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                >
                  Daftarkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
