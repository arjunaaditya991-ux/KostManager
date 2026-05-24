import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard, Room, Tenant, Payment } from './Dashboard';
import { TenantManagement } from './TenantManagement';
import { RoomManagement } from './RoomManagement';
import { Payments } from './Payments';
import { Reports } from './Reports';
import { DataKost } from './DataKost';
import { Reminder } from './Reminder';
import { Langganan } from './Langganan';
import { Pengaturan } from './Pengaturan';
import { InactiveDashboard } from './InactiveDashboard';
import { Bell, Search, User, CheckCircle2, AlertCircle, Crown, ShieldAlert } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive'>('inactive');
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [lockedModalFeature, setLockedModalFeature] = useState('');

  // 1. Unified state for Rooms (24 rooms: 18 occupied, 5 empty, 1 under repair)
  const [rooms, setRooms] = useState<Room[]>([
    { number: 'A01', type: 'AC + Kamar Mandi Dalam', price: 750000, status: 'Terisi', tenant: 'Budi' },
    { number: 'A02', type: 'AC + Kamar Mandi Dalam', price: 750000, status: 'Kosong' },
    { number: 'A03', type: 'Suite Premium', price: 700000, status: 'Perbaikan' },
    { number: 'A04', type: 'AC + Kamar Mandi Dalam', price: 800000, status: 'Terisi', tenant: 'Rani' },
    { number: 'A05', type: 'Standard AC', price: 700000, status: 'Terisi', tenant: 'Riko' },
    { number: 'B01', type: 'AC + Kamar Mandi Dalam', price: 750000, status: 'Terisi', tenant: 'Sinta' },
    { number: 'B02', type: 'Standard AC', price: 700000, status: 'Terisi', tenant: 'Dimas' },
    { number: 'C02', type: 'AC + Kamar Mandi Dalam', price: 800000, status: 'Terisi', tenant: 'Agus' },
    { number: 'A06', type: 'Ekonomi Kipas', price: 500000, status: 'Terisi', tenant: 'Amanda' },
    { number: 'A07', type: 'Ekonomi Kipas', price: 500000, status: 'Terisi', tenant: 'Rizky' },
    { number: 'A08', type: 'Standard AC', price: 700000, status: 'Terisi', tenant: 'Farhan' },
    { number: 'A09', type: 'Standard AC', price: 700000, status: 'Terisi', tenant: 'Dian' },
    { number: 'A10', type: 'Standard AC', price: 700000, status: 'Terisi', tenant: 'Wahyu' },
    { number: 'A11', type: 'Suite Premium', price: 1200000, status: 'Terisi', tenant: 'Sarah' },
    { number: 'A12', type: 'Suite Premium', price: 1200000, status: 'Terisi', tenant: 'Adi' },
    { number: 'B03', type: 'Suite Premium', price: 1200000, status: 'Terisi', tenant: 'Denny' },
    { number: 'B04', type: 'AC + Kamar Mandi Dalam', price: 750000, status: 'Terisi', tenant: 'Maya' },
    { number: 'B05', type: 'Standard AC', price: 700000, status: 'Terisi', tenant: 'Hendra' },
    { number: 'B06', type: 'Standard AC', price: 700000, status: 'Terisi', tenant: 'Yuni' },
    { number: 'B07', type: 'AC + Kamar Mandi Dalam', price: 750000, status: 'Terisi', tenant: 'Wawan' },
    { number: 'C03', type: 'Suite Premium', price: 1200000, status: 'Kosong' },
    { number: 'C04', type: 'AC + Kamar Mandi Dalam', price: 750000, status: 'Kosong' },
    { number: 'C05', type: 'Standard AC', price: 700000, status: 'Kosong' },
    { number: 'C06', type: 'Ekonomi Kipas', price: 500000, status: 'Kosong' },
  ]);

  // 2. Unified state for Tenants (18 active tenants with exactly 6 unpaid to match 'Belum Lunas: 6')
  const [tenants, setTenants] = useState<Tenant[]>([
    { id: 'T1', name: 'Budi', roomNumber: 'A01', phone: '0812-3456-7890', dueDate: '25 Mei 2026', status: 'Belum Bayar', monthlyRent: 750000 },
    { id: 'T2', name: 'Rani', roomNumber: 'A04', phone: '0856-7890-1234', dueDate: '27 Mei 2026', status: 'Akan Jatuh Tempo', monthlyRent: 800000 },
    { id: 'T3', name: 'Dimas', roomNumber: 'B02', phone: '0813-5555-7777', dueDate: '20 Mei 2026', status: 'Terlambat', monthlyRent: 700000 },
    { id: 'T4', name: 'Riko', roomNumber: 'A05', phone: '0899-2222-3333', dueDate: '18 Mei 2026', status: 'Belum Bayar', monthlyRent: 700000 },
    { id: 'T5', name: 'Hendra', roomNumber: 'B05', phone: '0811-1234-5678', dueDate: '10 Mei 2026', status: 'Terlambat', monthlyRent: 700000 },
    { id: 'T6', name: 'Yuni', roomNumber: 'B06', phone: '0822-9876-5432', dueDate: '15 Mei 2026', status: 'Terlambat', monthlyRent: 700000 },
    { id: 'T7', name: 'Sinta', roomNumber: 'B01', phone: '0812-3333-4444', dueDate: '10 Mei 2026', status: 'Lunas', monthlyRent: 750000 },
    { id: 'T8', name: 'Agus', roomNumber: 'C02', phone: '0812-6666-9999', dueDate: '12 Mei 2026', status: 'Lunas', monthlyRent: 800000 },
    { id: 'T9', name: 'Amanda', roomNumber: 'A06', phone: '0812-1111-2222', dueDate: '10 Mei 2026', status: 'Lunas', monthlyRent: 1500000 },
    { id: 'T10', name: 'Rizky', roomNumber: 'A07', phone: '0812-2222-3333', dueDate: '10 Mei 2026', status: 'Lunas', monthlyRent: 1500000 },
    { id: 'T11', name: 'Farhan', roomNumber: 'A08', phone: '0812-3333-4444', dueDate: '10 Mei 2026', status: 'Lunas', monthlyRent: 1200000 },
    { id: 'T12', name: 'Dian', roomNumber: 'A09', phone: '0812-4444-5555', dueDate: '10 Mei 2026', status: 'Lunas', monthlyRent: 1200000 },
    { id: 'T13', name: 'Wahyu', roomNumber: 'A10', phone: '0812-5555-6666', dueDate: '10 Mei 2026', status: 'Lunas', monthlyRent: 1200000 },
    { id: 'T14', name: 'Sarah', roomNumber: 'A11', phone: '0812-6666-7777', dueDate: '10 Mei 2026', status: 'Lunas', monthlyRent: 1100000 },
    { id: 'T15', name: 'Adi', roomNumber: 'A12', phone: '0812-7777-8888', dueDate: '10 Mei 2026', status: 'Lunas', monthlyRent: 1100000 },
    { id: 'T16', name: 'Denny', roomNumber: 'B03', phone: '0812-8888-9999', dueDate: '10 Mei 2026', status: 'Lunas', monthlyRent: 1100000 },
    { id: 'T17', name: 'Maya', roomNumber: 'B04', phone: '0812-9999-0000', dueDate: '10 Mei 2026', status: 'Lunas', monthlyRent: 1050000 },
    { id: 'T18', name: 'Wawan', roomNumber: 'B07', phone: '0812-0000-1111', dueDate: '10 Mei 2026', status: 'Lunas', monthlyRent: 750000 }
  ]);

  // 3. Unified state for Transactions (sum of Lunas is exactly Rp12.500.000 to match dashboard requirements)
  const [payments, setPayments] = useState<Payment[]>([
    { id: 'P1', tenantName: 'Sinta', roomNumber: 'B01', amount: 750000, status: 'Lunas', date: '2026-05-15' },
    { id: 'P2', tenantName: 'Agus', roomNumber: 'C02', amount: 800000, status: 'Lunas', date: '2026-05-12' },
    { id: 'P3', tenantName: 'Amanda', roomNumber: 'A06', amount: 1500000, status: 'Lunas', date: '2026-05-10' },
    { id: 'P4', tenantName: 'Rizky', roomNumber: 'A07', amount: 1500000, status: 'Lunas', date: '2026-05-10' },
    { id: 'P5', tenantName: 'Farhan', roomNumber: 'A08', amount: 1200000, status: 'Lunas', date: '2026-05-10' },
    { id: 'P6', tenantName: 'Dian', roomNumber: 'A09', amount: 1200000, status: 'Lunas', date: '2026-05-10' },
    { id: 'P7', tenantName: 'Wahyu', roomNumber: 'A10', amount: 1200000, status: 'Lunas', date: '2026-05-10' },
    { id: 'P8', tenantName: 'Sarah', roomNumber: 'A11', amount: 1100000, status: 'Lunas', date: '2026-05-10' },
    { id: 'P9', tenantName: 'Adi', roomNumber: 'A12', amount: 1100000, status: 'Lunas', date: '2026-05-10' },
    { id: 'P10', tenantName: 'Denny', roomNumber: 'B03', amount: 1100000, status: 'Lunas', date: '2026-05-10' },
    { id: 'P11', tenantName: 'Maya', roomNumber: 'B04', amount: 1050000, status: 'Lunas', date: '2026-05-10' },
    { id: 'P12', tenantName: 'Riko', roomNumber: 'A05', amount: 700000, status: 'Belum Lunas', date: '2026-05-18' }
  ]);

  // Global Toast State
  const [alertMsg, setAlertMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const triggerAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setAlertMsg({ text, type });
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  const renderContent = () => {
    if (subscriptionStatus === 'inactive' && activeTab === 'dashboard') {
      return (
        <InactiveDashboard 
          setSubscriptionStatus={setSubscriptionStatus} 
          triggerAlert={triggerAlert} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard': 
        return (
          <Dashboard 
            rooms={rooms} 
            setRooms={setRooms}
            tenants={tenants} 
            setTenants={setTenants}
            payments={payments} 
            setPayments={setPayments}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
      case 'data_kost': 
        return <DataKost triggerAlert={triggerAlert} />;
      case 'kamar': 
        return <RoomManagement rooms={rooms} setRooms={setRooms} triggerAlert={triggerAlert} />;
      case 'penghuni': 
        return (
          <TenantManagement 
            tenants={tenants} 
            setTenants={setTenants} 
            rooms={rooms} 
            setRooms={setRooms} 
            triggerAlert={triggerAlert} 
          />
        );
      case 'pembayaran': 
        return (
          <Payments 
            payments={payments} 
            setPayments={setPayments} 
            tenants={tenants} 
            setTenants={setTenants} 
            triggerAlert={triggerAlert} 
          />
        );
      case 'reminder': 
        return <Reminder tenants={tenants} triggerAlert={triggerAlert} />;
      case 'laporan': 
        return (
          <Reports 
            payments={payments} 
            roomsCountCount={rooms.length} 
            occupiedRoomsCount={rooms.filter(r => r.status === 'Terisi').length} 
          />
        );
      case 'langganan': 
        return (
          <Langganan 
            triggerAlert={triggerAlert} 
            subscriptionStatus={subscriptionStatus}
            setSubscriptionStatus={setSubscriptionStatus}
          />
        );
      case 'pengaturan': 
        return <Pengaturan triggerAlert={triggerAlert} />;
      default: 
        if (subscriptionStatus === 'inactive') {
          return (
            <InactiveDashboard 
              setSubscriptionStatus={setSubscriptionStatus} 
              triggerAlert={triggerAlert} 
            />
          );
        }
        return (
          <Dashboard 
            rooms={rooms} 
            setRooms={setRooms}
            tenants={tenants} 
            setTenants={setTenants}
            payments={payments} 
            setPayments={setPayments}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  // Safe global search tracking
  const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchQuery(term);
    if (!term) return;

    // Fast routing based on term matching keys
    if (term === 'kamar' || term === 'room' || term.startsWith('a0') || term.startsWith('b0')) {
      setActiveTab('kamar');
    } else if (term === 'bayar' || term === 'pembayaran' || term === 'uang' || term === 'lunas') {
      setActiveTab('pembayaran');
    } else if (term === 'reminder' || term === 'tagihan' || term === 'wa') {
      setActiveTab('reminder');
    } else if (term === 'laporan' || term === 'omzet' || term === 'keuangan' || term === 'pendapatan') {
      setActiveTab('laporan');
    } else {
      setActiveTab('penghuni');
    }
  };

  const handleSetActiveTab = (tabId: string) => {
    const lockedTabs = ['pembayaran', 'reminder', 'laporan'];
    if (subscriptionStatus === 'inactive' && lockedTabs.includes(tabId)) {
      setLockedModalFeature(
        tabId === 'pembayaran' 
          ? 'Tagihan & QRIS' 
          : tabId === 'reminder' 
          ? 'Reminder Tagihan' 
          : 'Laporan Pendapatan'
      );
      setShowLockedModal(true);
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans" id="owner-app-layout-root">
      
      {/* Sidebar block */}
      <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} subscriptionStatus={subscriptionStatus} />
      
      {/* Main viewport block */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Global Alert Notification Toast */}
        {alertMsg && (
          <div 
            id="global-toast-sticky"
            className={`fixed top-6 right-8 z-55 px-5 py-4 border rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in-down ${
              alertMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'
            }`}
          >
            {alertMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-650" />}
            <span className="text-xs sm:text-sm font-black">{alertMsg.text}</span>
          </div>
        )}

        {/* 2. Topbar Layout */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between flex-shrink-0" id="app-topbar">
          
          {/* Quick Find Bar */}
          <div className="flex items-center gap-3.5 bg-slate-50 px-4 py-2 rounded-xl w-80 lg:w-96 border border-slate-200/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
            <Search className="w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari penghuni, kamar, atau ketik 'laporan'..." 
              value={searchQuery}
              onChange={handleGlobalSearch}
              className="bg-transparent border-none outline-none text-xs sm:text-sm w-full font-semibold text-slate-800 placeholder-slate-400"
            />
          </div>
          
          {/* Status alerts, Title, Greeting, Avatar */}
          <div className="flex items-center gap-6">
            
            {/* Dynamic Subscription Status Topbar Badge */}
            <div className="flex items-center">
              {subscriptionStatus === 'inactive' ? (
                <span 
                  onClick={() => {
                    setLockedModalFeature('Akses Penuh KosManage');
                    setShowLockedModal(true);
                  }}
                  className="cursor-pointer px-3.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-250 text-[10px] sm:text-xs font-black rounded-full select-none transition-colors"
                  id="topbar-status-inactive"
                >
                  ● Belum Berlangganan
                </span>
              ) : (
                <span 
                  className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-250 text-[10px] sm:text-xs font-black rounded-full select-none"
                  id="topbar-status-active"
                >
                  ✔ Langganan Aktif
                </span>
              )}
            </div>

            <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

            {/* 2. Page Title Header Display */}
            <div className="text-right hidden md:block select-none" id="dashboard-title-topbar">
              <p className="text-[10px] font-black uppercase text-emerald-650 tracking-wider">Pemilik Kost</p>
              <h1 className="text-sm font-black text-slate-905 tracking-tight leading-none mt-1">Dashboard KosManage</h1>
            </div>

            <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

            {/* Notification Ring bell */}
            <button 
              id="btn-topbar-bell"
              onClick={() => triggerAlert('Anda memiliki 1 pesan draf penagihan jatuh tempo siap dikirim!')}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors group"
            >
              <Bell className="w-4.5 h-4.5 text-slate-550 group-hover:text-emerald-600 transition-transform group-hover:rotate-12" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="h-6 w-[1px] bg-slate-205"></div>

            {/* Profile Avatar info */}
            <div 
              id="topbar-profile"
              onClick={() => setActiveTab('pengaturan')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-950 leading-none">Halo, Arjuna</p>
                <p className="text-[10px] text-slate-400 font-bold leading-none mt-1">Administrator Kost</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-black text-xs shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-all duration-150">
                AR
              </div>
            </div>

          </div>
        </header>

        {/* Content Dynamic Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-slate-50/70" id="main-content-scrollable">
          {renderContent()}
        </div>

      </main>

      {/* Shared Locked Feature Detail Modal */}
      {showLockedModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-150 flex flex-col items-center text-center">
            
            <button 
              onClick={() => setShowLockedModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-550/10 hover:bg-slate-50 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100 mb-4 animate-bounce mt-2 shadow-xs">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-900">Fitur Terkunci</h3>
            {lockedModalFeature && (
              <p className="text-xs bg-slate-100 border border-slate-150 text-slate-600 font-extrabold px-3 py-1 rounded-lg mt-2 font-mono uppercase tracking-wide">
                Modul {lockedModalFeature}
              </p>
            )}
            
            <p className="text-sm text-slate-500 mt-3 mb-6 font-medium leading-relaxed">
              Fitur ini tersedia setelah kamu mengaktifkan langganan KosManage.
            </p>

            <div className="w-full space-y-2.5">
              <button 
                onClick={() => {
                  setSubscriptionStatus('active');
                  triggerAlert('Langganan Berhasil Diaktifkan! Selamat menikmati fitur premium KosManage.');
                  setShowLockedModal(false);
                }}
                id="btn-app-locked-modal-activate"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
              >
                <Crown className="w-4 h-4 text-amber-300 animate-pulse" />
                Aktifkan Langganan
              </button>
              <button 
                onClick={() => setShowLockedModal(false)}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl text-xs hover:text-slate-950 transition-all duration-150"
              >
                Kembali
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
