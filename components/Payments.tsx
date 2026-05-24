import React, { useState } from 'react';
import { Payment, Tenant } from './Dashboard';
import { formatCurrency } from '../lib/utils';
import { Download, Plus, Search, Calendar, CreditCard, ChevronDown, CheckCircle2, AlertTriangle, Filter } from 'lucide-react';

interface PaymentsProps {
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  triggerAlert: (text: string, type?: 'success' | 'error') => void;
}

export const Payments: React.FC<PaymentsProps> = ({ 
  payments, 
  setPayments, 
  tenants,
  setTenants,
  triggerAlert
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Lunas' | 'Belum Lunas'>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDetailPayment, setSelectedDetailPayment] = useState<Payment | null>(null);

  const handleMarkAsPaid = (pay: Payment) => {
    setPayments(prev => prev.map(p => 
      p.id === pay.id ? { ...p, status: 'Lunas' } : p
    ));

    setTenants(prev => prev.map(t => {
      if (t.name === pay.tenantName || t.roomNumber === pay.roomNumber) {
        return { ...t, status: 'Lunas' };
      }
      return t;
    }));

    triggerAlert(`Sewa ${pay.tenantName} untuk Kamar ${pay.roomNumber} sukses ditandai lunas!`);
  };

  const handleShowDetail = (pay: Payment) => {
    setSelectedDetailPayment(pay);
  };

  const handleSendWaReminderDirectly = (pay: Payment) => {
    const matchedTenant = tenants.find(t => t.name === pay.tenantName || t.roomNumber === pay.roomNumber);
    if (matchedTenant) {
      const formattedRent = formatCurrency(matchedTenant.monthlyRent);
      const text = `Halo Kak ${matchedTenant.name}, kami mengingatkan bahwa pembayaran sewa kamar ${matchedTenant.roomNumber} sebesar ${formattedRent} jatuh tempo pada ${matchedTenant.dueDate}. Terima kasih.`;
      const url = `https://wa.me/${matchedTenant.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    } else {
      triggerAlert('Data kontak telepon penghuni tidak ditemukan!', 'error');
    }
  };

  // New payment logs form
  const [tenantId, setTenantId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2026-05-23');
  const [paymentStatus, setPaymentStatus] = useState<'Lunas' | 'Belum Lunas'>('Lunas');

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;

    const matchedTenant = tenants.find(t => t.id === tenantId);
    if (!matchedTenant) return;

    const priceVal = parseInt(amount) || matchedTenant.monthlyRent;

    const newPayLog: Payment = {
      id: 'P' + (payments.length + 1),
      tenantName: matchedTenant.name,
      roomNumber: matchedTenant.roomNumber,
      amount: priceVal,
      status: paymentStatus,
      date
    };

    // Append to list of payments
    setPayments(prev => [newPayLog, ...prev]);

    // If marked as Lunas, update tenant status
    if (paymentStatus === 'Lunas') {
      setTenants(prev => prev.map(t => 
        t.id === tenantId ? { ...t, status: 'Lunas' } : t
      ));
    }

    setShowAddModal(false);
    setTenantId('');
    setAmount('');
    triggerAlert(`Pembayaran ${formatCurrency(priceVal)} untuk ${matchedTenant.name} berhasil direkam!`);
  };

  // Calculating counters
  const totalReceivedThisMonth = payments
    .filter(p => p.status === 'Lunas')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPaymentsValue = payments
    .filter(p => p.status === 'Belum Lunas')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payments.filter(p => p.status === 'Belum Lunas').length;

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.tenantName.toLowerCase().includes(search.toLowerCase()) || 
                          p.roomNumber.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = filterStatus === 'Semua' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Physical download CSV function
  const handleDownloadCSV = () => {
    try {
      const csvHeaders = 'ID,Penghuni,Kamar,Jumlah,Tanggal,Status\n';
      const csvRows = payments.map(p => 
        `"${p.id}","${p.tenantName}","${p.roomNumber}",${p.amount},"${p.date}","${p.status}"`
      ).join('\n');
      
      const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Laporan_Pembayaran_KosManage_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerAlert('File CSV berhasil diunduh ke perangkat Anda!');
    } catch (err) {
      triggerAlert('Gagal membuat unduhan CSV', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300" id="payments-view-tab">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tagihan &amp; QRIS</h2>
          <p className="text-sm text-slate-500">Buat dan pantau tagihan bulanan otomatis, kirim link QRIS via WhatsApp, dan pantau riwayat secara realtime.</p>
        </div>
        <div className="flex gap-3 self-start sm:self-auto">
          <button 
            id="btn-download-csv"
            onClick={handleDownloadCSV}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-705 px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 duration-100"
          >
            <Download className="w-4 h-4" />
            Unduh CSV
          </button>
          <button 
            id="btn-catat-pembayaran-tab"
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/10 active:scale-95 duration-100"
          >
            <Plus className="w-4 h-4" />
            Catat Manual
          </button>
        </div>
      </div>

      {/* Grid boxes info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        
        {/* Diterima Bulan Ini */}
        <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-500/10 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-100 uppercase tracking-widest">Diterima Bulan Ini</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">{formatCurrency(totalReceivedThisMonth)}</h3>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-emerald-100">
            <Calendar className="w-4 h-4" />
            Terupdate Mei 2026 - Realtime pembukuan
          </div>
        </div>

        {/* Belum Tertagih */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Estimasi Piutang</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">{formatCurrency(pendingPaymentsValue)}</h3>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-amber-600">
            <AlertTriangle className="w-4 h-4 text-emerald-600" />
            Terdapat {pendingCount} tagihan pending / belum lunas
          </div>
        </div>

        {/* Rasio Penyelesaian */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-mono">Tingkat Penagihan</span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              {Math.min(100, Math.round((totalReceivedThisMonth / (totalReceivedThisMonth + pendingPaymentsValue)) * 100)) || 0}%
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-emerald-600 leading-none">
            <CheckCircle2 className="w-4 h-4" />
            Terhitung dari setoran terverifikasi lunas
          </div>
        </div>

      </div>

      {/* List logs Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden" id="payments-history-table">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h4 className="font-extrabold text-slate-900 text-sm">Riwayat Pembukuan Dana</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            
            {/* Search */}
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-2 w-full sm:w-44">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari nama..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-xs font-semibold text-slate-700 w-full"
              />
            </div>

            {/* Selector Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-600 outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Lunas">Lunas</option>
              <option value="Belum Lunas">Belum Lunas</option>
            </select>

          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider text-[10px]/none">
                <th className="py-4 px-6 font-mono">Kode Pembukuan</th>
                <th className="py-4 px-6">Nama Penyewa</th>
                <th className="py-4 px-6">Unit Kamar</th>
                <th className="py-4 px-6">Jumlah Mutasi</th>
                <th className="py-4 px-6 font-mono">Tanggal</th>
                <th className="py-4 px-6">Status Rekam</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors" id={`pay-ledger-row-${pay.id}`}>
                  <td className="py-4 px-6 font-mono font-medium text-slate-415">{pay.id}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">{pay.tenantName}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 bg-slate-100 font-bold text-slate-700 rounded text-xs">
                      Kamar {pay.roomNumber}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-black text-slate-800">{formatCurrency(pay.amount)}</td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-xs">{pay.date}</td>
                  <td className="py-2 px-6">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      pay.status === 'Lunas' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-red-50 text-red-650'
                    }`}>
                      {pay.status === 'Lunas' ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </td>
                  <td className="py-2 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {pay.status !== 'Lunas' && (
                        <button
                          onClick={() => handleMarkAsPaid(pay)}
                          className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-2.5 py-1.5 rounded-lg transition-all active:scale-95 shadow-xs"
                        >
                          Tandai Lunas
                        </button>
                      )}
                      <button
                        onClick={() => handleShowDetail(pay)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
                      >
                        Lihat Detail
                      </button>
                      {pay.status !== 'Lunas' && (
                        <button
                          onClick={() => handleSendWaReminderDirectly(pay)}
                          className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-750 font-extrabold px-2.5 py-1.5 border border-emerald-150 rounded-lg transition-all flex items-center gap-1 active:scale-95"
                        >
                          Kirim WA
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payments Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-150 animate-in zoom-in-95 duration-110">
            <h3 className="text-lg font-black text-slate-900 mb-1">Catat Pembayaran Sewa</h3>
            <p className="text-xs text-slate-500 mb-4">Gunakan form untuk mempercepat pelunasan buku kas kost.</p>
            
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Penyewa</label>
                <select
                  value={tenantId}
                  onChange={(e) => {
                    setTenantId(e.target.value);
                    const matchedTenant = tenants.find(t => t.id === e.target.value);
                    if (matchedTenant) {
                      setAmount(matchedTenant.monthlyRent.toString());
                    }
                  }}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-3 outline-none font-bold text-slate-700"
                >
                  <option value="">Pilih Penyewa Aktif--</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Kamar {t.roomNumber} - {formatCurrency(t.monthlyRent)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jumlah Tarik</label>
                <input 
                  type="number" 
                  required
                  placeholder="Jumlah bayar dimasukkan"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Transaksi</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl py-3 px-4 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ubah Status Menjadi</label>
                <div className="flex gap-4">
                  {(['Lunas', 'Belum Lunas'] as const).map((st) => (
                    <label key={st} className="flex items-center gap-2 text-xs font-bold text-slate-705 cursor-pointer">
                      <input 
                        type="radio" 
                        name="pay-status" 
                        checked={paymentStatus === st}
                        onChange={() => setPaymentStatus(st)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      {st === 'Lunas' ? 'Lunas (Tercatat)' : 'Belum Lunas'}
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
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================= DETAIL PAYMENT MODAL ================================= */}
      {selectedDetailPayment && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-150 animate-in zoom-in-95 duration-110">
            <h3 className="text-base font-black text-slate-900 mb-1">Rincian Tagihan KosManage</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">Informasi mendetail terkait catatan transaksi sewa.</p>
            
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs text-slate-700 border border-slate-205">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">ID Pembukuan</span>
                <span className="font-mono font-bold text-slate-900">{selectedDetailPayment.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Nama Penghuni</span>
                <span className="font-extrabold text-slate-900">{selectedDetailPayment.tenantName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Unit Kamar</span>
                <span className="font-bold text-slate-900">Kamar {selectedDetailPayment.roomNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Jumlah Tagihan</span>
                <span className="font-black text-emerald-700 text-sm">{formatCurrency(selectedDetailPayment.amount)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Tanggal Catat</span>
                <span className="font-mono font-bold text-slate-900">{selectedDetailPayment.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Status Saat Ini</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  selectedDetailPayment.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-850'
                }`}>{selectedDetailPayment.status === 'Lunas' ? 'Lunas' : 'Belum Lunas'}</span>
              </div>
            </div>
            
            <div className="mt-5 flex justify-end">
              <button 
                onClick={() => setSelectedDetailPayment(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
