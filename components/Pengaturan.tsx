import React, { useState } from 'react';
import { Settings, User, Mail, Shield, Bell, Save, Info, RefreshCw } from 'lucide-react';

interface PengaturanProps {
  triggerAlert: (text: string, type?: 'success' | 'error') => void;
}

export const Pengaturan: React.FC<PengaturanProps> = ({ triggerAlert }) => {
  const [userName, setUserName] = useState('Arjuna Aditya');
  const [userEmail, setUserEmail] = useState('arjuna@kosmanage.com');
  const [notifyWA, setNotifyWA] = useState(true);
  const [theme, setTheme] = useState('SaaS Light Theme');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerAlert('Konfigurasi akun &amp; preferensi dashboard berhasil disimpan!');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300" id="pengaturan-tab-view">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pengaturan Akun &amp; Sistem</h2>
        <p className="text-sm text-slate-500">Sesuaikan data kredensial masuk akun, preferensi notifikasi, dan hak akses keamanan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-sm mb-4 border-b border-slate-100 pb-3">Detail Kredensial</h3>
          
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Nama Lengkap Pemilik</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Alamat Email Kunci</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all font-bold text-slate-705"
                  />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-slate-100 my-4" />

            <h3 className="font-extrabold text-slate-900 text-sm mb-3">Preferensi Notifikasi &amp; Sistem</h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-150 cursor-pointer hover:bg-slate-100/50 transition-colors">
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 leading-none">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    Ingatkan WhatsApp Otomatis
                  </span>
                  <p className="text-[10px] text-slate-450">Tampilkan draf WhatsApp ditiap pengingat jatuh tempo.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyWA}
                  onChange={(e) => setNotifyWA(e.target.checked)}
                  className="w-4.5 h-4.5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </label>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-150">
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-804 flex items-center gap-1.5 leading-none">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Enkripsi File Cadangan
                  </span>
                  <p className="text-[10px] text-slate-450">Melindungi berkas identitas penyewa dengan enkripsi SHA.</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded">
                  AKTIF
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                id="btn-save-pengaturan"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Save className="w-4 h-4" />
                Simpan Pengaturan
              </button>
            </div>
          </form>
        </div>

        {/* Action center side */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm mb-2 inline-flex items-center gap-2">
              <Info className="w-4.5 h-4.5 text-emerald-600" />
              Pusat Dukungan
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Jika mengalami kendala teknis penataan server draf, silakan lakukan reset state default database lokal atau hubungi administrator pengawas kami.
            </p>

            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin memulihkan database default?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full py-3 bg-red-50 text-red-700 hover:bg-red-100/90 font-extrabold text-xs rounded-xl border border-red-100 transition-colors inline-flex items-center justify-center gap-1.5"
              id="btn-reset-db"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Database Ke Default
            </button>
          </div>

          <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center select-none">
            KosManage Version 1.4.0 (Stable)
          </div>
        </div>

      </div>
    </div>
  );
};
