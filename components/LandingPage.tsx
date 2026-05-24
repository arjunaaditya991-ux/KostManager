import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DoorOpen, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Menu,
  X,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  Plus,
  Search,
  Building2,
  CreditCard,
  Bell,
  ChevronRight,
  Info,
  Phone,
  LayoutDashboard,
  Check,
  TrendingUp,
  Mail,
  Lock
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [kostNameInput, setKostNameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for Hero Interactive Dashboard Mockup
  const [mockActiveTab, setMockActiveTab] = useState<'kamar' | 'penghuni' | 'reminders'>('kamar');
  const [mockSelectedRoom, setMockSelectedRoom] = useState<number | null>(101);
  const [mockRoomFilter, setMockRoomFilter] = useState<'all' | 'occupied' | 'empty'>('all');

  // Interactive Room Data in Mockup
  const mockRooms = [
    { id: 101, type: 'AC + Kamar Mandi Dalam', tenant: 'Budi Santoso', phone: '0812-3456-7890', price: 1500000, status: 'occupied', due: '25 Mei 2026', paid: true },
    { id: 102, type: 'AC + Kamar Mandi Dalam', tenant: 'Rina Wijaya', phone: '0819-2783-9912', price: 1500000, status: 'occupied', due: '28 Mei 2026', paid: true },
    { id: 103, type: 'Standar AC', tenant: null, phone: '', price: 1200000, status: 'empty', due: '', paid: false },
    { id: 104, type: 'AC + Kamar Mandi Dalam', tenant: 'Ahmad Faisal', phone: '0857-1122-3344', price: 1500000, status: 'occupied', due: '29 Mei 2026', paid: false },
    { id: 105, type: 'Ekonomi Kipas', tenant: 'Siti Aminah', phone: '0813-8877-6655', price: 850000, status: 'occupied', due: '30 Mei 2026', paid: true },
    { id: 106, type: 'Standar AC', tenant: null, phone: '', price: 1200000, status: 'empty', due: '', paid: false },
  ];

  const filteredRooms = mockRooms.filter(room => {
    if (mockRoomFilter === 'occupied') return room.status === 'occupied';
    if (mockRoomFilter === 'empty') return room.status === 'empty';
    return true;
  });

  const selectedRoomDetails = mockRooms.find(r => r.id === mockSelectedRoom);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate register/login delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowAuthModal(false);
      onStart(); // Launch dashboard straight away
    }, 1000);
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-950 font-sans">
      
      {/* 1. Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-45 border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/10 group-hover:bg-emerald-700 transition-colors">
                <DoorOpen className="text-white w-5.5 h-5.5" />
              </div>
              <span className="text-xl font-bold text-slate-950 tracking-tight">
                Kos<span className="text-emerald-600">Manage</span>
              </span>
            </div>
            
            {/* Mid Menu Links */}
            <div className="hidden md:flex items-center gap-10">
              <a href="#fitur" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Fitur</a>
              <a href="#tentang" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Tentang</a>
              <a href="#harga" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Harga</a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => openAuth('login')}
                className="text-sm font-bold text-slate-700 hover:text-emerald-600 px-3 py-2 transition-colors"
                id="btn-navbar-login"
              >
                Login
              </button>
              <button 
                onClick={() => openAuth('register')}
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/25 active:scale-95 duration-150"
                id="btn-navbar-daftar"
              >
                Mulai Gratis
              </button>
            </div>

            {/* Mobile menu handler */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
                id="btn-navbar-mobile-toggle"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4"
            >
              <a href="#fitur" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-600 hover:text-emerald-600 py-1 transition-colors">Fitur</a>
              <a href="#tentang" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-600 hover:text-emerald-600 py-1 transition-colors">Tentang</a>
              <a href="#harga" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-600 hover:text-emerald-600 py-1 transition-colors">Harga</a>
              <div className="h-[1px] bg-slate-100 my-4" />
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => openAuth('login')}
                  className="w-full text-center py-3 font-semibold text-slate-700 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => openAuth('register')}
                  className="w-full text-center py-3 font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
                >
                  Mulai Gratis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-32 lg:pt-40 pb-20 sm:pb-28 px-4 bg-white overflow-hidden relative border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-br from-emerald-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-gradient-to-tr from-emerald-100/20 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider mb-6 inline-flex items-center gap-1.5 border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" /> 
                Aplikasi Manajemen Kost Pilihan Pemilik Property Modern
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 mb-6 leading-tight select-none">
                Kelola Kost, Penghuni, dan <br className="hidden sm:inline" />
                <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">Pembayaran</span> dalam Satu Dashboard
              </h1>
              <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                KosManage membantu pemilik kost mencatat kamar, penghuni, tagihan, jatuh tempo, dan laporan pendapatan tanpa catatan manual.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button 
                  onClick={() => openAuth('register')}
                  className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-3 active:scale-98 duration-150"
                  id="btn-hero-daftar"
                >
                  Mulai Gratis
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a 
                  href="#fitur"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200/80 rounded-xl font-bold text-base text-slate-700 text-center transition-all active:scale-98 duration-150 border border-slate-200/50"
                  id="btn-hero-fitur"
                >
                  Lihat Fitur
                </a>
              </div>
            </motion.div>
          </div>

          {/* Fully Interactive SaaS Dashboard Preview Container (The Mac Browser Frame) */}
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="relative mx-auto max-w-5xl rounded-2xl shadow-2xl border border-slate-200/80 bg-white overflow-hidden"
          >
            {/* Browser Header Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
              </div>
              <div className="bg-white border border-slate-200 text-[11px] text-slate-400 rounded-md py-1 px-4 text-center font-mono select-none w-72 md:w-96 truncate">
                <span className="text-emerald-600">https://</span>app.kosmanage.com/dashboard
              </div>
              <div className="w-10" />
            </div>

            {/* Simulated Live Interactive App Container */}
            <div className="bg-slate-50 text-slate-800 grid grid-cols-1 md:grid-cols-4 h-[520px] overflow-hidden">
              
              {/* Internal Mock Sidebar */}
              <div className="hidden md:flex flex-col bg-slate-900 text-slate-300 p-4 justify-between border-r border-slate-800">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 px-2">
                    <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <DoorOpen className="text-white w-4.5 h-4.5" />
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">KosManage App</span>
                  </div>
                  
                  <div className="space-y-1">
                    <button 
                      onClick={() => setMockActiveTab('kamar')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${mockActiveTab === 'kamar' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}
                    >
                      <Building2 className="w-4 h-4" />
                      Status Kamar
                    </button>
                    <button 
                      onClick={() => setMockActiveTab('penghuni')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${mockActiveTab === 'penghuni' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}
                    >
                      <Users className="w-4 h-4" />
                      Data Penghuni
                    </button>
                    <button 
                      onClick={() => setMockActiveTab('reminders')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${mockActiveTab === 'reminders' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}
                    >
                      <Bell className="w-4 h-4" />
                      Jatuh Tempo Rent
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-auto animate-pulse" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">P</div>
                  <div>
                    <p className="font-bold text-white truncate">Pak Adi Wibowo</p>
                    <p className="text-[9px]">Lelaki Kost Premium</p>
                  </div>
                </div>
              </div>

              {/* Main Content Workspace inside Browser Mockup */}
              <div className="col-span-1 md:col-span-3 p-5 flex flex-col h-full overflow-hidden">
                
                {/* Mockup Header tab description */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 flex-shrink-0">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      {mockActiveTab === 'kamar' && 'Manajemen Keterediaan Kamar'}
                      {mockActiveTab === 'penghuni' && 'Manajemen Database Penghuni'}
                      {mockActiveTab === 'reminders' && 'Buku Jatuh Tempo & Whatsapp Reminder'}
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded uppercase">Demo Interaktif</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">Uji seberapa rapi data Anda ditayangkan dalam dashboard real Kami</p>
                  </div>
                  
                  <button 
                    onClick={onStart}
                    className="text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-all"
                  >
                    Coba Full System <ChevronRight className="w-3 h-3 inline" />
                  </button>
                </div>

                {/* Dashboard Key Statistics Bar */}
                <div className="grid grid-cols-3 gap-3 mb-4 flex-shrink-0">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Okupansi Kost</p>
                    <p className="text-base font-black text-slate-900 mt-1">18 <span className="text-[11px] font-medium text-slate-400">/ 24 Kamar</span></p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Jumlah Pembayaran</p>
                    <p className="text-base font-black text-emerald-600 mt-1">Rp27.000.000</p>
                    <p className="text-[8px] text-slate-400 mt-1.5">Bulan Ini (Mei 2026)</p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative">
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Jatuh Tempo Harian</p>
                    <p className="text-base font-black text-red-600 mt-1">1 Kamar</p>
                    <p className="text-[8px] text-red-500 font-bold mt-1.5">Klik Tab &amp; Kirim WA</p>
                  </div>
                </div>

                {/* Simulated Interactive Tab Screen */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 overflow-y-auto min-h-0 relative">
                  
                  {/* Kamar View Card Container */}
                  {mockActiveTab === 'kamar' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex-shrink-0">
                        <span className="text-[10px] text-slate-400 font-bold">KLIK KAMAR DI BAWAH INI UNTUK MELIHAT INFORMASI</span>
                        <div className="flex gap-1">
                          <button onClick={() => setMockRoomFilter('all')} className={`px-2 py-0.5 text-[9px] font-bold rounded ${mockRoomFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'}`}>Semua</button>
                          <button onClick={() => setMockRoomFilter('occupied')} className={`px-2 py-0.5 text-[9px] font-bold rounded ${mockRoomFilter === 'occupied' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-200'}`}>Terisi</button>
                          <button onClick={() => setMockRoomFilter('empty')} className={`px-2 py-0.5 text-[9px] font-bold rounded ${mockRoomFilter === 'empty' ? 'bg-slate-100 text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}>Kosong</button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div className="md:col-span-3 grid grid-cols-3 gap-2">
                          {filteredRooms.map(room => (
                            <button
                              key={room.id}
                              onClick={() => setMockSelectedRoom(room.id)}
                              className={`p-2.5 rounded-lg text-left transition-all border ${
                                mockSelectedRoom === room.id 
                                  ? 'border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-600/15' 
                                  : room.status === 'occupied' 
                                    ? 'border-emerald-200 bg-white hover:bg-slate-50' 
                                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-extrabold text-xs text-slate-800">Kamar {room.id}</span>
                                <span className={`w-1.5 h-1.5 rounded-full ${room.status === 'occupied' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                              </div>
                              <p className="text-[9px] text-slate-500 mt-1 truncate">{room.tenant || 'Kosong'}</p>
                            </button>
                          ))}
                        </div>

                        <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col justify-between text-[11px]">
                          {selectedRoomDetails ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                                <span className="font-extrabold text-slate-900 text-xs text-emerald-800">Nomor {selectedRoomDetails.id}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${selectedRoomDetails.status === 'occupied' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                                  {selectedRoomDetails.status === 'occupied' ? 'Terisi' : 'Kosong'}
                                </span>
                              </div>
                              
                              <p className="text-slate-500">Tipe Fasilitas: <span className="font-bold text-slate-700 block">{selectedRoomDetails.type}</span></p>
                              <p className="text-slate-500">Biaya Rent: <span className="font-extrabold text-slate-850 text-emerald-600 block">Rp{selectedRoomDetails.price.toLocaleString('id-ID')}</span></p>
                              
                              {selectedRoomDetails.status === 'occupied' ? (
                                <div className="bg-white p-2 rounded border border-slate-250 hover:shadow-xs mb-1">
                                  <p className="text-[8px] font-bold text-slate-400 uppercase">Penyewa Aktif</p>
                                  <p className="font-bold text-slate-800 truncate">{selectedRoomDetails.tenant}</p>
                                  <p className="text-slate-500 text-[10px] leading-none mt-1">Due: {selectedRoomDetails.due}</p>
                                  <div className="mt-2 flex items-center justify-between">
                                    <span className="text-[9px] font-extrabold text-slate-400">Lunas Bulan Ini:</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${selectedRoomDetails.paid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-50 text-red-600'}`}>
                                      {selectedRoomDetails.paid ? 'LUNAS' : 'PENDING'}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="border border-dashed border-slate-300 bg-white p-3 rounded text-center text-slate-400 select-none py-6">
                                  <Plus className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                                  <p className="text-[9px] font-black">Kamar Kosong</p>
                                  <p className="text-[8px]">Daftarkan penghuni baru</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-slate-400">Pilih kamar di bagian kiri</div>
                          )}
                          {selectedRoomDetails?.status === 'occupied' && (
                            <button onClick={onStart} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[9px] py-1 shadow-sm transition-all text-center mt-2.5">
                              Tandai Pembayaran Lunas
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Penghuni View Mockup */}
                  {mockActiveTab === 'penghuni' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Penyewa Aktif</span>
                        <button onClick={onStart} className="text-[9px] bg-emerald-600 text-white font-bold py-1 px-2 rounded hover:bg-emerald-700 flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Tambah Manual
                        </button>
                      </div>

                      <div className="overflow-x-auto text-[11px]">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-150">
                              <th className="py-2 px-2">Nama</th>
                              <th className="py-2 px-2">Kamar</th>
                              <th className="py-2 px-2">No. Telp WhatsApp</th>
                              <th className="py-2 px-2">Status Sewa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {mockRooms.filter(r => r.tenant).map((room, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="py-2 px-2 font-bold text-slate-800">{room.tenant}</td>
                                <td className="py-2 px-2 font-semibold text-slate-600">No {room.id}</td>
                                <td className="py-2 px-2 text-slate-500 font-mono">{room.phone}</td>
                                <td className="py-2 px-2">
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${room.paid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-50 text-red-650'}`}>
                                    {room.paid ? 'LUNAS' : 'JATUH TEMPO'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Reminders / WhatsApp Billing Simulator */}
                  {mockActiveTab === 'reminders' && (
                    <div className="space-y-3">
                      <div className="bg-red-50 text-red-800 p-2 text-[11px] rounded border border-red-100 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold text-red-900">1 Tagihan Melebihi Batas jatuh Tempo!</p>
                          <p className="text-red-700 text-[10px] mt-0.5">Kirim draf WhatsApp pengingat sopan berikut dalam satu ketukan jari.</p>
                        </div>
                      </div>

                      <div className="space-y-2 mt-2 font-medium text-[11px]">
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 text-xs">Ahmad Faisal</span>
                              <span className="text-[8px] bg-red-100 text-red-800 px-1 py-0.5 rounded font-extrabold uppercase">Kamar 104</span>
                            </div>
                            <p className="text-slate-500 text-[10px] mt-0.5">Jatuh tempo sewa: 29 Mei 2026</p>
                          </div>
                          <button 
                            onClick={onStart}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg active:scale-95 duration-100 whitespace-nowrap"
                          >
                            Tagih Lewat WA
                          </button>
                        </div>

                        {/* WhatsApp preview box snippet */}
                        <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Prediksi Template Pesan WA:</p>
                          <div className="mt-1 bg-white p-2.5 rounded border border-slate-200 text-xs text-slate-700 font-sans italic relative">
                            "Halo Kak Ahmad Faisal, sekedar mengingatkan sewa kamar kost 104 senilai Rp1.500.000 jatuh tempo pada 29 Mei 2026. Terima kasih banyak ya Kak..."
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Problem Section */}
      <section id="pembuka-masalah" className="py-20 sm:py-28 px-4 bg-slate-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 bg-red-50 text-red-650 text-[11px] font-bold rounded-full uppercase tracking-widest mb-4 inline-block border border-red-100">
              Evaluasi Pengelolaan Kost Tradisional
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950">
              Masih Mengelola Kost Secara Manual?
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
              Memelihara hunian kian menuntut konsentrasi Anda. Mengandalkan ingatan, chat tidak terstruktur, atau berkas kertas rentan mendatangkan kerugian tak terduga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { title: 'Lupa Mencatat Pelunasan', desc: 'Buku catatan hilang atau slip kuitansi sobek membuat Anda bingung melacak siapa penyewa yang masih memiliki arrears sewa bulanan.' },
              { title: 'Kamar Kosong Terlewat', desc: 'Tidak memiliki pencatatan visual ketersediaan kamar, sehingga kehilangan kesempatan emas melayani prospek baru yang menginap.' },
              { title: 'Data Penghuni Tercecer', desc: 'Form berkas fisik dan tumpukan fotokopi berkas KTP berantakan, mempersulit komunikasi langsung dalam kondisi genting.' },
              { title: 'Sering Sungkan Menagih', desc: 'Kebingungan mengingat tenggat waktu pembayaran menyebabkan penundaan tagihan berlarut-larut hingga merusak kelancaran likuiditas modal Anda.' },
              { title: 'Pemasukan Sulit Dihitung', desc: 'Tidak memisahkan pendapatan kotor dan pengeluaran token utilitas, menjadikan Anda kesulitan mengkalkulasi kemajuan profit riil.' }
            ].map((pain, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs mb-4">
                    !
                  </div>
                  <h4 className="font-extrabold text-slate-950 text-sm sm:text-base mb-2">{pain.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{pain.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Solution Section */}
      <section id="solusi" className="py-20 sm:py-28 px-4 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full uppercase tracking-widest inline-block border border-emerald-100">
                Solusi All-in-One
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight">
                KosManage Membantu Semua <br /> 
                <span className="text-emerald-600">Lebih Tertata &amp; Aman</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Platform KosManage membantu pemilik kost mengelola kamar, penghuni, pembayaran, pengingat, dan laporan pendapatan dalam satu dashboard sederhana.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Tinggalkan kepusingan administrasi ganda. Melalui sistem otomatis kami, mengawasi perputaran properti sewa, mengirim pemberitahuan tanggal penagihan, hingga menganalisis kesehatan finansial kost bisa selesai dari mana pun Anda berada.
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]"><Check className="w-3.5 h-3.5" /></span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">Cukup Sekali Klik - Akses Data Handal Menggunakan Cloud</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]"><Check className="w-3.5 h-3.5" /></span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">Draf Penagihan WhatsApp Santun &amp; Instan</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]"><Check className="w-3.5 h-3.5" /></span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">Terbuka Untuk Segala Skala Kost &amp; Kontrakan</span>
                </div>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={() => openAuth('register')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 text-xs sm:text-sm inline-flex items-center gap-2"
                >
                  Mulai Gratis Sekarang <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Live Cashflow widget illustration */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-50 to-emerald-100/20 rounded-3xl -z-10 blur-xl" />
              <div className="bg-slate-900 rounded-2xl p-6 shadow-xl text-white">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400">Arus Kas Ringkas Properti</span>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded">Update Real-time</span>
                </div>
                
                <div className="space-y-4 pt-6">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-400">
                      <span>Penerimaan Bulanan</span>
                      <span className="text-white font-bold">Rp27.000.000</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-400">
                      <span>Biaya Operasional Kost</span>
                      <span className="text-red-400 font-bold">-Rp3.800.000</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: '22%' }} />
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-800/60 my-4" />

                  <div className="flex justify-between items-center bg-slate-850 p-3 rounded-xl border border-slate-800/80">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Profit Bersih</p>
                      <p className="text-xl sm:text-2xl font-black text-white mt-1">Rp23.200.000</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <BarChart3 className="text-emerald-500 w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Feature Section */}
      <section id="fitur" className="py-20 sm:py-28 px-4 bg-slate-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full uppercase tracking-widest mb-4 inline-block border border-emerald-100">
              Kelebihan Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">
              Fitur Utama KosManage
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Rangkaian modul fungsional yang dikembangkan dengan fokus meringankan administrasi kost harian Anda secara maksimal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: LayoutDashboard, 
                title: 'Dashboard Kost', 
                desc: 'Pantau status okupansi kamar, jumlah penghuni aktif, arus kas masuk, dan jatuh tempo mendesak melaui satu halaman utama.' 
              },
              { 
                icon: Building2, 
                title: 'Manajemen Kamar', 
                desc: 'Visualisasikan denah hunian dengan efisiensi prima. Kategori status kamar terisi versus kosong terlihat jelas secara instan.' 
              },
              { 
                icon: Users, 
                title: 'Data Penghuni', 
                desc: 'Kelola basis data lengkap seperti foto identitas KTP, nomor HP darurat, hingga jatuh tempo tanggal sewa bulanan dengan rapi.' 
              },
              { 
                icon: CreditCard, 
                title: 'Pembayaran Sewa', 
                desc: 'Catat setoran biaya bulanan masuk secara transparan. Mendukung cetak bukti kuitansi digital bermerek asrama Anda.' 
              },
              { 
                icon: Bell, 
                title: 'Reminder Jatuh Tempo', 
                desc: 'Dapatkan efisiensi tinggi dengan pesan draf pengingat sopan tenggat waktu tagihan bulanan langsung lewat koneksi WhatsApp.' 
              },
              { 
                icon: BarChart3, 
                title: 'Laporan Pendapatan', 
                desc: 'Nikmati visualisasi laba bersih, rangkuman rincian pengeluaran token utilitas, investasi renovasi, dan ekspor pembukuan rapi.' 
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500/40 hover:shadow-lg transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <feature.icon className="w-5.5 h-5.5 text-emerald-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 mb-3">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="harga" className="py-20 sm:py-28 px-4 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full uppercase tracking-widest mb-4 inline-block border border-emerald-100">
              Paket Harga Transparan
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">
              Harga Sederhana untuk Pemilik Kost
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              Hanya satu paket investasi minimal untuk mempermudah operasional sewa asrama Anda. Mulai langkah modernisasi tanpa beban ganda.
            </p>
          </div>

          {/* Centered Premium Pricing Card */}
          <div className="max-w-lg mx-auto">
            <div className="bg-slate-900 rounded-[2.5rem] text-white p-8 md:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-wider">
                    Satu Harga Lengkap
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold mt-3 text-white">Paket Bulanan</h3>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-xs font-bold text-slate-400">Rp</span>
                    <span className="text-3xl md:text-4xl font-black text-white">50.000</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">/ bulan</p>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 mb-8 font-medium">
                Nikmati akses tanpa batas ke seluruh fitur manajemen KosManage untuk memantau kelancaran bisnis hunian Anda.
              </p>

              <div className="h-[1px] bg-slate-800/80 mb-8" />

              <ul className="space-y-4 mb-10 text-xs sm:text-sm">
                {[
                  'Tanpa batas jumlah kamar',
                  'Kelola data penghuni',
                  'Catatan pembayaran',
                  'Reminder jatuh tempo otomatis',
                  'Laporan pendapatan bulanan komprehensif'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-slate-200">{benefit}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => openAuth('register')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 hover:text-white py-4 rounded-2xl font-bold transition-all text-sm shadow-xl shadow-emerald-500/10 active:scale-98 duration-150"
                id="btn-pricing-langganan"
               >
                Mulai Berlangganan
              </button>
              
              <p className="text-center text-[10px] text-slate-500 mt-4">
                * Batalkan pengaktifan atau upgrade paket sepuasnya tanpa denda
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. CTA Section */}
      <section id="tentang" className="py-20 sm:py-28 px-4 bg-slate-50 relative overflow-hidden border-b border-slate-200/50">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-emerald-100/10 rounded-full blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-950 leading-tight">
              Mulai Kelola Kost dengan Lebih Mudah
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tidak perlu lagi mencatat pembayaran secara manual. Semua data kost dapat dikelola dalam satu aplikasi.
            </p>
            
            <div className="pt-6">
              <button 
                onClick={() => openAuth('register')}
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-emerald-700 shadow-xl shadow-emerald-600/25 active:scale-95 duration-150 inline-flex items-center gap-2"
                id="btn-cta-daftar"
              >
                Daftar Sekarang
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-12 bg-white text-slate-500 text-xs sm:text-sm border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-8 border-b border-slate-100">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <DoorOpen className="text-white w-4.5 h-4.5" />
              </div>
              <span className="text-lg font-bold text-slate-950 tracking-tight">
                Kos<span className="text-emerald-600">Manage</span>
              </span>
            </div>
            
            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm font-semibold">
              <a href="#fitur" className="hover:text-emerald-600 transition-colors">Fitur</a>
              <a href="#solusi" className="hover:text-emerald-600 transition-colors">Solusi</a>
              <a href="#harga" className="hover:text-emerald-600 transition-colors">Harga</a>
              <a href="#tentang" className="hover:text-emerald-600 transition-colors">Tentang</a>
              <a href="mailto:contact@kosmanage.com" className="hover:text-emerald-600 transition-colors">Kontak</a>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-[11px] sm:text-xs">
            <p>© 2026 KosManage. Hak Cipta Dilindungi.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-emerald-650 transition-colors">Ketentuan Layanan</a>
              <a href="#" className="hover:text-emerald-650 transition-colors">Kebijakan Privasi</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Autentikasi Modal (Login & Register Popup) */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-150"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <DoorOpen className="text-emerald-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">
                  {authMode === 'login' ? 'Masuk ke KosManage' : 'Daftar KosManage Sekarang'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {authMode === 'login' 
                    ? 'Kelola kembali administrasi sewa properti Anda' 
                    : 'Mulai buat pembukuan digital bebas repot secara gratis'
                  }
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="Contoh: Adi Wibowo" 
                          className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Properti Kost</label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={kostNameInput}
                          onChange={(e) => setKostNameInput(e.target.value)}
                          placeholder="Contoh: Kost Aditya Premium" 
                          className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alamat Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Contoh: adi@gmail.com" 
                      className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kata Sandi</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Masukkan kata sandi Anda" 
                      className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 pl-10 pr-4 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md mt-2 active:scale-98 duration-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Memproses...' : (authMode === 'login' ? 'Masuk Dashboard' : 'Buat Akun Sekarang')}
                </button>
              </form>

              <div className="text-center mt-6 text-xs text-slate-500 pt-4 border-t border-slate-100">
                {authMode === 'login' ? (
                  <p>
                    Belum memiliki akun?{' '}
                    <button 
                      onClick={() => setAuthMode('register')}
                      className="text-emerald-600 font-bold hover:underline bg-transparent border-none active:scale-95"
                    >
                      Daftar Gratis
                    </button>
                  </p>
                ) : (
                  <p>
                    Sudah memiliki akun?{' '}
                    <button 
                      onClick={() => setAuthMode('login')}
                      className="text-emerald-600 font-bold hover:underline bg-transparent border-none active:scale-95"
                    >
                      Login Saja
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
