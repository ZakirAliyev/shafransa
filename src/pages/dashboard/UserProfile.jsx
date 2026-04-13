import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "../../store/useAuthStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMyOrders } from "../../services/order.service"
import { getWishlist } from "../../services/wishlist.service"
import api from "../../services/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Package, ShieldCheck, Loader2, User as UserIcon, Heart, Key, Sparkles, ArrowRight, Leaf, Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom"

export default function UserProfile({ tab = "profile" }) {
  const { t } = useTranslation()
  const { user, fetchMe } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState(tab)
  const [formData, setFormData] = useState({ fullName: user?.fullName || "", email: user?.email || "" })
  const [saveMessage, setSaveMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Sync tab prop with the route
  useEffect(() => setActiveTab(tab), [tab])

  const { data: ordersRaw, isLoading: loadingOrders } = useQuery({
    queryKey: ["orders", "my"],
    queryFn: getMyOrders,
    enabled: activeTab === "orders"
  })

  const { data: wishlistRaw, isLoading: loadingWishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: activeTab === "wishlist"
  })

  const { mutate: updateProfile, isPending: updating } = useMutation({
    mutationFn: (data) => api.put("/users/me", data),
    onSuccess: () => {
      fetchMe()
      setSaveMessage(t('user.profile_updated', "Profile updated!"))
      setTimeout(() => setSaveMessage(""), 3000)
    }
  })

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile(formData)
  }

  // Fix data access — service returns API wrapper already resolved by interceptor
  const orders = Array.isArray(ordersRaw) ? ordersRaw : (ordersRaw?.data || [])
  const wishlist = Array.isArray(wishlistRaw) ? wishlistRaw : (wishlistRaw?.data || [])

  const tabs = [
    { id: "profile", label: t('user.tab_profile', "Profile"), icon: UserIcon, href: "/user" },
    { id: "orders",  label: t('user.tab_orders', "Orders"),  icon: Package,  href: "/user/orders" },
    { id: "wishlist",label: t('user.tab_wishlist', "Wishlist"), icon: Heart,    href: "/user/wishlist" },
    { id: "settings",label: t('user.tab_settings', "Settings"), icon: Key,      href: "/user/settings" },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
      
      <header className="border-b border-neutral-100 pb-8">
        <Badge className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px] px-3 mb-3">
          {t('user.member_badge', 'Member')}
        </Badge>
        <h1 className="text-4xl font-display font-bold tracking-tight text-[#1a1c1e]">
          {t('user.my_account', 'My Account')}
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          {t('user.welcome_back', 'Welcome back')}, {user?.fullName}
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto border-b border-neutral-100 pb-0">
        {tabs.map((t) => (
          <Link
            key={t.id}
            to={t.href}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-[#1a1c1e]"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </Link>
        ))}
      </div>

      {/* ── PROFILE ── */}
      {activeTab === "profile" && (
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 premium-card">
            <CardHeader className="p-8 border-b border-neutral-100/50">
              <CardTitle className="text-xl font-display font-bold">{t('user.personal_details', 'Personal Details')}</CardTitle>
              <CardDescription>{t('user.personal_details_desc', 'Update your name and email address.')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('user.label_fullname', 'Full Name')}</label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="h-12 rounded-xl bg-neutral-50/50 border-neutral-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('user.label_email', 'Email')}</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 rounded-xl bg-neutral-50/50 border-neutral-200"
                    />
                  </div>
                </div>
                {saveMessage && (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700 text-sm font-bold">
                    <Sparkles className="w-4 h-4" /> {saveMessage}
                  </div>
                )}
                <Button type="submit" disabled={updating} className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20">
                  {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : t('user.save_changes', "Save Changes")}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="premium-card p-8 bg-[#1a1c1e] text-white space-y-4 relative overflow-hidden h-fit">
            <div className="absolute right-[-10%] bottom-[-10%] w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <ShieldCheck className="w-8 h-8 text-primary" />
            <div className="relative z-10">
              <h3 className="text-lg font-display font-bold">{t('user.privacy_guard', 'Privacy Guard')}</h3>
              <p className="text-white/50 text-sm mt-1 leading-relaxed">{t('user.privacy_desc', 'Your data is encrypted with AES-256 standards.')}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── ORDERS ── */}
      {activeTab === "orders" && (
        <Card className="premium-card">
          <CardHeader className="p-8 border-b border-neutral-100/50">
            <CardTitle className="text-xl font-display font-bold">{t('user.order_history', 'Order History')}</CardTitle>
            <CardDescription>{t('user.order_history_desc', 'Track all your purchases.')}</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {loadingOrders ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-30" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-24 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50">
                <Package className="mx-auto h-10 w-10 mb-3 text-muted-foreground/20" />
                <p className="font-bold text-[#1a1c1e]">{t('user.no_orders', 'No orders yet')}</p>
                <Link to="/marketplace" className="mt-3 inline-block text-sm font-bold text-primary hover:underline">
                  {t('user.browse_marketplace', 'Browse Marketplace')} →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 rounded-2xl border border-neutral-100 bg-white hover:border-primary/20 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-bold text-[#1a1c1e]">{t('user.label_order', 'Order')} #{(order.id || "").substring(0, 8).toUpperCase()}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-[#1a1c1e]">
                          ${order.items?.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold uppercase mt-1">
                          {t('user.order_confirmed', 'Confirmed')}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 pl-0">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <span className="font-bold text-primary">{item.quantity}×</span>
                          <span className="text-muted-foreground truncate">{item.product?.title}</span>
                          <span className="ml-auto font-bold text-[#1a1c1e]">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── WISHLIST ── */}
      {activeTab === "wishlist" && (
        <div>
          <h2 className="text-xl font-display font-bold text-[#1a1c1e] mb-6">{t('user.saved_items', 'Saved Items')}</h2>
          {loadingWishlist ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary opacity-30" />
            </div>
          ) : wishlist.length === 0 ? (
            <div className="text-center py-24 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50">
              <Heart className="mx-auto h-10 w-10 mb-3 text-muted-foreground/20" />
              <p className="font-bold text-[#1a1c1e]">{t('user.no_wishlist', 'No saved items')}</p>
              <Link to="/marketplace" className="mt-3 inline-block text-sm font-bold text-primary hover:underline">
                {t('user.browse_marketplace', 'Browse Marketplace')} →
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlist.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.productId || item.product?.id}`}
                  className="block rounded-2xl border border-neutral-100 bg-white overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all"
                >
                  <div className="aspect-square bg-neutral-50 flex items-center justify-center">
                    {item.product?.image ? (
                      <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                    ) : (
                      <Leaf className="w-10 h-10 text-muted-foreground/20" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-sm text-[#1a1c1e] line-clamp-2">{item.product?.title}</div>
                    <div className="font-bold text-primary mt-1">${item.product?.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SETTINGS ── */}
      {activeTab === "settings" && (
        <Card className="premium-card max-w-lg">
          <CardHeader className="p-8 border-b border-neutral-100/50">
            <CardTitle className="text-xl font-display font-bold">{t('user.account_settings', 'Account Settings')}</CardTitle>
            <CardDescription>{t('user.account_settings_desc', 'Manage your password and account preferences.')}</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('user.new_password', 'New Password')}</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-12 rounded-xl bg-neutral-50 border-neutral-200 pr-12" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#1a1c1e] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('user.confirm_password', 'Confirm Password')}</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-12 rounded-xl bg-neutral-50 border-neutral-200 pr-12" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#1a1c1e] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button className="rounded-full px-8 h-12 font-bold">{t('user.update_password', 'Update Password')}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
