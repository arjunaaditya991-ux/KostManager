import React, { useState } from 'react';
import { 
  Lock, 
  CreditCard, 
  Bell, 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Crown, 
  Play, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface InactiveDashboardProps {
  setSubscriptionStatus: (status: 'active' | 'inactive') => void;
  triggerAlert: (text: string, type?: 'success' | 'error') => void;
}

export const InactiveDashboard: React.FC<InactiveDashboardProps> = ({
  setSubscriptionStatus,
  triggerAlert
}) => {
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [selectedLockedFeature, setSelectedLockedFeature] = useState<string>('');

  const lockedFeatures = [
    {
      id: 'tab-pembayaran',
      title: 'Tagihan & QRIS',
      icon: CreditCard,
      description: 'Sistem otomatis membuat tagihan sewa bulanan dan meregenerasi kode QRIS dinamis untuk pembayaran realtime serba cepat.',
    },
    {
      id: 'tab-reminder',
      title: 'Reminder Tagihan',
      icon: Bell,
      description: 'Kirim draf pesan penagihan tagihan sewa bulanan dan tautan QRIS otomatis langsung ke chat WhatsApp penghuni kost Anda.',
    },
    {
      id: 'tab-laporan',
      title: 'Laporan Pendapatan',
      icon: BarChart3,
      description: 'Pantau visualisasi grafik omzet bulanan, data pengeluaran, perbandingan okupansi kamar, dan laporan kas masuk digital.',
    },
    {
      id: 'tab-transaksi',
      title: 'Riwayat Transaksi',
      icon: TrendingUp,
      description: 'Pencatatan menyeluruh untuk setiap mutasi pembayaran sewa yang lunas secara historis dan terstruktur.',
    }
  ];

  const handleActivate = () => {
    setSubscriptionStatus('active');
    triggerAlert('Langganan Berhasil Diaktifkan! Selamat menikmati fitur premium KosManage.');
    setShowLockedModal(false);
  };

  const handleFeatureClick = (featureTitle: string) => {
    setSelectedLockedFeature(featureTitle);
    setShowLockedModal(true);
  };

  const handleDemo = () => {
    setSubscriptionStatus('active');
    triggerAlert('Simulasi Demo Aktif! Menjelajahi dashboard premium sebagai pemilik kost.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="inactive-dashboard-view">
      
      {/* Top Bar Status Badge */}
      <div className="flex justify-between items-center bg-white px-5 py-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Status Akun Pemilik Kost</span>
        </div>
        <span className="px-3.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black rounded-full select-none uppercase tracking-wide">
          Status: Belum Berlangganan
        </span>
      </div>

      {/* Main Banner */}
      <div className="bg-gradient-to-r from-slate-905 from-slate-900 to-emerald-950 text-white rounded-3xl p-8 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-64 h-64 bg-slate-550/5 rounded-full blur-2xl -z-0 pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-wider border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Keanggotaan Premium
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Aktifkan Langganan untuk Mulai Mengelola Kost
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl font-medium">
            Dengan KosManage, kamu bisa membuat tagihan bulanan otomatis, mengirim QRIS ke penghuni, memantau status pembayaran, dan melihat laporan pendapatan dalam satu dashboard.
          </p>

          <div className="h-[1px] bg-slate-800 my-2" />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={handleActivate}
              id="btn-interactive-activate-subscription"
              className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all duration-200 active:scale-98 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group"
            >
              <Crown className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              Aktifkan Langganan Rp50.000/bulan
            </button>
            <button
              onClick={handleDemo}
              id="btn-interactive-view-demo"
              className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold rounded-2xl text-xs sm:text-sm transition-all duration-200 active:scale-98 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              Lihat Demo Fitur
            </button>
          </div>
        </div>
      </div>

      {/* Locked Feature Section Header */}
      <div>
        <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          Fitur Premium Terkunci
          <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full select-none">MEMBUTUHKAN AKSES PRO</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">Upgrade langganan bulanan Anda seharga Rp50.000 untuk menikmati seluruh fitur penagihan pintar ini.</p>
      </div>

      {/* Locked Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="locked-features-grid">
        {lockedFeatures.map((feat) => (
          <div 
            key={feat.id}
            id={feat.id}
            onClick={() => handleFeatureClick(feat.title)}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-350 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 border border-slate-150 transition-colors flex items-center justify-center flex-shrink-0">
                  <feat.icon className="w-5.5 h-5.5 transition-transform group-hover:scale-110" />
                </div>
                
                {/* Locked Indicator Badge */}
                <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-650 hover:border-red-200 text-[10px] font-extrabold rounded-full tracking-wider select-none uppercase flex items-center gap-1.5 transition-colors">
                  <Lock className="w-3 h-3" />
                  Terkunci
                </span>
              </div>

              <div className="mt-4">
                <h4 className="font-black text-slate-900 text-base leading-tight group-hover:text-emerald-700 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                  {feat.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] font-black text-slate-500 group-hover:text-emerald-700 transition-colors">
              <span>Buka kunci fitur ini sekarang</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Locked Feature Detail Modal */}
      {showLockedModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-150 flex flex-col items-center text-center">
            
            <button 
              onClick={() => setShowLockedModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100 mb-4 animate-bounce mt-2 shadow-xs">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-900">Fitur Terkunci</h3>
            {selectedLockedFeature && (
              <p className="text-xs bg-slate-100 border border-slate-150 text-slate-600 font-extrabold px-3 py-1 rounded-lg mt-2 font-mono uppercase tracking-wide">
                Modul {selectedLockedFeature}
              </p>
            )}
            
            <p className="text-sm text-slate-500 mt-3 mb-6 font-medium leading-relaxed">
              Fitur ini tersedia setelah kamu mengaktifkan langganan KosManage.
            </p>

            <div className="w-full space-y-2.5">
              <button 
                onClick={handleActivate}
                id="btn-locked-modal-activate"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
              >
                <Crown className="w-4 h-4 text-amber-300 animate-pulse" />
                Aktifkan Langganan
              </button>
              <button 
                onClick={() => setShowLockedModal(false)}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs hover:text-slate-950 transition-all duration-150"
              >
                Kembali ke Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
