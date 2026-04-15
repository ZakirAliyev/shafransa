import React, { useState, useEffect, useRef } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "../../store/useAuthStore"
import { getRoleName } from "../../constants/roles"
import { getCart } from "../../services/cart.service"
import { getWishlist } from "../../services/wishlist.service"
import { useWishlistStore } from "../../store/useWishlistStore"
import LanguageSwitcher from "../LanguageSwitcher"
import { 
  Leaf, Search, ShoppingCart, Heart, User, LogOut, 
  Menu, X, ChevronDown, LayoutGrid, BrainCircuit, Package, 
  Settings, ShieldCheck, Info, HelpCircle, Activity
} from "lucide-react"
import ScrollToTop from "../shared/ScrollToTop"

import logo from "../../assets/logo.png"

// Primary links always visible on desktop
const PRIMARY_NAV = [
  { label: "nav_marketplace", to: "/marketplace" },
  { label: "nav_encyclopedia", to: "/herbs" },
  { label: "nav_therapists", to: "/therapists" },
]

// Secondary links go in the bars/more dropdown on desktop
const MORE_NAV = [
  { label: "nav_ai_consultant", to: "/ai-consultant", icon: BrainCircuit },
  { label: "nav_about", to: "/about", icon: Info },
  { label: "nav_how_it_works", to: "/how-it-works", icon: Activity },
  { label: "nav_help_center", to: "/contact", icon: HelpCircle },
]

// Mobile drawer gets ALL links
const ALL_NAV = [
  { label: "nav_marketplace", to: "/marketplace", icon: Package },
  { label: "nav_encyclopedia", to: "/herbs", icon: Leaf },
  { label: "nav_therapists", to: "/therapists", icon: Activity },
  { label: "nav_ai_consultant", to: "/ai-consultant", icon: BrainCircuit },
  { label: "nav_about", to: "/about", icon: Info },
  { label: "nav_how_it_works", to: "/how-it-works", icon: Activity },
  { label: "nav_help_center", to: "/contact", icon: HelpCircle },
]

const USER_MENU = [
  { label: "my_profile", to: "/user", icon: User },
  { label: "my_orders", to: "/user/orders", icon: Package },
  { label: "my_wishlist", to: "/user/wishlist", icon: Heart },
]

