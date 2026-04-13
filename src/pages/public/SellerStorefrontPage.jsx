import React from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { getSellerProducts } from "../../services/product.service"
import { Badge } from "../../components/ui/Badge"
import { Store, Loader2, MapPin, Package, ShieldCheck, Star, ChevronLeft, Calendar } from "lucide-react"

export default function SellerStorefrontPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ["sellerProducts", id],
    queryFn: () => getSellerProducts(id),
  })

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary opacity-30" />
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('store.loading_profile', 'Loading institutional profile...')}</p>
    </div>
  )

  if (error || !data || !data.seller) return (
    <div className="text-center py-40 max-w-md mx-auto">
      <Store className="mx-auto h-12 w-12 text-rose-500 mb-4 opacity-50" />
      <p className="font-bold text-rose-500 text-lg">{t('store.not_found', 'Institution Not Found')}</p>
      <Link to="/marketplace" className="text-sm text-primary mt-4 block hover:underline">← {t('store.return_marketplace', 'Return to Marketplace')}</Link>
    </div>
  )

  const { seller, products } = data

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Cover Header */}
      <div className="min-h-[300px] w-full bg-neutral-900 relative overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534067783941-51c9c2a8f436?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-20 pb-10 pt-24">
          <button onClick={() => navigate(-1)} className="absolute top-8 left-4 lg:left-8 flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> {t('store.back', 'Back')}
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-3xl bg-white p-2 shadow-2xl flex-shrink-0">
              <div className="w-full h-full rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-100 overflow-hidden">
                {seller.avatar ? (
                  <img src={seller.avatar} alt={seller.fullName} className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-10 h-10 md:w-16 md:h-16 text-primary opacity-20" />
                )}
              </div>
            </div>
            <div className="w-full">
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 backdrop-blur-md border border-primary/30 font-bold uppercase tracking-widest text-[10px] px-3 py-1">{t('store.verified_badge', 'VERIFIED INSTITUTION')}</Badge>
              </div>
              <h1 className="text-3xl md:text-6xl font-display font-bold text-white tracking-tight break-words">{seller.fullName}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-xs md:text-sm text-white/50 font-medium">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {t('store.global_node', 'Global Node')}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {t('store.joined', 'Joined')} {new Date(seller.createdAt).getFullYear()}</span>
              </div>
              {seller.description && (
                <p className="mt-5 text-sm md:text-base text-white/70 max-w-3xl leading-relaxed line-clamp-3 md:line-clamp-none">
                  {seller.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-[#1a1c1e]">{t('store.formulations_title', 'Clinical Formulations')}</h2>
            <p className="text-sm font-medium text-muted-foreground mt-1">{t('store.formulations_subtitle', 'Available specimens from this institution')}</p>
          </div>
          <Badge className="bg-neutral-100 text-[#1a1c1e] font-bold border-transparent">{t('store.products_count', { count: products?.length || 0 }, `${products?.length || 0} Products`)}</Badge>
        </div>

        {products?.length === 0 ? (
          <div className="text-center py-32 rounded-3xl border border-neutral-200 bg-white shadow-xl shadow-black/5">
            <Package className="mx-auto h-12 w-12 mb-4 opacity-10" />
            <p className="text-sm font-bold text-[#1a1c1e]">{t('store.no_stock_title', 'No Available Stock')}</p>
            <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">{t('store.no_stock_desc', 'This institution currently has no clinical products available for procurement.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group block rounded-3xl overflow-hidden border border-neutral-100 bg-white hover:shadow-2xl hover:shadow-black/5 hover:border-primary/20 transition-all duration-500">
                <div className="relative aspect-square bg-[#f5f5f7] overflow-hidden">
                  {p.verified && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className="bg-white/90 backdrop-blur text-primary border-primary/20 text-[10px] font-bold shadow-sm">
                        <ShieldCheck className="w-3 h-3 mr-1" /> {t('product.verified_short', 'VERIFIED')}
                      </Badge>
                    </div>
                  )}
                  {(p.image || (p.images && p.images[0])) ? (
                    <img src={p.image || p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                      <Package className="w-10 h-10 text-neutral-300 stroke-1" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 truncate pr-2">
                      {p.category?.name || t('product.uncategorized', 'Uncategorized')}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#1a1c1e]">
                      <Star className="w-3 h-3 text-amber-400 fill-current" />
                      {t('product.new', 'NEW')}
                    </div>
                  </div>
                  <div className="font-bold text-sm text-[#1a1c1e] line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {p.title}
                  </div>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="font-bold text-lg text-primary">${p.price}</span>
                    {p.originalPrice && <span className="text-xs line-through text-muted-foreground font-medium">${p.originalPrice}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
