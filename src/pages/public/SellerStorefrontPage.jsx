import React from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { getSellerProducts } from "../../services/product.service"
import { addToCart } from "../../services/cart.service"
import { toggleWishlist } from "../../services/wishlist.service"
import { useAuthStore } from "../../store/useAuthStore"
import { useWishlistStore } from "../../store/useWishlistStore"
import { toast } from "../../store/useToastStore"
import { MOCK_MARKET_PRODUCTS } from "../../services/mockData"
import { Badge } from "../../components/ui/Badge"
import { Store, Loader2, MapPin, Package, ShieldCheck, Star, ChevronLeft, Calendar, ShoppingCart, Heart, Leaf } from "lucide-react"

export default function SellerStorefrontPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ["sellerProducts", id],
    queryFn: () => getSellerProducts(id),
  })

  // rawData is { data: [...products], pagination: {...} } because GET /products wraps in pagination
  // Filter products by sellerId client-side
  const allProducts = Array.isArray(rawData) ? rawData : (Array.isArray(rawData?.data) ? rawData.data : [])
  let products = allProducts.filter(p => p.seller?.id === id || p.sellerId === id)
  
  // Extract seller info from the first matching product
  let sellerInfo = products[0]?.seller || null

  // Fallback / seed profile for demo purposes (e.g. seed-seller-shafransa)
  if (id === "seed-seller-shafransa") {
    sellerInfo = {
      id: "seed-seller-shafransa",
      fullName: "Şafransa Premium Botanics",
      avatar: "https://res.cloudinary.com/deynumlfm/image/upload/v1782116738/plants/d18aee2725054231afa71fe9c40bf30a.webp",
      description: "Şafransa Premium Botanics is a leading clinical-grade grower and supplier of premium organic saffron, therapeutic herbs, and bioactive botanical formulations. We guarantee the highest concentration of active compounds through wildcrafted harvesting and climate-controlled organic farming.",
      createdAt: "2024-01-01T00:00:00.000Z",
    }
    if (products.length === 0) {
      products = MOCK_MARKET_PRODUCTS.map(p => ({
        ...p,
        seller: sellerInfo
      }))
    }
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary opacity-30" />
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('store.loading_profile', 'Loading institutional profile...')}</p>
    </div>
  )

  if ((error && id !== "seed-seller-shafransa") || !sellerInfo) return (
    <div className="text-center py-40 max-w-md mx-auto">
      <Store className="mx-auto h-12 w-12 text-rose-500 mb-4 opacity-50" />
      <p className="font-bold text-rose-500 text-lg">{t('store.not_found', 'Institution Not Found')}</p>
      <Link to="/marketplace" className="text-sm text-primary mt-4 block hover:underline">← {t('store.return_marketplace', 'Return to Marketplace')}</Link>
    </div>
  )

  const seller = {
    id: sellerInfo.id || id,
    fullName: sellerInfo.fullName || sellerInfo.fullname || "Unknown Seller",
    avatar: sellerInfo.avatar || null,
    description: sellerInfo.description || null,
    createdAt: sellerInfo.createdAt || new Date().toISOString(),
  }

  const { isAuthenticated } = useAuthStore()
  const wishlistStore = useWishlistStore()
  const queryClient = useQueryClient()

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
        )}
      </div>
    </div>
  )
}

function ProductCard({ product, isWishlisted, onAddToCart, onWishlist, isAddingToCart, t }) {
  const avgRating = product.avgRating || 0

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="h-full rounded-3xl overflow-hidden border border-neutral-100 bg-white hover:shadow-2xl hover:shadow-black/8 hover:border-primary/20 transition-all duration-500 flex flex-col justify-between">
        
        <div>
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
              <h3 className="font-display font-bold text-sm text-[#1a1c1e] leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {product.title}
              </h3>
              {product.scientificName && (
                <div className="text-xs italic text-muted-foreground mt-0.5">{product.scientificName}</div>
              )}
            </div>

            <StarRating rating={avgRating} count={product._count?.reviews || 0} />

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xl font-display font-bold text-[#1a1c1e]">${product.price}</span>
                {product.originalPrice && (
                  <span className="ml-2 text-xs line-through text-muted-foreground font-medium">${product.originalPrice}</span>
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${product.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                {product.stock > 0 ? t('product.stock_left', '{{count}} left', { count: product.stock }) : t('product.out_of_stock', "Out of stock")}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 pt-0">
          <button
            onClick={(e) => onAddToCart(e, product.id)}
            disabled={isAddingToCart || product.stock === 0}
            className={`w-full h-11 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              product.stock === 0
                ? "bg-neutral-100 text-muted-foreground/50 cursor-not-allowed"
                : "bg-[#1a1c1e] text-white hover:bg-primary shadow-lg shadow-black/10 group-hover:shadow-primary/20"
            }`}
          >
            {product.stock === 0 ? t('product.out_of_stock', "Out of Stock") : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
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
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400 fill-current" : "text-neutral-200 fill-current"}`} />
        ))}
      </div>
      {count > 0 && <span className="text-[10px] font-bold text-muted-foreground/60">({count})</span>}
    </div>
  )
}
