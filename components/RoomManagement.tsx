import React, { useState } from 'react';
import { Room } from './Dashboard';
import { formatCurrency } from '../lib/utils';
import { DoorClosed, DoorOpen, Plus, Search, Hammer, Eye, Wrench, RefreshCw, Trash2 } from 'lucide-react';

interface RoomManagementProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  triggerAlert: (text: string, type?: 'success' | 'error') => void;
}

export const RoomManagement: React.FC<RoomManagementProps> = ({ 
  rooms, 
  setRooms,
  triggerAlert
}) => {
  const [filter, setFilter] = useState<'Semua' | 'Terisi' | 'Kosong' | 'Perbaikan'>('Semua');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New room state
  const [number, setNumber] = useState('');
  const [type, setType] = useState('AC + Kamar Mandi Dalam');
  const [price, setPrice] = useState('750000');
  const [status, setStatus] = useState<'Terisi' | 'Kosong' | 'Perbaikan'>('Kosong');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) return;

    if (rooms.some(r => r.number.toLowerCase() === number.trim().toLowerCase())) {
      triggerAlert('Nomor kamar sudah ada!', 'error');
      return;
    }

    const priceNum = parseInt(price) || 750000;
    const newRoom: Room = {
      number: number.trim().toUpperCase(),
      type,
      price: priceNum,
      status
    };

    setRooms(prev => [...prev, newRoom]);
    setShowAddModal(false);
    setNumber('');
    triggerAlert(`Kamar ${newRoom.number} berhasil ditambahkan!`);
  };

  const toggleRoomStatus = (roomNumber: string) => {
    setRooms(prev => prev.map(r => {
      if (r.number === roomNumber) {
        let nextStatus: 'Terisi' | 'Kosong' | 'Perbaikan' = 'Kosong';
        if (r.status === 'Kosong') nextStatus = 'Perbaikan';
        else if (r.status === 'Perbaikan') nextStatus = 'Kosong';
        else {
          triggerAlert('Status "Terisi" hanya bisa diubah dengan mengeluarkan penghuni di tab Penghuni!', 'error');
          return r;
        }
        triggerAlert(`Kamar ${roomNumber} diubah ke status: ${nextStatus}`);
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const handleDeleteRoom = (roomNumber: string) => {
    const r = rooms.find(rm => rm.number === roomNumber);
    if (r && r.status === 'Terisi') {
      triggerAlert('Tidak dapat menghapus kamar yang sedang Terisi!', 'error');
      return;
    }
    setRooms(prev => prev.filter(rm => rm.number !== roomNumber));
    triggerAlert(`Kamar ${roomNumber} berhasil dihapus.`);
  };

  const filteredRooms = rooms.filter(r => {
    const matchesFilter = filter === 'Semua' || r.status === filter;
    const matchesSearch = r.number.toLowerCase().includes(search.toLowerCase()) || 
                          r.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300" id="room-management-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Kamar</h2>
          <p className="text-sm text-slate-500">Kelola kamar, atur tarif sewa bulanan, dan audit status ketersediaan.</p>
        </div>
        <button 
          id="btn-tambah-kamar-tab"
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/10 self-start sm:self-auto active:scale-95 duration-100"
        >
          <Plus className="w-5 h-5" />
          Tambah Kamar Baru
        </button>
      </div>

      {/* Filters and search row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search */}
        <div className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-xl flex items-center gap-3 shadow-xs">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nomor kamar atau tipe..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-xs sm:text-sm font-medium text-slate-800"
          />
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-2">
          {(['Semua', 'Terisi', 'Kosong', 'Perbaikan'] as const).map((label) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                filter === label
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="rooms-grid">
        {filteredRooms.map((room) => (
          <div 
            key={room.number} 
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all relative group"
            id={`room-card-${room.number}`}
          >
            <div>
              {/* Header inside room card */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    room.status === 'Terisi' ? 'bg-red-50 text-red-600 border border-red-100' :
                    room.status === 'Kosong' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {room.status === 'Terisi' ? <DoorClosed className="w-5.5 h-5.5" /> : 
                     room.status === 'Kosong' ? <DoorOpen className="w-5.5 h-5.5" /> : 
                     <Hammer className="w-5.5 h-5.5 animate-pulse" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-base">Kamar {room.number}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{room.type}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                  room.status === 'Terisi' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                  room.status === 'Kosong' ? 'bg-slate-200 text-slate-700' :
                  'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {room.status === 'Terisi' ? 'Terisi' : room.status === 'Kosong' ? 'Tersedia' : 'Perbaikan'}
                </span>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500">Harga Bulanan</span>
                <span className="font-black text-slate-900">{formatCurrency(room.price)}</span>
              </div>

              {/* Tenant info */}
              {room.status === 'Terisi' ? (
                <div className="mt-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Penyewa Aktif</p>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">{room.tenant}</p>
                </div>
              ) : room.status === 'Kosong' ? (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-500 font-medium">
                  Kamar ini kosong &amp; siap huni
                </div>
              ) : (
                <div className="mt-4 p-3 bg-amber-55/10 rounded-xl border border-amber-100/50 text-center text-xs text-amber-800 font-bold">
                  Maintenance Renovasi
                </div>
              )}
            </div>

            {/* Quick Interactive Actions inside Card */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
              {room.status !== 'Terisi' ? (
                <button 
                  onClick={() => toggleRoomStatus(room.number)}
                  className="flex-1 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-bold rounded-xl text-xs transition-colors border border-slate-200/80 inline-flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Ubah Kesiapan
                </button>
              ) : (
                <div className="flex-1 text-center py-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 rounded-xl border border-dashed border-slate-200 select-none">
                  Kamar Unlocked Lunas
                </div>
              )}
              
              <button 
                onClick={() => handleDeleteRoom(room.number)}
                title="Hapus Kamar"
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-slate-200 hover:border-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3">
          <DoorOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">Tidak ada kamar ditemukan</h3>
          <p className="text-xs text-slate-450 max-w-md mx-auto">
            Silakan sesuaikan filter pencarian atau tambahkan kamar baru untuk asrama Anda.
          </p>
        </div>
      )}

      {/* Add Room Modal Tab */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-150 animate-in zoom-in-95 duration-105">
            <h3 className="text-lg font-black text-slate-900 mb-2">Tambah Kamar Baru</h3>
            <p className="text-xs text-slate-500 mb-4">Mendaftarkan unit akomodasi baru ke server KosManage.</p>
            
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Kamar</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: B03, B04"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 px-4 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipe Kamar</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none font-bold"
                >
                  <option value="AC + Kamar Mandi Dalam">AC + Kamar Mandi Dalam</option>
                  <option value="Ekonomi Kipas">Ekonomi Kipas</option>
                  <option value="Standard AC">Standard AC</option>
                  <option value="Suite Premium">Suite Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tarif Bulanan (Rp)</label>
                <input 
                  type="number" 
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Contoh: 750000"
                  className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status Kesiapan</label>
                <div className="flex gap-4">
                  {(['Kosong', 'Perbaikan'] as const).map((st) => (
                    <label key={st} className="flex items-center gap-2 text-xs font-bold text-slate-705 cursor-pointer">
                      <input 
                        type="radio" 
                        name="add-tab-status" 
                        checked={status === st}
                        onChange={() => setStatus(st)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      {st === 'Kosong' ? 'Tersedia' : 'Rangka Perbaikan'}
                    </label>
                  ))}
                </div>
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
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Simpan Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