export default function PublicLayout() {
  const { t } = useTranslation()
  const { isAuthenticated, logout, user } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const wishlistStore = useWishlistStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const moreMenuRef = useRef(null)
  
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated,
  })
  const cartCount = cartData?.items?.length || 0

  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (wishlistData) {
      const items = Array.isArray(wishlistData) ? wishlistData : (wishlistData?.data || [])
      const ids = items.map(item => item.productId || item.product?.id).filter(Boolean)
      wishlistStore.setItems(ids)
    }
  }, [wishlistData])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
    setMoreMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) setMoreMenuOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/")
  const isMoreActive = MORE_NAV.some(link => isActive(link.to))

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] text-foreground font-sans">
      
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-[100] w-full border-b border-neutral-200/50 bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-[64px] items-center justify-between gap-4 px-4">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <img 
              src={logo} 
              alt="Shafransa" 
              className="h-10 w-auto group-hover:scale-105 transition-transform duration-500" 
            />
          </Link>

          {/* Desktop Nav — only primary links */}
          <nav className="hidden lg:flex items-center gap-1">
            {PRIMARY_NAV.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive(link.to)
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-[#1a1c1e] hover:bg-neutral-100"
                  }`}
              >
                {t(link.label)}
              </Link>
            ))}

            {/* ── "More" Bars Dropdown ── */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setMoreMenuOpen(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isMoreActive || moreMenuOpen
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-[#1a1c1e] hover:bg-neutral-100"
                  }`}
                aria-label="More pages"
              >
                <LayoutGrid className="w-4 h-4" />
                {t('more')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-neutral-100 shadow-2xl shadow-black/10 rounded-2xl py-2 z-50 animate-fade-in-up">
                  {MORE_NAV.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${isActive(link.to)
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-[#1a1c1e] hover:bg-neutral-50"
                        }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {t(link.label)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Language Switcher — Desktop only */}
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {/* Search */}
            <Link
              to="/marketplace"
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-sm text-muted-foreground font-medium transition-colors"
            >
              <Search className="w-4 h-4" /> <span className="hidden xl:inline">{t('search_herbs')}</span>
            </Link>

            {/* Wishlist */}
            <Link
              to={isAuthenticated ? "/user/wishlist" : "/login"}
              className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors text-muted-foreground hover:text-[#1a1c1e]"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors text-muted-foreground hover:text-[#1a1c1e]"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {user?.fullName?.charAt(0)}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-100 shadow-2xl shadow-black/10 rounded-2xl py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-neutral-50">
                      <div className="font-bold text-sm text-[#1a1c1e]">{user?.fullName}</div>
                      <div className="text-xs text-muted-foreground font-medium truncate">{user?.email}</div>
                      {(() => {
                        const userRole = getRoleName(user?.role);
                        return (
                          <>
                            <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${userRole === "ADMIN" || userRole === "EDITOR" ? "text-rose-500" : userRole === "SELLER" ? "text-blue-500" : "text-primary"}`}>{userRole}</div>
                          </>
                        );
                      })()}
                    </div>
                    {USER_MENU.map((item) => (
                      <Link key={item.to} to={item.to} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-[#1a1c1e] hover:bg-neutral-50 transition-colors">
                        <item.icon className="w-4 h-4" />
                        {t(item.label)}
                      </Link>
                    ))}
                    {(getRoleName(user?.role) === "SELLER") && (
                      <Link to="/seller" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                        <Settings className="w-4 h-4" /> {t('seller_dashboard')}
                      </Link>
                    )}
                    {(getRoleName(user?.role) === "ADMIN" || getRoleName(user?.role) === "EDITOR") && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors">
                        <ShieldCheck className="w-4 h-4" /> {t('admin_panel')}
                      </Link>
                    )}
                    <div className="border-t border-neutral-50 mt-1 pt-1">
                      <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors">
                        <LogOut className="w-4 h-4" /> {t('sign_out')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 rounded-full text-sm font-bold text-muted-foreground hover:text-[#1a1c1e] hover:bg-neutral-100 transition-colors">
                  {t('sign_in')}
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-full text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                  {t('get_started')}
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-2 rounded-full hover:bg-neutral-100 text-muted-foreground hover:text-[#1a1c1e] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[98] bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 z-[99] w-[320px] max-w-[85vw] bg-white shadow-2xl lg:hidden flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <img src={logo} alt="Shafransa" className="h-8 w-auto" />
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-neutral-100">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Language Switcher — Mobile Drawer */}
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 px-1">{t('select_language', 'Language')}</div>
              <LanguageSwitcher />
            </div>

            {isAuthenticated ? (
              <div className="p-4 border-b border-neutral-50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {user?.fullName?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{user?.fullName}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-neutral-50 flex gap-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border border-neutral-200 text-sm font-bold hover:bg-neutral-50 transition-colors">
                  {t('sign_in')}
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20">
                  {t('get_started')}
                </Link>
              </div>
            )}

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {ALL_NAV.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive(link.to)
                    ? "bg-primary/5 text-primary"
                    : "text-muted-foreground hover:bg-neutral-50 hover:text-[#1a1c1e]"
                    }`}
                >
                  <link.icon className="w-5 h-5 shrink-0" />
                  {t(link.label)}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-neutral-100 space-y-1">
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-neutral-50 hover:text-[#1a1c1e] transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {t('cart.title', 'Cart')}
                {cartCount > 0 && <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" /> {t('sign_out')}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1">
        <ScrollToTop />
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full py-20 px-4 bg-white border-t border-neutral-100 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Shafransa" className="h-10 w-auto" />
            </Link>
            <p className="max-w-xs text-muted-foreground">{t('footer.bio')}</p>
          </div>
          <div className="space-y-4 text-sm">
            <h6 className="font-bold uppercase tracking-widest text-xs text-neutral-400">{t('platform')}</h6>
            <ul className="space-y-3 font-medium text-muted-foreground">
              <li><Link to="/marketplace" className="hover:text-primary transition-colors">{t('nav_marketplace')}</Link></li>
              <li><Link to="/ai-consultant" className="hover:text-primary transition-colors">{t('nav_ai_consultant')}</Link></li>
              <li><Link to="/herbs" className="hover:text-primary transition-colors">{t('nav_encyclopedia')}</Link></li>
            </ul>
          </div>
          <div className="space-y-4 text-sm">
            <h6 className="font-bold uppercase tracking-widest text-xs text-neutral-400">{t('company')}</h6>
            <ul className="space-y-3 font-medium text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">{t('home')}</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">{t('footer.links.about')}</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary transition-colors">{t('nav_how_it_works', 'How It Works')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t('footer.links.help')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-neutral-100 flex flex-col md:flex-row justify-between text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest gap-4">
          <div>© 2026 Shafransa Botanical Intelligence • {t('rights_reserved')}</div>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-primary transition-colors">{t('footer.legal.privacy')}</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">{t('footer.legal.terms')}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
