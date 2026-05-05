import React from 'react';
import { motion } from 'motion/react';
import { 
  DoorOpen, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <DoorOpen className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-secondary">KostManager</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Fitur</a>
              <a href="#solutions" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Solusi</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Harga</a>
              <button 
                onClick={onStart}
                className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
              >
                Mulai Uji Coba Gratis
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-4">
            <a href="#features" className="block text-slate-600">Fitur</a>
            <a href="#solutions" className="block text-slate-600">Solusi</a>
            <a href="#pricing" className="block text-slate-600">Harga</a>
            <button 
              onClick={onStart}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
            >
              Mulai Uji Coba Gratis
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 bg-blue-50 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-6 inline-block">
              Solusi PropTech untuk Pemilik Kost
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-secondary mb-6 leading-tight">
              Kelola Properti Anda <br /> 
              <span className="text-primary italic">Tanpa Stress</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Otomatisasi pelacakan sewa, ketersediaan kamar, dan manajemen penghuni. 
              Sistem lengkap yang dirancang untuk pemilik kost modern di Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group"
              >
                Buka Dashbor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg text-slate-600 hover:bg-slate-50 transition-all">
                Lihat Video Demo
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-16 relative mx-auto max-w-5xl"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2rem] blur-2xl -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1554224155-1696413575b9?auto=format&fit=crop&q=80&w=2000" 
              alt="Pratinjau Dashbor" 
              className="rounded-2xl shadow-2xl border border-slate-200"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary mb-4">Semua yang Anda Butuhkan untuk Skala Besar</h2>
            <p className="text-slate-600">Pembukuan manual lambat dan rawan kesalahan. KostManager menjaga akurasi Anda.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Manajemen Penghuni', desc: 'Profil detail, penyimpanan dokumen, dan pelacakan masuk/keluar penghuni.' },
              { icon: BarChart3, title: 'Analitik Pendapatan', desc: 'Laporan pendapatan real-time dan pelacakan pengeluaran dalam satu tampilan bersih.' },
              { icon: ShieldCheck, title: 'Aman & Terpercaya', desc: 'Data Anda dienkripsi dan dicadangkan setiap hari. Jangan pernah kehilangan catatan.' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-primary/30 transition-all hover:shadow-xl group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-md mx-auto bg-secondary p-8 md:p-12 rounded-[2.5rem] text-white text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Paket Power</h3>
            <p className="text-slate-400 mb-8">Satu harga simpel untuk semuanya.</p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-4xl font-bold">Rp50.000</span>
              <span className="text-slate-400">/ bulan</span>
            </div>
            <ul className="text-left space-y-4 mb-10">
              {['Kamar Tanpa Batas', 'Penghuni Tanpa Batas', 'Invoice Kustom', 'Dukungan Prioritas', 'Analitik Lengkap'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-accent w-5 h-5 flex-shrink-0" />
                  <span className="text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={onStart}
              className="w-full bg-white text-secondary py-4 rounded-xl font-bold hover:bg-slate-100 transition-all"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-secondary">KostManager</span>
          </div>
          <p className="text-slate-400 text-sm">© 2024 KostManager. Hak cipta dilindungi undang-undang.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">Privasi</a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
