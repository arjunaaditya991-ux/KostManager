import React from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { TenantManagement } from './TenantManagement';
import { RoomManagement } from './RoomManagement';
import { Payments } from './Payments';
import { Reports } from './Reports';
import { Bell, Search, User } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'tenants': return <TenantManagement />;
      case 'rooms': return <RoomManagement />;
      case 'payments': return <Payments />;
      case 'reports': return <Reports />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl w-96 border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari penghuni, kamar, atau transaksi..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 transition-all group">
              <Bell className="w-5 h-5 text-slate-600 group-hover:text-primary" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-secondary">Arjuna Aditya</p>
                <p className="text-xs text-slate-500">Pemilik Properti</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary transition-all">
                <User className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
