import React from "react";
import { Link, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { getRoleName } from "../../constants/roles";
import { 
  User, 
  ShoppingBag, 
  Bookmark, 
  LogOut, 
  Home, 
  LayoutDashboard, 
  Settings,
  Bell,
  Search,
  Leaf,
  Activity
} from "lucide-react";
import { Button } from "../ui/Button";

export default function UserLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.clear();
  };

  const userRole = getRoleName(user?.role);
  const isTherapist = userRole === "THERAPIST";
  const basePath = isTherapist ? "/expert" : "/user";

  const links = isTherapist ? [
    { name: "Expert Overview", to: "/expert", icon: Activity },
    { name: "Clinical Settings", to: "/expert/settings", icon: Settings },
  ] : [
    { name: "Overview", to: "/user", icon: LayoutDashboard },
    { name: "Order History", to: "/user/orders", icon: ShoppingBag },
    { name: "Saved Protocols", to: "/user/saved", icon: Bookmark },
    { name: "Account Settings", to: "/user/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#fafafa] text-foreground font-sans">
      {/* Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-neutral-200/50 bg-white lg:flex sticky top-0 h-screen">
        <div className="flex h-20 items-center px-8 border-b border-neutral-100">
          <Link to="/" className="flex items-center space-x-2.5 transition-all duration-300">
            <div className="bg-primary text-white p-1.5 rounded-lg shadow-lg rotate-12">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tighter text-[#1a1c1e]">Shafransa</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-4 px-3">
            Main Menu
          </div>
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
                    : "text-muted-foreground hover:bg-neutral-50 hover:text-[#1a1c1e]"
                }`}
              >
                <link.icon className={`h-5 w-5 ${isActive ? "text-primary" : "opacity-60"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-neutral-100 space-y-4">
           <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
                 {user?.fullName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1c1e] truncate">{user?.fullName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{isTherapist ? "Verified Therapist" : "Verified Member"}</p>
              </div>
           </div>
           <button
             onClick={handleLogout}
             className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
           >
             <LogOut className="h-5 w-5" />
             <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-neutral-200/50 bg-white/70 backdrop-blur-xl sticky top-0 z-30 px-8 flex items-center justify-between">
           <div className="flex-1 max-w-md relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search your collection..." 
                className="w-full h-10 pl-10 pr-4 bg-neutral-100 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
              />
           </div>
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-neutral-100 relative">
                 <Bell className="w-5 h-5 text-muted-foreground" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </Button>
              <div className="h-6 w-[1px] bg-neutral-200 mx-2"></div>
              <p className="text-sm font-bold text-[#1a1c1e] hidden sm:block">Welcome, {user?.fullName?.split(' ')[0]}</p>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#fafafa]">
           <div className="animate-fade-in-up">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}
