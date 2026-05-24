import React from 'react';
import { 
  LayoutDashboard, 
  Building2,
  DoorOpen, 
  Users, 
  CreditCard, 
  Bell,
  BarChart3, 
  Award,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'data_kost', label: 'Data Kost', icon: Building2 },
  { id: 'kamar', label: 'Kamar', icon: DoorOpen },
  { id: 'penghuni', label: 'Penghuni', icon: Users },
  { id: 'pembayaran', label: 'Tagihan & QRIS', icon: CreditCard },
  { id: 'reminder', label: 'Reminder Tagihan', icon: Bell },
  { id: 'laporan', label: 'Laporan', icon: BarChart3 },
  { id: 'langganan', label: 'Langganan', icon: Award },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300 flex-shrink-0 z-10 shadow-xl" id="sidebar-container">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 text-primary border border-primary/35 rounded-xl flex items-center justify-center shadow-lg shadow-primary/10">
            <DoorOpen className="text-primary w-6 h-6" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">KosManage</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            id={`sidebar-tab-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative",
              activeTab === item.id 
                ? "bg-primary text-white shadow-md shadow-primary/20 font-bold" 
                : "hover:bg-slate-800 text-slate-400 hover:text-white font-medium"
            )}
          >
            {activeTab === item.id && (
              <span className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r" />
            )}
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
              activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-white"
            )} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1 bg-slate-950/30">
        <button 
          id="btn-sidebar-keluar"
          onClick={() => window.location.reload()}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all text-slate-400 hover:text-red-400 font-medium group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-transform group-hover:translate-x-1" />
          <span className="text-sm">Keluar ke Landing</span>
        </button>
      </div>
    </div>
  );
};
