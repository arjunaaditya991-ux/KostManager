import React from 'react';
import { mockRooms } from '../mockData';
import { formatCurrency } from '../lib/utils';
import { DoorClosed, DoorOpen, Plus, MoreHorizontal, LayoutGrid, List } from 'lucide-react';

export const RoomManagement: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Dashbor Kamar</h2>
          <p className="text-slate-500">Gambaran umum semua kamar dan ketersediaannya di setiap lantai.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden p-1">
            <button className="p-2 bg-slate-100 rounded-lg text-primary"><LayoutGrid className="w-5 h-5" /></button>
            <button className="p-2 text-slate-400 hover:text-slate-600"><List className="w-5 h-5" /></button>
          </div>
          <button className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            Tambah Kamar
          </button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar">
        {['Semua Kamar', 'Lantai 1', 'Lantai 2', 'Lantai 3', 'Terisi', 'Kosong'].map((label, i) => (
          <button 
            key={i}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              i === 0 ? 'bg-secondary text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-primary/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockRooms.map((room) => (
          <div key={room.id} className="glass-card group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${room.isOccupied ? 'bg-red-50 text-red-500' : 'bg-accent/10 text-accent'}`}>
                  {room.isOccupied ? <DoorClosed className="w-6 h-6" /> : <DoorOpen className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-secondary">Kamar {room.number}</h4>
                  <p className="text-xs text-slate-500">Tipe {room.type}</p>
                </div>
              </div>
              <button className="text-slate-300 hover:text-secondary"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</p>
                  <p className={`text-sm font-bold mt-0.5 ${room.isOccupied ? 'text-red-500' : 'text-accent'}`}>
                    {room.isOccupied ? 'Terisi' : 'Tersedia'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Per Bulan</p>
                  <p className="text-sm font-bold text-secondary mt-0.5">{formatCurrency(room.price)}</p>
                </div>
              </div>
              
              {room.isOccupied ? (
                <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-primary">JD</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-secondary">Penghuni Ada</p>
                    <p className="text-[10px] text-slate-500">Dibayar s/d 15 Apr</p>
                  </div>
                </div>
              ) : (
                <button className="w-full py-2.5 bg-primary/5 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all">
                  Tambah Penghuni Baru
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
