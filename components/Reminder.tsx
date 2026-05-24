import React, { useState } from 'react';
import { Tenant } from './Dashboard';
import { formatCurrency, getTenantStatus } from '../lib/utils';
import { Bell, Send, CheckCircle2, Clock, Calendar, MessageSquare, Phone, AlertTriangle, CheckSquare } from 'lucide-react';

interface ReminderProps {
  tenants: Tenant[];
  triggerAlert: (text: string, type?: 'success' | 'error') => void;
}

export const Reminder: React.FC<ReminderProps> = ({ tenants, triggerAlert }) => {
  const unpaidTenants = tenants.filter(t => t.status !== 'Lunas');
  
  // Custom draft template - populated with the user's modern, natural wording request
  const [waTemplate, setWaTemplate] = useState(
    'Halo Kak [Nama], kami mengingatkan bahwa pembayaran sewa kamar [Kamar] sebesar [Sewa] jatuh tempo pada [Tenggat]. Terima kasih.'
  );

  const getCustomMessage = (tenant: Tenant) => {
    return waTemplate
      .replace('[Nama]', tenant.name)
      .replace('[Kamar]', `Kamar ${tenant.roomNumber}`)
      .replace('[Sewa]', formatCurrency(tenant.monthlyRent))
      .replace('[Tenggat]', tenant.dueDate);
  };

  const handleSendTestAlert = () => {
    triggerAlert('Draft template SMS / WhatsApp berhasil disimpan!');
  };

  // 3. Dynamic Auto-categorization using the getTenantStatus helper!
  const categorizedReminders = {
    'Terlambat': unpaidTenants.filter(t => getTenantStatus(t.dueDate, t.status) === 'Terlambat'),
    'Jatuh Tempo Hari Ini': unpaidTenants.filter(t => getTenantStatus(t.dueDate, t.status) === 'Jatuh Tempo Hari Ini'),
    'Akan Jatuh Tempo': unpaidTenants.filter(t => getTenantStatus(t.dueDate, t.status) === 'Akan Jatuh Tempo'),
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300" id="reminder-tab-view">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reminder Otomatis</h2>
        <p className="text-sm text-slate-500">Sistem menampilkan penghuni yang akan jatuh tempo, jatuh tempo hari ini, atau terlambat.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Unpaid Tenants List Grouped by categories */}
        <div className="lg:col-span-2 space-y-6">
          
          {(Object.keys(categorizedReminders) as Array<keyof typeof categorizedReminders>).map((category) => {
            const list = categorizedReminders[category];
            if (list.length === 0) return null;

            return (
              <div key={category} className="space-y-3" id={`category-block-${category.replace(/\s+/g, '-')}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    category === 'Terlambat' ? 'bg-red-500 animate-pulse' :
                    category === 'Jatuh Tempo Hari Ini' ? 'bg-orange-500 animate-bounce' : 'bg-amber-400'
                  }`} />
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight uppercase">
                    {category} ({list.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {list.map((tenant) => {
                    const finalMessage = getCustomMessage(tenant);
                    return (
                      <div 
                        key={tenant.id}
                        className="bg-white border border-slate-200 hover:border-emerald-500/20 rounded-2xl p-5 shadow-xs transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                        id={`automated-row-${tenant.name}`}
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-950 text-base">{tenant.name}</span>
                            <span className="px-2 py-0.5 bg-slate-100 font-extrabold text-xs text-slate-800 rounded">
                              Kamar {tenant.roomNumber}
                            </span>
                            <span className={`px-2 py-0.5 text-[9px] uppercase font-black rounded border ${
                              category === 'Terlambat' ? 'bg-red-50 border-red-200 text-red-800' :
                              category === 'Jatuh Tempo Hari Ini' ? 'bg-orange-50 border-orange-200 text-orange-800 animate-pulse' :
                              'bg-amber-50 border-amber-200 text-amber-800'
                            }`}>
                              {category}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs text-slate-550 pt-2 border-t border-slate-100 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              Jatuh tempo: <span className="font-extrabold text-slate-700">{tenant.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-mono text-[11px]">
                              <Phone className="w-3.5 h-3.5 text-emerald-500" />
                              WA: <span className="text-slate-705 font-bold">{tenant.phone}</span>
                            </div>
                          </div>

                          {/* Preview of WA */}
                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-150 text-xs italic text-slate-500 leading-relaxed relative">
                            <MessageSquare className="w-4 h-4 text-slate-300 absolute right-3 bottom-2.5" />
                            &ldquo;{finalMessage}&rdquo;
                          </div>
                        </div>

                        <div className="pt-3 md:pt-0 border-t md:border-0 border-slate-100 flex justify-end">
                          <a
                            href={`https://wa.me/${tenant.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(finalMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            id={`wa-send-btn-${tenant.id}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4.5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 duration-100"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Kirim WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {unpaidTenants.length === 0 && (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-black text-slate-840 text-base">Seluruh Penghuni Lunas!</h3>
              <p className="text-xs text-slate-450">Hebat! Pembukuan rental Anda berjalan dengan tingkat kepuasan prima.</p>
            </div>
          )}
        </div>

        {/* Whatsapp Draft Editor Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between self-start">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-2 inline-flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-emerald-600" />
              Edit Template Draf
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Kustom draf pesan penagihan jatuh tempo Anda agar terkirim dengan sopan dan persuasif.
            </p>

            <textarea 
              rows={6}
              value={waTemplate}
              onChange={(e) => setWaTemplate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-505 focus:bg-white text-xs sm:text-sm rounded-xl py-3 px-4 outline-none font-medium text-slate-700 leading-relaxed"
            />

            <div className="mt-4 p-4 bg-slate-50 rounded-xl space-y-2 select-none text-[10px] text-slate-500">
              <p className="font-bold text-slate-600">Gunakan tag agen dinamis:</p>
              <p><span className="font-mono bg-slate-200 px-1 rounded text-slate-750">[Nama]</span> - Nama Penghuni</p>
              <p><span className="font-mono bg-slate-200 px-1 rounded text-slate-750">[Kamar]</span> - Unit Nomor Kamar</p>
              <p><span className="font-mono bg-slate-200 px-1 rounded text-slate-750">[Sewa]</span> - Tarif Sewa Bulanan</p>
              <p><span className="font-mono bg-slate-200 px-1 rounded text-slate-750">[Tenggat]</span> - Batas Jatuh Tempo</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button 
              id="btn-save-reminder-template"
              onClick={handleSendTestAlert}
              className="bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95"
            >
              Simpan Draft
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

