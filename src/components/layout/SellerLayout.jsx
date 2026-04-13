import React from "react";
import { Link, Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Package, BarChart3, Settings, LogOut, Store } from "lucide-react";

export default function SellerLayout() {
  const { user, logout } = useAuthStore();

  if (!user || user.role !== "SELLER") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-muted/20 text-foreground">
      <aside className="hidden w-64 flex-col border-r bg-card lg:flex shadow-sm">
        <div className="flex h-16 items-center border-b border-border/50 px-6">
          <span className="flex items-center font-bold text-primary">
            <Store className="h-5 w-5 mr-2" />
            Seller Hub
          </span>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          <Link to="/seller" className="flex items-center space-x-3 rounded-md px-3 py-2 hover:bg-muted">
            <BarChart3 className="h-4 w-4" /> <span>Overview</span>
          </Link>
          <Link to="/seller/products" className="flex items-center space-x-3 rounded-md px-3 py-2 hover:bg-muted">
            <Package className="h-4 w-4" /> <span>My Products</span>
          </Link>
          <Link to="/seller/orders" className="flex items-center space-x-3 rounded-md px-3 py-2 hover:bg-muted">
            <Package className="h-4 w-4" /> <span>Orders</span>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button onClick={logout} className="flex w-full items-center space-x-3 px-3 py-2 text-sm text-foreground/60 hover:text-foreground">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
