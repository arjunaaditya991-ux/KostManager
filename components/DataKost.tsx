import React, { useState } from 'react';
import { Home, MapPin, Building2, Layers, CheckCircle2, Save } from 'lucide-react';

interface DataKostProps {
  triggerAlert: (text: string, type?: 'success' | 'error') => void;
}

export const DataKost: React.FC<DataKostProps> = ({ triggerAlert }) => {
  const [kostName, setKostName] = useState('Kost Aditya Premium');
  const [kostAddress, setKostAddress] = useState('Jl. Kaliurang KM 5.6, Sleman, D.I. Yogyakarta');
  const [floors, setFloors] = useState(3);
  const [facility, setFacility] = useState(['WiFi Gratis', 'CCTV 24 Jam', 'Dapur Umum', 'Parkir Motor Luas']);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerAlert('Data properti kost berhasil diperbarui!');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300" id="data-kost-view">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Karakteristik &amp; Data Kost</h2>
        <p className="text-sm text-slate-500">Sesuaikan profil asrama kost, rincian lokasi fisik, serta fasilitas penunjang utama.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Settings */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-base mb-4 border-b border-slate-100 pb-3">Profil Properti</h3>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Properti Kost</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                <input 
                  type="text" 
                  value={kostName}
                  onChange={(e) => setKostName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-505 focus:bg-white text-xs sm:text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all font-bold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alamat Fisik Lengkap</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                <textarea 
                  rows={2}
                  value={kostAddress}
                  onChange={(e) => setKostAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-505 focus:bg-white text-xs sm:text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all font-semibold text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jumlah Lantai</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                  <input 
                    type="number" 
                    value={floors}
                    onChange={(e) => setFloors(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 pl-10 pr-4 outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kategori Jenis</label>
                <select className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-3 outline-none font-bold">
                  <option>Kost Campur</option>
                  <option>Kost Khusus Putra</option>
                  <option>Kost Khusus Putri</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                id="btn-save-data-kost"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          
          <h3 className="font-bold text-white text-base mb-4 inline-flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-400" />
            Detail Fasilitas Utama
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Rangkaian fasilitas yang Anda daftarkan otomatis muncul di kuitansi digital bermerek asrama Anda.
          </p>

          <div className="space-y-3.5">
            {facility.map((fac, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-200 bg-slate-800/60 px-3.5 py-3 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{fac}</span>
              </div>
            ))}
          </div>

          <div className="h-[1px] bg-slate-800/80 my-6" />

          <div className="text-[10px] text-slate-450 italic">
            * Fasilitas tambahan dapat diedit sewaktu-waktu oleh Arjuna Aditya selaku administrator utama.
          </div>
        </div>

      </div>
    </div>
  );
};
