import React, { useState } from 'react';
import { 
  Users, 
  DoorClosed, 
  DoorOpen, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  Eye, 
  Calendar,
  DollarSign,
  Phone,
  Check,
  Building2,
  Trash2,
  Send,
  Wrench,
  Search
} from 'lucide-react';
import { formatCurrency, getTenantStatus } from '../lib/utils';

// Definition of interfaces matching our state requirements
export interface Room {
  number: string;
  type: string;
  price: number;
  status: 'Terisi' | 'Kosong' | 'Perbaikan';
  tenant?: string;
}

export interface Tenant {
  id: string;
  name: string;
  roomNumber: string;
  phone: string;
  dueDate: string;
  status: 'Belum Bayar' | 'Akan Jatuh Tempo' | 'Terlambat' | 'Lunas' | 'Jatuh Tempo Hari Ini';
  monthlyRent: number;
}

export interface Payment {
  id: string;
  tenantName: string;
  roomNumber: string;
  amount: number;
  status: 'Lunas' | 'Belum Lunas' | 'Pending';
  date: string;
}

interface DashboardProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  rooms,
  setRooms,
  tenants,
  setTenants,
  payments,
  setPayments,
  activeTab,
  setActiveTab
}) => {
  // Modal states
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [selectedQrisBill, setSelectedQrisBill] = useState<Tenant | null>(null);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [selectedDetailBill, setSelectedDetailBill] = useState<Tenant | null>(null);
  const [showQuickSendModal, setShowQuickSendModal] = useState(false);

  // Form states
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomType, setNewRoomType] = useState('Standar');
  const [newRoomPrice, setNewRoomPrice] = useState('750000');
  const [newRoomStatus, setNewRoomStatus] = useState<'Terisi' | 'Kosong' | 'Perbaikan'>('Kosong');

  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantRoom, setNewTenantRoom] = useState('');
  const [newTenantPhone, setNewTenantPhone] = useState('');
  const [newTenantRent, setNewTenantRent] = useState('');
  const [newTenantDueDate, setNewTenantDueDate] = useState('2026-05-25');

  const [payTenantId, setPayTenantId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState('2026-05-23');

  // Success message alerts
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const triggerAlert = (text: string, type: 'success' | 'error' = 'success') => {
    setAlertMsg({ text, type });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  // 1. Add Room handler
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber.trim()) return;

    if (rooms.some(r => r.number.toLowerCase() === newRoomNumber.trim().toLowerCase())) {
      triggerAlert('Kamar dengan nomor tersebut sudah terdaftar!', 'error');
      return;
    }

    const priceNum = parseInt(newRoomPrice) || 750000;
    const newRoom: Room = {
      number: newRoomNumber.trim().toUpperCase(),
      type: newRoomType,
      price: priceNum,
      status: newRoomStatus
    };

    setRooms(prev => [...prev, newRoom]);
    setShowAddRoomModal(false);
    setNewRoomNumber('');
    triggerAlert(`Kamar ${newRoom.number} berhasil ditambahkan!`);
  };

  // 2. Add Tenant handler
  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim() || !newTenantRoom.trim()) return;

    // Find the room first
    const roomIndex = rooms.findIndex(r => r.number.toLowerCase() === newTenantRoom.trim().toLowerCase());
    if (roomIndex === -1) {
      triggerAlert('Nomor kamar tidak ditemukan! Silakan buat kamar terlebih dahulu.', 'error');
      return;
    }

    const priceVal = parseInt(newTenantRent) || rooms[roomIndex].price;

    const newTenantObj: Tenant = {
      id: 'T' + (tenants.length + 1),
      name: newTenantName.trim(),
      roomNumber: newTenantRoom.trim().toUpperCase(),
      phone: newTenantPhone.trim() || '0812-0000-0000',
      dueDate: newTenantDueDate,
      status: 'Belum Bayar',
      monthlyRent: priceVal
    };

    // Update tenants array
    setTenants(prev => [...prev, newTenantObj]);
    
    // Set corresponding room status to Terisi
    setRooms(prev => prev.map(r => 
      r.number.toUpperCase() === newTenantRoom.trim().toUpperCase()
        ? { ...r, status: 'Terisi', tenant: newTenantName.trim() }
        : r
    ));

    // Also add to payments showing as Belum Lunas
    const newPay: Payment = {
      id: 'P' + (payments.length + 1),
      tenantName: newTenantName.trim(),
      roomNumber: newTenantRoom.trim().toUpperCase(),
      amount: priceVal,
      status: 'Belum Lunas',
      date: newTenantDueDate
    };
    setPayments(prev => [newPay, ...prev]);

    setShowAddTenantModal(false);
    setNewTenantName('');
    setNewTenantRoom('');
    setNewTenantPhone('');
    triggerAlert(`Penghuni ${newTenantObj.name} berhasil terdaftar di Kamar ${newTenantObj.roomNumber}!`);
  };

  // 3. Record Rent Payment handler
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTenantId) return;

    const selectedTenant = tenants.find(t => t.id === payTenantId);
    if (!selectedTenant) return;

    const amountPaid = parseInt(payAmount) || selectedTenant.monthlyRent;

    // Update tenant status to Lunas
    setTenants(prev => prev.map(t => 
      t.id === payTenantId 
        ? { ...t, status: 'Lunas' } 
        : t
    ));

    // Add a confirmed Paid transaction
    const newPaymentLog: Payment = {
      id: 'P' + (payments.length + 1),
      tenantName: selectedTenant.name,
      roomNumber: selectedTenant.roomNumber,
      amount: amountPaid,
      status: 'Lunas',
      date: payDate
    };

    setPayments(prev => [newPaymentLog, ...prev]);
    setShowRecordPaymentModal(false);
    triggerAlert(`Pembayaran sebesar ${formatCurrency(amountPaid)} untuk ${selectedTenant.name} berhasil dicatat!`);
  };

  // Automatic billing generation simulation
  const handleSimulateMonthlyBills = () => {
    let resetCount = 0;
    
    // Find who is Lunas, reset them so we can mock generating next bills cycle
    const updatedTenants = tenants.map(t => {
      const currentStat = getTenantStatus(t.dueDate, t.status);
      if (currentStat === 'Lunas') {
        resetCount++;
        return { ...t, status: 'Belum Bayar' as const };
      }
      return t;
    });

    setTenants(updatedTenants);

    // Filter which tenants do not have an active Belum Lunas record in payments for bills simulation
    const newPaymentsToCreate: Payment[] = [];
    updatedTenants.forEach((t, index) => {
      const dynamicStat = getTenantStatus(t.dueDate, t.status);
      const isPaid = dynamicStat === 'Lunas';
      if (!isPaid) {
        // Only if they don't already have a Belum Lunas ledger
        const alreadyHasUnpaidLedger = payments.some(p => p.tenantName === t.name && p.status === 'Belum Lunas' && p.roomNumber === t.roomNumber);
        if (!alreadyHasUnpaidLedger) {
          newPaymentsToCreate.push({
            id: 'P_AUTO_' + (payments.length + index + 1),
            tenantName: t.name,
            roomNumber: t.roomNumber,
            amount: t.monthlyRent,
            status: 'Belum Lunas',
            date: '2026-05-24'
          });
        }
      }
    });

    if (newPaymentsToCreate.length > 0) {
      setPayments(prev => [...newPaymentsToCreate, ...prev]);
    }

    triggerAlert(`KosManage otomatis menghasilkan tagihan bulan ini untuk ${updatedTenants.length} penghuni aktif! Status disesuaikan dengan tanggal jatuh tempo.`);
  };

  // Simulate payment gateway callback for QRIS
  const handleSimulatePaymentSuccess = (tenantName: string) => {
    const tenant = tenants.find(t => t.name === tenantName);
    if (!tenant) return;

    // Mark tenant as Lunas
    setTenants(prev => prev.map(t => 
      t.name === tenantName ? { ...t, status: 'Lunas' } : t
    ));

    // Update in payments ledger to Lunas
    const hasUnpaidPayment = payments.some(p => p.tenantName === tenantName && p.status !== 'Lunas');
    if (hasUnpaidPayment) {
      setPayments(prev => prev.map(p => 
        p.tenantName === tenantName && p.status !== 'Lunas'
          ? { ...p, status: 'Lunas', date: '2026-05-24' }
          : p
      ));
    } else {
      const newPaymentLog: Payment = {
        id: 'P_QRIS_' + (payments.length + 20),
        tenantName: tenant.name,
        roomNumber: tenant.roomNumber,
        amount: tenant.monthlyRent,
        status: 'Lunas',
        date: '2026-05-24'
      };
      setPayments(prev => [newPaymentLog, ...prev]);
    }

    // Refresh selected bill modal state in realtime
    setSelectedQrisBill(prev => prev && prev.name === tenantName ? { ...prev, status: 'Lunas' } : prev);
    triggerAlert(`Simulasi Berhasil! Dana pembayaran sewa Kamar ${tenant.roomNumber} (${tenantName}) telah masuk. Status diubah ke Lunas.`);
  };

  // Billing status converter for high-fidelity Indonesia terminology
  const getBillingStatus = (dueDate: string, currentStatus: string): 'Menunggu Pembayaran' | 'Akan Jatuh Tempo' | 'Terlambat' | 'Lunas' | 'Kedaluwarsa' => {
    if (currentStatus === 'Lunas') return 'Lunas';
    if (currentStatus === 'Kedaluwarsa') return 'Kedaluwarsa';
    
    const calculatedState = getTenantStatus(dueDate, currentStatus);
    if (calculatedState === 'Lunas') return 'Lunas';
    if (calculatedState === 'Terlambat') return 'Terlambat';
    if (calculatedState === 'Akan Jatuh Tempo') return 'Akan Jatuh Tempo';
    return 'Menunggu Pembayaran';
  };

  // Color mapping badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Menunggu Pembayaran':
        return 'bg-amber-50 text-amber-700 border-amber-250 font-bold';
      case 'Akan Jatuh Tempo':
        return 'bg-blue-50 text-blue-700 border-blue-250 font-bold';
      case 'Terlambat':
        return 'bg-red-50 text-red-700 border-red-250 font-extrabold animate-pulse';
      case 'Lunas':
        return 'bg-emerald-50 text-emerald-800 border-emerald-250 font-black';
      case 'Kedaluwarsa':
        return 'bg-slate-100 text-slate-500 border-slate-205 font-medium';
      default:
        return 'bg-slate-50 text-slate-400 border-slate-200 font-medium';
    }
  };

  // WhatsApp QRIS transmitter
  const handleSendQrisWa = (bill: Tenant) => {
    const formattedRent = formatCurrency(bill.monthlyRent);
    const waMessage = `Halo Kak ${bill.name},\n\nBerikut tagihan sewa Kamar ${bill.roomNumber} periode Mei 2026 sebesar ${formattedRent} yang jatuh tempo pada ${bill.dueDate}.\n\nSilakan lakukan scan/pembayaran instan lewat link QRIS otomatis berikut:\n👉 https://qris.id/pay/kosmanage-${bill.id}\n\nStatus transaksi kamar Anda akan diperbarui oleh sistem secara otomatis langsung setelah transaksi selesai. Terima kasih banyak! 🙏`;
    const url = `https://wa.me/${bill.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`;
    window.open(url, '_blank');
    triggerAlert(`Menghubungkan ke WhatsApp untuk mengirim QRIS otomatis ${bill.name}...`);
  };

  // Summarize counts dynamically
  const totalRoomsCount = rooms.length;
  const occupiedRoomsCount = rooms.filter(r => r.status === 'Terisi').length;
  const emptyRoomsCount = rooms.filter(r => r.status === 'Kosong').length;
  const repairRoomsCount = rooms.filter(r => r.status === 'Perbaikan').length;

  // Let's count Belum Lunas tenants
  const unpaidTenantsCount = tenants.filter(t => t.status !== 'Lunas').length;

  // Monthly income based on Lunas payments
  const totalMonthlyIncome = payments
    .filter(p => p.status === 'Lunas')
    .reduce((sum, p) => sum + p.amount, 0);

  // Six Months income chart data representation
  const sixMonthIncome = [
    { label: 'Jan', value: 9200000 },
    { label: 'Feb', value: 10400000 },
    { label: 'Mar', value: 11100000 },
    { label: 'Apr', value: 11800000 },
    { label: 'Mei', value: totalMonthlyIncome },
    { label: 'Jun', value: 13200000 }
  ];

  const maxVal = Math.max(...sixMonthIncome.map(d => d.value));

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="dashboard-tab-content">
      
      {/* Alert Top Banner */}
      {alertMsg && (
        <div 
          className={`fixed top-20 right-8 z-50 px-5 py-4 rounded-xl border shadow-xl flex items-center gap-3 animate-bounce ${
            alertMsg.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
          id="system-alert-toast"
        >
          {alertMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span className="text-xs sm:text-sm font-bold">{alertMsg.text}</span>
        </div>
      )}

      {/* Hero Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 rounded-2xl border border-emerald-500/10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Selamat Datang di KosManage! 
          </h2>
          <p className="text-sm text-slate-500 mt-1">KosManage membantu pemilik kost mencatat kamar, penghuni, tagihan, jatuh tempo, dan laporan pendapatan tanpa catatan manual.</p>
        </div>
        <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-3.5 py-2 inline-flex items-center gap-1.5 self-start md:self-auto">
          <Calendar className="w-4 h-4 text-emerald-600" />
          Hari ini: 24 Mei 2026
        </div>
      </div>

      {/* 2. Tagihan Bulanan Otomatis (Automatic Billing Section) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/95 border-l-4 border-l-emerald-600 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4" id="automatic-billing-section">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
            <CreditCard className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              Tagihan Bulanan Otomatis
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full select-none">SISTEM AKTIF</span>
            </h3>
            <p className="text-xs text-slate-550 mt-1">Sistem otomatis membuat tagihan bulanan berdasarkan tanggal jatuh tempo setiap penghuni.</p>
          </div>
        </div>
        <button 
          onClick={handleSimulateMonthlyBills}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow active:scale-95 duration-100 self-start md:self-auto whitespace-nowrap"
        >
          <Check className="w-4 h-4" />
          Buat Tagihan Bulan Ini
        </button>
      </div>

      {/* 3. Summary Cards Layout - 5 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5" id="summary-cards-section">
        
        {/* Card 1: Total Kamar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group" id="card-total-kamar">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Total Kamar</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
              <Building2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">24</h3>
            <p className="text-[10px] text-slate-400 mt-1">Total Unit Kamar</p>
          </div>
        </div>

        {/* Card 2: Kamar Terisi */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group" id="card-kamar-terisi">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Kamar Terisi</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <DoorClosed className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-emerald-600 tracking-tight">18</h3>
            <p className="text-[10px] text-emerald-500 font-bold mt-1">
              Kamar Terisi
            </p>
          </div>
        </div>

        {/* Card 3: Kamar Kosong */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group" id="card-kamar-kosong">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Kamar Kosong</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <DoorOpen className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">5</h3>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded leading-none">
                1 Perbaikan
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Kamar Kosong</p>
          </div>
        </div>

        {/* Card 4: Menunggu Pembayaran */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group" id="card-belum-lunas">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Menunggu Pembayaran</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-650 group-hover:text-white transition-all">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-amber-600 tracking-tight">6</h3>
            <p className="text-[10px] text-amber-500 font-bold mt-1">Belum Lunas</p>
          </div>
        </div>

        {/* Card 5: Pemasukan Bulan Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group bg-gradient-to-br from-emerald-600 to-emerald-500 text-white" id="card-pemasukan">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase text-emerald-100 tracking-wider">Pemasukan Bulan Ini</span>
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{formatCurrency(totalMonthlyIncome)}</h3>
            <p className="text-[10px] text-emerald-100 mt-1">Bulan Berjalan</p>
          </div>
        </div>

      </div>

      {/* 4. Quick Action Buttons Container */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs" id="quick-actions-section">
        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-4">Aksi Cepat</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <button 
            id="btn-action-buat-tagihan"
            onClick={handleSimulateMonthlyBills}
            className="p-4 bg-emerald-50 hover:bg-emerald-100/90 text-emerald-950 font-extrabold text-sm rounded-xl border border-emerald-100 transition-all shadow-xs flex flex-col items-center justify-center gap-2 group hover:translate-y-[-1px] text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center group-hover:rotate-12 transition-all mb-1">
              <Check className="w-4 h-4" />
            </div>
            Buat Tagihan Bulanan
          </button>

          <button 
            id="btn-action-kirim-qris"
            onClick={() => {
              setShowQuickSendModal(true);
            }}
            className="p-4 bg-emerald-50 hover:bg-emerald-100/90 text-emerald-950 font-extrabold text-sm rounded-xl border border-emerald-100 transition-all shadow-xs flex flex-col items-center justify-center gap-2 group hover:translate-y-[-1px] text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center group-hover:rotate-12 transition-all mb-1">
              <Send className="w-4 h-4" />
            </div>
            Kirim QRIS WA
          </button>

          <button 
            id="btn-action-lihat-tagihan"
            onClick={() => setActiveTab('pembayaran')}
            className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-800 font-extrabold text-sm rounded-xl border border-slate-200 transition-all shadow-xs flex flex-col items-center justify-center gap-2 group hover:translate-y-[-1px] text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center group-hover:rotate-12 transition-all mb-1">
              <CreditCard className="w-4 h-4 text-slate-200" />
            </div>
            Lihat Tagihan
          </button>

          <button 
            id="btn-action-lihat-laporan"
            onClick={() => setActiveTab('laporan')}
            className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-800 font-extrabold text-sm rounded-xl border border-slate-200 transition-all shadow-xs flex flex-col items-center justify-center gap-2 group hover:translate-y-[-1px] text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center group-hover:rotate-12 transition-all mb-1">
              <TrendingUp className="w-4 h-4 text-slate-200" />
            </div>
            Lihat Laporan
          </button>

        </div>
      </div>

      {/* 5. Tagihan & QRIS Bulan Ini Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden" id="tagihan-qris-bulan-ini-section">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-550/[0.015] from-emerald-500/[0.015] to-transparent">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              Tagihan &amp; QRIS Bulan Ini
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full select-none uppercase">Gateway Otomatis</span>
            </h3>
            <p className="text-xs text-slate-550 mt-1">Sistem membuat tagihan sewa otomatis dan menyiapkan QRIS untuk setiap penghuni.</p>
          </div>
          <div className="text-[10px] font-mono text-slate-400 bg-slate-100 px-3 py-1 border border-slate-150 rounded text-xs select-none uppercase font-bold">
            Mei 2026
          </div>
        </div>
        
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider text-[10px]/none select-none">
                <th className="py-4 px-6">Nama Penghuni</th>
                <th className="py-4 px-6">Kamar</th>
                <th className="py-4 px-6">Jumlah Tagihan</th>
                <th className="py-4 px-6">Jatuh Tempo</th>
                <th className="py-4 px-6">Status Pembayaran</th>
                <th className="py-2.5 px-6 text-right">Aksi QRIS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {['Budi', 'Rani', 'Dimas', 'Sinta'].map((name) => {
                const tenant = tenants.find(t => t.name === name);
                if (!tenant) return null;
                
                const billStatus = getBillingStatus(tenant.dueDate, tenant.status);
                const formattedAmt = formatCurrency(tenant.monthlyRent);
                
                return (
                  <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors" id={`bill-row-${tenant.name}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-extrabold text-xs">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm leading-none">{tenant.name}</p>
                          <p className="text-[10px] text-slate-400 leading-none mt-1 font-mono">{tenant.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-0.5 bg-slate-100 font-bold text-slate-700 rounded text-xs">
                        Kamar {tenant.roomNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-slate-850 text-sm">{formattedAmt}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{tenant.dueDate}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border select-none ${getStatusBadge(billStatus)}`}>
                        {billStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <button
                          onClick={() => {
                            setSelectedQrisBill(tenant);
                            setShowQrisModal(true);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-1 shadow-sm"
                          id={`btn-lihat-qris-${tenant.name}`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Lihat QRIS
                        </button>
                        <button
                          onClick={() => handleSendQrisWa(tenant)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 font-extrabold px-3 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-1"
                        >
                          <Send className="w-3 h-3 text-emerald-600" />
                          Kirim QRIS WA
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDetailBill(tenant);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mid Section Grid: Status Kamar Grid & Income Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 5. Status Kamar Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs" id="status-kamar-section">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-base">Status Kamar</h3>
              <p className="text-xs text-slate-500 mt-1">Status keterisian kamar saat ini</p>
            </div>
            <button 
              onClick={() => setActiveTab('kamar')}
              className="text-xs font-bold text-emerald-650 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1 transition-all"
            >
              Semua Kamar <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3">
              {rooms.slice(0, 4).map((room, idx) => (
                <div 
                  key={idx} 
                  id={`room-status-box-${room.number}`}
                  className="p-4 rounded-xl border border-slate-150 bg-slate-50 hover:shadow-xs transition-shadow flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400">Nomor Kamar</span>
                      <h4 className="font-extrabold text-slate-950 text-sm mt-0.5">Kamar {room.number}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      room.status === 'Terisi' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      room.status === 'Kosong' ? 'bg-slate-200 text-slate-700' :
                      'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {room.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Harga Sewa</span>
                    <span className="font-black text-slate-800">{formatCurrency(room.price)}</span>
                  </div>

                  {room.tenant && (
                    <div className="mt-2 text-[10px] text-slate-500 italic bg-emerald-50/50 p-1.5 rounded border border-emerald-100/50">
                      Penghuni: <span className="font-bold text-slate-850 not-italic">{room.tenant}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. Income Chart Section: Pemasukan 6 Bulan Terakhir */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between" id="income-chart-section">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-base">Pemasukan 6 Bulan Terakhir</h3>
            <p className="text-xs text-slate-500 mt-1">Laporan bulanan pendapatan kamar kost</p>
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-end">
            {/* Visual Custom Chart Bar */}
            <div className="flex items-end justify-between h-48 px-2 gap-4">
              {sixMonthIncome.map((data, idx) => {
                const percentageHeight = Math.max(10, Math.round((data.value / maxVal) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group cursor-pointer relative">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-slate-950 text-white text-[10px] font-bold px-2 py-1 rounded hidden group-hover:block transition-all z-20 whitespace-nowrap shadow-xl">
                      {formatCurrency(data.value)}
                    </div>
                    
                    {/* Visual Bar element */}
                    <div 
                      style={{ height: `${percentageHeight}%` }}
                      className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 group-hover:brightness-110 ${
                        data.label === 'Mei' 
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/20' 
                          : 'bg-slate-200 group-hover:bg-slate-300'
                      }`}
                    />
                    
                    <span className={`text-[10px] font-black mt-2.5 ${data.label === 'Mei' ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {data.label}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 scale-90 hidden sm:inline">
                      {(data.value / 1000000).toFixed(1)}jt
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span>Bulan Berjalan (Mei)</span>
              </div>
              <span>Nilai dalam Rupiah (Rp)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row Layout: Payment Reminders & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 6. Payment Reminder Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs" id="payment-reminder-section">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-base">Reminder Pembayaran</h3>
              <p className="text-xs text-slate-500 mt-1">Batas jatuh tempo tagihan sewa</p>
            </div>
            <button 
              onClick={() => setActiveTab('reminder')}
              className="text-xs font-bold text-slate-500 hover:text-emerald-650 bg-slate-50 hover:bg-slate-100/90 px-3 py-1.5 rounded-lg border border-slate-200"
            >
              Kirim Tagihan
            </button>
          </div>

          <div className="p-5 space-y-3.5">
            {tenants.filter(t => t.status !== 'Lunas').slice(0, 3).map((tenant, idx) => {
              const dynamicStatus = getTenantStatus(tenant.dueDate, tenant.status);
              const formattedRent = formatCurrency(tenant.monthlyRent);
              const waText = `Halo Kak ${tenant.name}, kami mengingatkan bahwa pembayaran sewa kamar ${tenant.roomNumber} sebesar ${formattedRent} jatuh tempo pada ${tenant.dueDate}. Terima kasih.`;
              const waLink = `https://wa.me/${tenant.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`;
              return (
                <div 
                  key={idx} 
                  id={`reminder-tenant-card-${tenant.name}`}
                  className="p-4 rounded-xl border border-slate-150 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white hover:shadow-xs group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      dynamicStatus === 'Terlambat' ? 'bg-red-50 text-red-650' : 
                      dynamicStatus === 'Jatuh Tempo Hari Ini' ? 'bg-orange-50 text-orange-655' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {dynamicStatus === 'Terlambat' ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5 animate-pulse" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{tenant.name}</span>
                        <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-200/55 px-1.5 py-0.5 rounded">
                          Kamar {tenant.roomNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Jatuh tempo: <span className="font-bold text-slate-700">{tenant.dueDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <span className={`px-2 px-2.5 py-1 text-[10px] sm:text-xs font-black rounded-lg ${
                      dynamicStatus === 'Terlambat' ? 'bg-red-100 text-red-800' : 
                      dynamicStatus === 'Jatuh Tempo Hari Ini' ? 'bg-orange-100 text-orange-850 animate-pulse' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {dynamicStatus}
                    </span>
                    
                    {/* WhatsApp Reminder Button */}
                    <a 
                      href={waLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 group-hover:underline"
                      id={`wa-direct-${tenant.id}`}
                    >
                      Kirim Reminder WA <Send className="w-3 h-3 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. Recent Payment Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs animate-in font-medium" id="recent-payment-section">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-base">Riwayat Transaksi</h3>
              <p className="text-xs text-slate-500 mt-1">Riwayat transaksi pembayaran sewa terbaru</p>
            </div>
            <button 
              onClick={() => setActiveTab('pembayaran')}
              className="text-xs font-bold text-slate-500 hover:text-emerald-650"
            >
              Lihat Semua
            </button>
          </div>

          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-150">
                    <th className="py-2.5 px-3">Penghuni</th>
                    <th className="py-2.5 px-3">kamar</th>
                    <th className="py-2.5 px-3">Jumlah</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {payments.slice(0, 4).map((pay, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors" id={`payment-row-${pay.tenantName}`}>
                      <td className="py-3 px-3 font-bold text-slate-900">{pay.tenantName}</td>
                      <td className="py-3 px-3">Kamar {pay.roomNumber}</td>
                      <td className="py-3 px-3 font-extrabold text-slate-800">{formatCurrency(pay.amount)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          pay.status === 'Lunas' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-50 text-red-650'
                        }`}>
                          {pay.status === 'Lunas' ? 'Lunas' : 'Belum Lunas'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* ================================= ADD ROOM MODAL ================================= */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-150 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-slate-900 mb-2">Form Tambah Kamar Baru</h3>
            <p className="text-xs text-slate-500 mb-4">Gunakan form ini untuk mendaftarkan ruang sewa baru ke dalam database KosManage.</p>
            
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Kamar</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: A05, B10"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 px-4 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipe Fasilitas Kamar</label>
                <select 
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 px-4 outline-none transition-all font-bold"
                >
                  <option value="AC + Kamar Mandi Dalam">AC + Kamar Mandi Dalam</option>
                  <option value="Ekonomi Kipas">Ekonomi Kipas</option>
                  <option value="Standar AC">Standar AC</option>
                  <option value="Suite Premium">Suite Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Caj Sewa Bulanan (Rp)</label>
                <input 
                  type="number" 
                  required
                  value={newRoomPrice}
                  onChange={(e) => setNewRoomPrice(e.target.value)}
                  placeholder="Contoh: 750000"
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 px-4 outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kondisi Awal</label>
                <div className="flex gap-4">
                  {(['Kosong', 'Perbaikan'] as const).map((st) => (
                    <label key={st} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="init-status" 
                        checked={newRoomStatus === st}
                        onChange={() => setNewRoomStatus(st)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      {st === 'Kosong' ? 'Siap Huni' : 'Sedang Perbaikan'}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddRoomModal(false)}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-center text-xs transition-colors"
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center text-xs transition-colors shadow-sm"
                >
                  Simpan Kamar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================= ADD TENANT MODAL ================================= */}
      {showAddTenantModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-150 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-slate-900 mb-2">Form Tambah Penghuni Baru</h3>
            <p className="text-xs text-slate-500 mb-4">Daftarkan profil penghuni baru pada unit kamar yang tersedia di asrama.</p>
            
            <form onSubmit={handleAddTenant} className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Muhammad Budi"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 px-4 outline-none transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Kamar</label>
                  <select 
                    value={newTenantRoom} 
                    onChange={(e) => {
                      setNewTenantRoom(e.target.value);
                      const matchedRoom = rooms.find(r => r.number === e.target.value);
                      if (matchedRoom) {
                        setNewTenantRent(matchedRoom.price.toString());
                      }
                    }}
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none transition-all font-bold"
                  >
                    <option value="">Pilih Kamar--</option>
                    {rooms.filter(room => room.status === 'Kosong').map((room) => (
                      <option key={room.number} value={room.number}>
                        Kamar {room.number} ({formatCurrency(room.price)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Harga Sewa Sesuai</label>
                  <input 
                    type="number" 
                    required
                    value={newTenantRent}
                    onChange={(e) => setNewTenantRent(e.target.value)}
                    placeholder="Auto dari detail Kamar"
                    className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor HP / WhatsApp Aktif</label>
                <input 
                  type="text" 
                  placeholder="Contoh: 08123456789"
                  value={newTenantPhone}
                  onChange={(e) => setNewTenantPhone(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-emerald-500 focus:bg-white text-xs sm:text-sm rounded-xl py-3 px-4 outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Jatuh Tempo Pertama</label>
                <input 
                  type="date" 
                  required
                  value={newTenantDueDate}
                  onChange={(e) => setNewTenantDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none font-sans font-bold"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddTenantModal(false)}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-center text-xs transition-colors"
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center text-xs transition-colors shadow-sm"
                >
                  Daftarkan Penyewa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================= RECORD PAYMENT MODAL ================================= */}
      {showRecordPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-150 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-slate-900 mb-2">Pencatatan Pembayaran Lunas</h3>
            <p className="text-xs text-slate-500 mb-4">Gunakan form ini untuk merekam pelunasan tagihan bulanan secara tunai ataupun transfer.</p>
            
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pilih Penghuni Kost</label>
                <select 
                  value={payTenantId}
                  onChange={(e) => {
                    setPayTenantId(e.target.value);
                    const matchedTenant = tenants.find(t => t.id === e.target.value);
                    if (matchedTenant) {
                      setPayAmount(matchedTenant.monthlyRent.toString());
                    }
                  }}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none transition-all font-bold"
                >
                  <option value="">Pilih Penyewa--</option>
                  {tenants.filter(t => t.status !== 'Lunas').map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Kamar {t.roomNumber} - {formatCurrency(t.monthlyRent)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jumlah Penyelesaian (Rp)</label>
                <input 
                  type="number" 
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Contoh: 750000"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Bayar Penerapan</label>
                <input 
                  type="date" 
                  required
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none font-bold"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowRecordPaymentModal(false)}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-center text-xs transition-colors"
                >
                  Batalkan
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center text-xs transition-colors shadow-sm"
                >
                  Verifikasi &amp; Lunas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================= QRIS PREVIEW MODAL ================================= */}
      {showQrisModal && selectedQrisBill && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-150 flex flex-col items-center text-center">
            
            <button 
              onClick={() => {
                setShowQrisModal(false);
                setSelectedQrisBill(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-550/10 hover:bg-slate-50 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div className="w-full flex items-center justify-center gap-2 mb-2 bg-slate-50 py-2 rounded-xl border border-slate-100">
              <span className="font-black text-rose-600 tracking-tighter text-sm">QRIS</span>
              <span className="text-[10px] bg-slate-200 text-slate-600 font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">GPN</span>
              <span className="text-slate-300 text-xs">|</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Automatic Billing Gateway</span>
            </div>

            <h3 className="text-lg font-black text-slate-900 mt-2">QRIS Pembayaran Sewa</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">Pindai kode QRIS di bawah untuk melakukan pembayaran sewa otomatis</p>

            <div className="bg-slate-50 w-full rounded-2xl p-4 border border-slate-150 mb-5 text-left space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Penyewa</span>
                <span className="font-extrabold text-slate-900 text-sm">{selectedQrisBill.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Unit Kamar</span>
                <span className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">Kamar {selectedQrisBill.roomNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Total Tagihan</span>
                <span className="font-black text-emerald-700 text-sm">{formatCurrency(selectedQrisBill.monthlyRent)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider font-semibold">Batas Waktu</span>
                <span className="font-bold text-slate-600">{selectedQrisBill.dueDate}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-200">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Status Tagihan</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border select-none ${getStatusBadge(getBillingStatus(selectedQrisBill.dueDate, selectedQrisBill.status))}`}>
                  {getBillingStatus(selectedQrisBill.dueDate, selectedQrisBill.status)}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 flex flex-col items-center justify-center shadow-inner relative w-44 h-44 mb-6 group select-none">
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="22" height="22" rx="2" fill="#0f172a" />
                <rect x="9" y="9" width="14" height="14" rx="1" fill="#ffffff" />
                <rect x="11" y="11" width="10" height="10" rx="1" fill="#059669" />

                <rect x="73" y="5" width="22" height="22" rx="2" fill="#0f172a" />
                <rect x="77" y="9" width="14" height="14" rx="1" fill="#ffffff" />
                <rect x="79" y="11" width="10" height="10" rx="1" fill="#059669" />

                <rect x="5" y="73" width="22" height="22" rx="2" fill="#0f172a" />
                <rect x="9" y="77" width="14" height="14" rx="1" fill="#ffffff" />
                <rect x="11" y="79" width="10" height="10" rx="1" fill="#059669" />

                <rect x="79" y="79" width="16" height="16" rx="2" fill="#0f172a" />
                <rect x="83" y="83" width="8" height="8" rx="1" fill="#ffffff" />

                <path d="M 35 5 H 42 V 12 M 48 5 H 55 V 8 M 60 5 H 67 V 15 M 35 18 H 38 V 25 M 45 18 H 55 V 22 M 63 18 H 68 V 28" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                <path d="M 5 35 H 12 V 42 M 16 35 H 25 V 38 M 31 35 H 45 V 45 M 52 35 H 65 V 40 M 72 35 H 78 V 45" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                <path d="M 5 50 H 15 V 58 M 22 50 H 32 V 55 M 38 50 H 50 V 62 M 56 50 H 68 V 58 H 74" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                <path d="M 35 73 H 42 V 80 M 48 73 H 58 V 85" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                <path d="M 35 90 H 48 V 95 M 54 90 H 68 V 95" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center font-black text-[9px] text-rose-600 shadow-md">QRIS</div>
            </div>

            <div className="w-full space-y-3">
              <button 
                onClick={() => handleSendQrisWa(selectedQrisBill)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
              >
                <Send className="w-4 h-4" />
                Kirim QRIS via WhatsApp
              </button>

              {getBillingStatus(selectedQrisBill.dueDate, selectedQrisBill.status) !== 'Lunas' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center space-y-2">
                  <span className="text-[9px] bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-full select-none tracking-wider uppercase">SIMULATOR DEVEL</span>
                  <button 
                    onClick={() => {
                      handleSimulatePaymentSuccess(selectedQrisBill.name);
                    }}
                    className="w-full py-2.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-250 text-amber-950 font-black rounded-xl text-[11px] sm:text-xs transition-all active:scale-98 shadow-2xs"
                  >
                    Simulasikan Pembayaran Berhasil
                  </button>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                    Fitur ini adalah simulasi prototype. Pada produk asli, status lunas diperbarui otomatis melalui integrasi payment gateway QRIS.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================================= BILL DETAIL MODAL ================================= */}
      {selectedDetailBill && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-150 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setSelectedDetailBill(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>
            
            <h3 className="text-lg font-black text-slate-900 mb-2">Detail Tagihan Penyewa</h3>
            <p className="text-xs text-slate-500 mb-4">Informasi lengkap tagihan dan detail kontak penghuni kamar.</p>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-600 text-white font-black text-lg rounded-xl flex items-center justify-center">
                  {selectedDetailBill.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base leading-none">{selectedDetailBill.name}</h4>
                  <p className="text-xs text-slate-400 mt-1.5">{selectedDetailBill.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Nomor Kamar</span>
                  <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">Kamar {selectedDetailBill.roomNumber}</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Harga Sewa</span>
                  <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block">{formatCurrency(selectedDetailBill.monthlyRent)}</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Batas Transfer</span>
                  <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{selectedDetailBill.dueDate}</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Status Saat Ini</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider inline-block mt-1 border select-none ${getStatusBadge(getBillingStatus(selectedDetailBill.dueDate, selectedDetailBill.status))}`}>
                    {getBillingStatus(selectedDetailBill.dueDate, selectedDetailBill.status)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDetailBill(null)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tenant = selectedDetailBill;
                    setSelectedDetailBill(null);
                    setSelectedQrisBill(tenant);
                    setShowQrisModal(true);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-colors text-center"
                >
                  Lihat QRIS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================= QUICK SEND CHOICES MODAL ================================= */}
      {showQuickSendModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-150 animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowQuickSendModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-550/10 hover:bg-slate-50 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
            
            <h3 className="text-lg font-black text-slate-900 mb-2">Pilih Penerima QRIS WhatsApp</h3>
            <p className="text-xs text-slate-500 mb-4">Kirimkan tagihan sewa QRIS otomatis ke penghuni di bawah melalui chat WhatsApp.</p>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto mb-4 pr-1">
              {['Budi', 'Rani', 'Dimas', 'Sinta'].map((name) => {
                const tenant = tenants.find(t => t.name === name);
                if (!tenant) return null;
                const billStatus = getBillingStatus(tenant.dueDate, tenant.status);
                
                return (
                  <div key={tenant.id} className="p-3 bg-slate-50 border border-slate-150 hover:bg-slate-100/50 rounded-xl flex items-center justify-between gap-3 transition-all animate-fade-in" id={`quick-send-item-${tenant.name}`}>
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs sm:text-sm leading-none">{tenant.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-none font-mono">Kamar {tenant.roomNumber} • {formatCurrency(tenant.monthlyRent)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider border select-none ${getStatusBadge(billStatus)}`}>
                        {billStatus === 'Lunas' ? 'Lunas' : 'Belum'}
                      </span>
                      <button
                        onClick={() => {
                          handleSendQrisWa(tenant);
                          setShowQuickSendModal(false);
                        }}
                        className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowQuickSendModal(false)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
