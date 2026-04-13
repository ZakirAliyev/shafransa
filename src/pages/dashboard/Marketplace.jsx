import React, { useState, useEffect, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { getProducts } from "../../services/product.service"
import { getCategories } from "../../services/category.service"
import { addToCart } from "../../services/cart.service"
import { toggleWishlist } from "../../services/wishlist.service"
import { useAuthStore } from "../../store/useAuthStore"
import { useWishlistStore } from "../../store/useWishlistStore"
import { toast } from "../../store/useToastStore"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { 
  ShoppingCart, ShieldCheck, Search, Loader2, SlidersHorizontal, 
  ArrowRight, Leaf, Star, Heart, X, ChevronDown, Filter
} from "lucide-react"

export default function Marketplace() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated } = useAuthStore()
  const wishlistStore = useWishlistStore()
  const queryClient = useQueryClient()

  const SORT_OPTIONS = [
    { value: "newest", label: t('marketplace.sort.newest', 'Newest First') },
    { value: "priceAsc", label: t('marketplace.sort.price_asc', 'Price: Low to High') },
    { value: "priceDesc", label: t('marketplace.sort.price_desc', 'Price: High to Low') },
  ]

  const FORMS = ["Tea", "Extract", "Capsule", "Oil", "Powder", "Tincture"]

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "")
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput)

  const activeCategory = searchParams.get("category") || ""
  const activeSort = searchParams.get("sort") || "newest"
  const activeMinPrice = searchParams.get("minPrice") || ""
  const activeMaxPrice = searchParams.get("maxPrice") || ""
  const activeForm = searchParams.get("form") || ""
  const currentPage = Number(searchParams.get("page") || 1)

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 400)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    updateParam("search", debouncedSearch)
  }, [debouncedSearch])

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    if (key !== "page") params.delete("page")
    setSearchParams(params, { replace: true })
  }

  const queryParams = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(activeCategory && { category: activeCategory }),
    ...(activeSort && { sort: activeSort }),
    ...(activeMinPrice && { minPrice: activeMinPrice }),
    ...(activeMaxPrice && { maxPrice: activeMaxPrice }),
    ...(activeForm && { form: activeForm }),
    page: currentPage,
    limit: 12,
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => getProducts(queryParams),
    keepPreviousData: true,
  })

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  })

  const products = data?.data || []
  const pagination = data?.pagination || {}

  const { mutate: addToCartMutation, isPending: isAddingToCart } = useMutation({
    mutationFn: (productId) => addToCart(productId, 1),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"])
      toast.success(t('product.cart.added_simple', 'Added to your collection!'))
    },
    onError: () => toast.error(t('product.cart.error', 'Failed to add to cart')),
  })

  const handleAddToCart = (e, productId) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.info(t('auth.login_required_cart', "Please sign in to add items to cart"))
      navigate("/login")
      return
    }
    addToCartMutation(productId)
  }

  const { mutate: toggleWish } = useMutation({
    mutationFn: (productId) => toggleWishlist(productId),
    onSuccess: (res, productId) => {
      queryClient.invalidateQueries(["wishlist"])
      wishlistStore.toggle(productId)
      if (res.action === "added") toast.success(t('product.wishlist.added', "Saved to wishlist"))
      else toast.info(t('product.wishlist.removed', "Removed from wishlist"))
    },
    onError: () => toast.error(t('product.wishlist.error', 'Failed to update wishlist'))
  })

  const handleWishlist = (e, productId) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.info(t('auth.login_required_save', "Please sign in to save items"))
      navigate("/login")
      return
    }
    toggleWish(productId)
  }

  const hasActiveFilters = activeCategory || activeMinPrice || activeMaxPrice || activeForm || debouncedSearch
  const resetFilters = () => {
    setSearchInput("")
    setSearchParams({})
  }

  return (
    <div className="max-w-screen-2xl mx-auto py-12 px-4 lg:px-8">
      
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-neutral-100">
          <div className="space-y-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-bold text-[10px] uppercase tracking-widest px-3">
              {t('marketplace.badge', 'Verified Inventory')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#1a1c1e]">
              {t('marketplace.title_p1', 'Global Botanical')}<br />{t('marketplace.title_p2', 'Exchange')}
            </h1>
            <p className="text-muted-foreground font-medium max-w-lg">
              {t('marketplace.subtitle', 'Sourced directly from verified organic growers. Every batch tested and certified.')}
            </p>
          </div>
          {pagination.total && (
            <div className="text-right">
              <div className="text-2xl font-display font-bold text-[#1a1c1e]">{pagination.total}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('marketplace.stats.total', 'Products Available')}</div>
            </div>
          )}
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('marketplace.search_placeholder', 'Search plants, extracts, compounds...')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-2xl border border-neutral-200 bg-white shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {searchInput && (
            <button onClick={() => setSearchInput("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#1a1c1e]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={activeSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="h-14 px-5 rounded-2xl border border-neutral-200 bg-white shadow-sm text-sm font-semibold text-[#1a1c1e] focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button onClick={resetFilters} className="h-14 px-5 rounded-2xl border border-rose-200 bg-rose-50 text-sm font-bold text-rose-600 flex items-center gap-2 hover:bg-rose-100 transition-colors">
            <X className="w-4 h-4" /> {t('common.reset', 'Reset')}
          </button>
        )}
      </div>

      <div className="flex gap-8">
        
        {/* ─── LEFT SIDEBAR ─── */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          
          {/* Categories */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">{t('marketplace.filters.categories', 'Categories')}</h3>
            <div className="space-y-1">
              <button
                onClick={() => updateParam("category", "")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${!activeCategory ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-neutral-50 hover:text-[#1a1c1e]"}`}
              >
                {t('marketplace.filters.all', 'All Products')}
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam("category", cat.slug)}
                  className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeCategory === cat.slug ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-neutral-50 hover:text-[#1a1c1e]"}`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] font-bold text-muted-foreground/40">{cat._count?.products || 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">{t('marketplace.filters.price', 'Price Range')}</h3>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder={t('common.min', "Min")}
                value={activeMinPrice}
                onChange={(e) => updateParam("minPrice", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-sm text-[#1a1c1e] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="text-muted-foreground">–</span>
              <input
                type="number"
                placeholder={t('common.max', "Max")}
                value={activeMaxPrice}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-sm text-[#1a1c1e] focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Form */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">{t('marketplace.filters.form', 'Product Form')}</h3>
            <div className="flex flex-wrap gap-2">
              {FORMS.map((f) => (
                <button
                  key={f}
                  onClick={() => updateParam("form", activeForm === f ? "" : f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${activeForm === f ? "bg-primary text-white border-primary" : "border-neutral-200 text-muted-foreground hover:border-primary/30 hover:text-primary"}`}
                >
                  {t(`product.forms.${f.toLowerCase()}`, f)}
                </button>
              ))}
            </div>
          </div>

          {/* Verified only */}
          <div>
            <button
              onClick={() => updateParam("verified", searchParams.get("verified") === "true" ? "" : "true")}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-colors ${searchParams.get("verified") === "true" ? "border-primary bg-primary/5 text-primary" : "border-neutral-200 text-muted-foreground hover:border-primary/30"}`}
            >
              <ShieldCheck className="w-4 h-4" /> {t('marketplace.filters.verified_only', 'Lab Verified Only')}
            </button>
          </div>
        </aside>

        {/* ─── PRODUCT GRID ─── */}
        <div className="flex-1 min-w-0">
          
          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  "{debouncedSearch}" <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchInput("")} />
                </span>
              )}
              {activeCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                  {categories?.find(c => c.slug === activeCategory)?.name} <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam("category", "")} />
                </span>
              )}
              {activeForm && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-bold">
                  {t(`product.forms.${activeForm.toLowerCase()}`, activeForm)} <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam("form", "")} />
                </span>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-24 premium-card border-dashed border-2 bg-rose-50/50 border-rose-100">
              <p className="font-bold text-rose-500">{t('marketplace.error', 'Failed to load products. Please try again.')}</p>
              <button onClick={() => window.location.reload()} className="mt-4 text-sm text-muted-foreground hover:text-rose-500 underline">{t('common.retry', 'Retry')}</button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-40 premium-card border-dashed border-2 bg-neutral-50/50 border-neutral-200">
              <Leaf className="mx-auto w-12 h-12 text-muted-foreground/20 mb-4" />
              <p className="font-bold text-lg text-[#1a1c1e]">{t('marketplace.empty.title', 'No products found')}</p>
              <p className="text-sm text-muted-foreground mt-2">{t('marketplace.empty.subtitle', 'Try adjusting your filters or search term')}</p>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="mt-4 text-sm font-bold text-primary hover:underline">{t('common.reset_filters', 'Reset all filters')}</button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistStore.isInWishlist(product.id)}
                    onAddToCart={handleAddToCart}
                    onWishlist={handleWishlist}
                    isAddingToCart={isAddingToCart}
                    t={t}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {Array.from({ length: pagination.pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateParam("page", String(i + 1))}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-colors ${currentPage === i + 1 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white border border-neutral-200 text-muted-foreground hover:border-primary/30"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, isWishlisted, onAddToCart, onWishlist, isAddingToCart, t }) {
  const avgRating = product.avgRating || 0

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="rounded-3xl overflow-hidden border border-neutral-100 bg-white hover:shadow-2xl hover:shadow-black/8 hover:border-primary/20 transition-all duration-500">
        
        {/* Image */}
        <div className="relative aspect-square bg-[#f5f5f7] overflow-hidden">
          {product.verified && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-white/90 backdrop-blur text-primary border-primary/20 text-[10px] font-bold shadow-sm">
                <ShieldCheck className="w-3 h-3 mr-1" /> {t('product.verified_short', 'VERIFIED')}
              </Badge>
            </div>
          )}
          {product.originalPrice && (
            <div className="absolute top-3 right-12 z-10">
              <Badge className="bg-rose-500 text-white border-none text-[10px] font-bold">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Badge>
            </div>
          )}
          <button
            onClick={(e) => onWishlist(e, product.id)}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isWishlisted ? "bg-rose-500 text-white" : "bg-white/80 text-muted-foreground hover:bg-white hover:text-rose-500"}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Leaf className="w-16 h-16 text-primary/10 stroke-1" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 space-y-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-1">
              {product.seller ? (
                <span className="hover:text-primary transition-colors">
                  {product.seller.fullName}
                </span>
              ) : (
                product.category?.name || "Shafransa"
              )}
            </div>
            <h3 className="font-display font-bold text-lg text-[#1a1c1e] leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>
            {product.scientificName && (
              <div className="text-xs italic text-muted-foreground mt-0.5">{product.scientificName}</div>
            )}
          </div>

          <StarRating rating={avgRating} count={product._count?.reviews || 0} />

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-2xl font-display font-bold text-[#1a1c1e]">${product.price}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm line-through text-muted-foreground">${product.originalPrice}</span>
              )}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${product.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
              {product.stock > 0 ? t('product.stock_left', '{{count}} left', { count: product.stock }) : t('product.out_of_stock', "Out of stock")}
            </span>
          </div>

          <button
            onClick={(e) => onAddToCart(e, product.id)}
            disabled={isAddingToCart || product.stock === 0}
            className={`w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              product.stock === 0
                ? "bg-neutral-100 text-muted-foreground/50 cursor-not-allowed"
                : "bg-[#1a1c1e] text-white hover:bg-primary shadow-lg shadow-black/10 group-hover:shadow-primary/20"
            }`}
          >
            {product.stock === 0 ? t('product.out_of_stock', "Out of Stock") : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {t('product.add_to_cart', 'Add to Cart')}
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400 fill-current" : "text-neutral-200 fill-current"}`} />
        ))}
      </div>
      {count > 0 && <span className="text-[10px] font-bold text-muted-foreground/60">({count})</span>}
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl overflow-hidden border border-neutral-100 bg-white">
      <div className="aspect-square bg-neutral-100" />
      <div className="p-6 space-y-3">
        <div className="h-3 bg-neutral-100 rounded w-24" />
        <div className="h-5 bg-neutral-100 rounded w-3/4" />
        <div className="h-4 bg-neutral-100 rounded w-1/2" />
      </div>
    </div>
  )
}
