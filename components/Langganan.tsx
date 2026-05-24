import React from 'react';
import { Award, Check, Crown, Flame, Sparkles, Zap } from 'lucide-react';

interface LanggananProps {
  triggerAlert: (text: string, type?: 'success' | 'error') => void;
  subscriptionStatus: 'active' | 'inactive';
  setSubscriptionStatus: (status: 'active' | 'inactive') => void;
}

export const Langganan: React.FC<LanggananProps> = ({ 
  triggerAlert,
  subscriptionStatus,
  setSubscriptionStatus
}) => {
  const handleUpgrade = () => {
    if (subscriptionStatus === 'inactive') {
      setSubscriptionStatus('active');
      triggerAlert('Langganan Berhasil Diaktifkan! Selamat menikmati fitur premium KosManage.');
    } else {
      triggerAlert('Terima kasih! Anda sedang berada dalam langganan aktif Paket Bulanan Pro.');
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300" id="langganan-tab-view">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Status Paket &amp; Langganan</h2>
        <p className="text-sm text-slate-500">Pantau masa aktif keanggotaan Pro KosManage Anda serta riwayat tagihan penagihan SaaS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Active subscription card */}
        <div className="md:col-span-2 bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-0" />
          
          <div className="flex justify-between items-start flex-wrap gap-4 relative z-10">
            <div>
              {subscriptionStatus === 'active' ? (
                <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-wider border border-emerald-500/30">
                  PRO ACTIVE
                </span>
              ) : (
                <span className="px-3.5 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase rounded-full tracking-wider border border-amber-500/30">
                  BELUM BERLANGGANAN
                </span>
              )}
              <h2 className="text-3xl font-black text-white tracking-tight mt-3">Paket Bulanan</h2>
              <p className="text-xs text-slate-400 mt-2">Lisensi sewa bulanan aman tanpa batas kamar.</p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-white">Rp50.000</span>
              <p className="text-xs text-slate-400">/ bulan (PPN inklusif)</p>
            </div>
          </div>

          <div className="h-[1px] bg-slate-850 my-6 relative z-10" />

          <div className="space-y-4 relative z-10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Keunggulan Paket:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {[
                'Tanpa batas jumlah kamar',
                'Kelola data penghuni',
                'Catatan pembayaran',
                'Reminder jatuh tempo',
                'Laporan pendapatan bulanan'
              ].map((fet, idx) => (
                <div key={idx} className="flex items-center gap-2.5 font-bold text-slate-200">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${subscriptionStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className={subscriptionStatus === 'active' ? 'text-slate-200' : 'text-slate-400'}>{fet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-slate-850 my-6 relative z-10" />

          <div className="flex justify-between items-center flex-wrap gap-4 relative z-10 text-xs sm:text-sm font-medium">
            {subscriptionStatus === 'active' ? (
              <p className="text-slate-400">Masa perpanjangan otomatis berikutnya: <span className="text-emerald-400 font-bold">23 Juni 2026</span></p>
            ) : (
              <p className="text-slate-400">Status langganan saat ini: <span className="text-amber-400 font-bold">Tidak Aktif</span></p>
            )}
            <button 
              id="btn-langganan-lunas"
              onClick={handleUpgrade}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              {subscriptionStatus === 'active' ? 'Kelola Metode Bayar' : 'Aktifkan Paket Premium'}
            </button>
          </div>
        </div>

        {/* Pricing Info Right Sidebar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            
            <h3 className="font-extrabold text-slate-905 text-lg">Investasi Sederhana</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kami menetapkan satu paket harga agar dapat dinikmati secara merata oleh semua kalangan pemilik properti dan kos-kosan di Indonesia tanpa batasan quota.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-500 font-bold">
                <span>Rasio Kamar</span>
                <span className="text-slate-900 font-black">Tanpa Batas</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-bold">
                <span>Biaya Admin</span>
                <span className="text-emerald-600 font-black">Gratis Rp0</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 font-medium">
                <span>Mata Uang</span>
                <span className="text-slate-900 font-bold">Indonesian Rupiah (IDR)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 italic">
            Metode pembayaran didukung: GoPay, ShopeePay, Transfer Bank VA, Credit Card.
          </div>
        </div>

      </div>
    </div>
  );
};
