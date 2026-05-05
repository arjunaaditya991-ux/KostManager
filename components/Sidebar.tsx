import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DoorOpen, 
  CreditCard, 
  BarChart3, 
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
  { id: 'tenants', label: 'Penghuni', icon: Users },
  { id: 'rooms', label: 'Kamar', icon: DoorOpen },
  { id: 'payments', label: 'Pembayaran', icon: CreditCard },
  { id: 'reports', label: 'Laporan', icon: BarChart3 },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-secondary h-screen flex flex-col text-slate-300">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <DoorOpen className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">KostManager</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-white"
            )} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-slate-400 hover:text-white">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Pengaturan</span>
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-all text-slate-400 hover:text-red-400"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
};
