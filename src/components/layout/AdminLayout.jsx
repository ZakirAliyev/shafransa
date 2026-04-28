import React from "react";
import { Link, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { 
  ShieldAlert, 
  Users, 
  LogOut, 
  Database, 
  LayoutDashboard, 
  Terminal, 
  Settings,
  Bell,
  Activity,
  Zap,
  Leaf
} from "lucide-react";
import { Button } from "../ui/Button";

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.clear();
  };

  const links = [
    { name: "Command Center", to: "/admin", icon: LayoutDashboard },
    { name: "Node Management", to: "/admin/nodes", icon: Terminal },
    { name: "Citizen Registry", to: "/admin/users", icon: Users },
    { name: "Botanical Ledger", to: "/admin/plants", icon: Database },
    { name: "System Config", to: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#09090b] text-[#fafafa] font-sans selection:bg-rose-500/30">
      {/* Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-white/5 bg-[#09090b] lg:flex sticky top-0 h-screen">
        <div className="flex h-20 items-center px-8 border-b border-white/5">
          <Link to="/" className="flex items-center space-x-2.5 transition-all duration-300">
            <div className="bg-rose-600 text-white p-1.5 rounded-lg shadow-[0_0_20px_rgba(225,29,72,0.4)] rotate-12">
              <ShieldAlert className="w-5 h-5 fill-current" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tighter text-white">System.root</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 px-3">
            Core Infrastructure
          </div>
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? "bg-white/5 text-rose-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" 
                    : "text-white/40 hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <link.icon className={`h-5 w-5 ${isActive ? "text-rose-500" : "opacity-60"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
           <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center font-bold text-rose-500 border border-rose-500/20">
                 {user?.fullName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-white truncate">{user?.fullName}</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500/60">Super Administrator</p>
              </div>
           </div>
           <button
             onClick={handleLogout}
             className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
           >
             <LogOut className="h-5 w-5" />
             <span>Terminate Master Access</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-30 px-8 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 Global Systems Nominal
              </div>
              <div className="hidden xl:flex items-center gap-4 text-white/20 text-xs font-bold uppercase tracking-widest">
                 <div className="flex items-center gap-2"><Activity className="w-3 h-3" /> Latency: 14ms</div>
                 <div className="flex items-center gap-2"><Zap className="w-3 h-3" /> Uptime: 99.99%</div>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 relative">
                 <Bell className="w-5 h-5 text-white/40" />
                 <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#09090b]"></span>
              </Button>
              <div className="h-6 w-[1px] bg-white/5 mx-2"></div>
              <div className="w-10 h-10 rounded-full bg-[#18181b] flex items-center justify-center border border-white/5">
                 <Users className="w-5 h-5 text-white/40" />
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#09090b]">
           <div className="animate-fade-in-up">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}
