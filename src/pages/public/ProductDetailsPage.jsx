import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { getProductById } from "../../services/product.service"
import { addToCart } from "../../services/cart.service"
import { toggleWishlist } from "../../services/wishlist.service"
import { createReview } from "../../services/review.service"
import { useAuthStore } from "../../store/useAuthStore"
import { useWishlistStore } from "../../store/useWishlistStore"
import { toast } from "../../store/useToastStore"
import { Badge } from "../../components/ui/Badge"
import {
  ShoppingCart, ShieldCheck, Star, ChevronLeft, Loader2, Truck,
  Leaf, Microscope, ArrowRight, CheckCircle2, Package, Heart,
  Share2, Info, RotateCcw, MessageSquare
} from "lucide-react"

export default function ProductDetailsPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const wishlistStore = useWishlistStore()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("Description")
  const [qty, setQty] = useState(1)
  const [mainImage, setMainImage] = useState(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState("")

  const TABS = [
    { id: "Description", label: t('product.tabs.description', 'Description') },
    { id: "Compounds", label: t('product.tabs.compounds', 'Compounds') },
    { id: "Quality", label: t('product.tabs.quality', 'Quality') },
    { id: "Reviews", label: t('product.tabs.reviews', 'Reviews') },
  ]

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    onSuccess: (p) => setMainImage(p.image),
  })

  const isWishlisted = wishlistStore.isInWishlist(id)

  const { mutate: addCartItem, isPending: addingCart } = useMutation({
    mutationFn: () => addToCart(product.id, qty),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"])
      toast.success(t('product.cart.added', '{{title}} added to cart!', { title: product.title }))
    },
    onError: () => toast.error(t('product.cart.error', 'Failed to add to cart')),
  })

  const { mutate: submitReview, isPending: submittingReview } = useMutation({
    mutationFn: () => createReview(id, { rating: reviewRating, text: reviewText }),
    onSuccess: () => {
      queryClient.invalidateQueries(["product", id])
      setReviewText("")
      toast.success(t('product.reviews.success', 'Review submitted! Thank you.'))
    },
    onError: () => toast.error(t('product.reviews.error', 'Failed to submit review')),
  })

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info(t('auth.login_required_cart', 'Please sign in to add items to cart'))
      navigate("/login")
      return
    }
    addCartItem()
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.info(t('auth.login_required', 'Please sign in first'))
      navigate("/login")
      return
    }
    addCartItem()
    navigate("/cart")
  }

  const { mutate: toggleWish } = useMutation({
    mutationFn: () => toggleWishlist(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["wishlist"])
      wishlistStore.toggle(id) 
      if (res.action === "added") toast.success(t('product.wishlist.added', 'Saved to your wishlist'))
      else toast.info(t('product.wishlist.removed', 'Removed from wishlist'))
    },
    onError: () => toast.error(t('product.wishlist.error', 'Failed to update wishlist'))
  })

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.info(t('auth.login_required_save', 'Please sign in to save items'))
      navigate("/login")
      return
    }
    toggleWish()
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success(t('common.link_copied', 'Link copied to clipboard!'))
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary opacity-30" />
    </div>
  )

  const productData = product?.data || product

  if (error || !productData) return (
    <div className="text-center py-40 max-w-md mx-auto">
      <p className="font-bold text-rose-500 text-lg">{t('product.not_found', 'Product not found')}</p>
      <Link to="/marketplace" className="text-sm text-primary mt-4 block hover:underline">← {t('product.back', 'Back to Marketplace')}</Link>
    </div>
  )

  const images = [productData.image, ...(productData.images || [])].filter(Boolean)
  const displayImage = mainImage || productData.image
  const avgRating = productData.avgRating || 0
  const related = productData.related || []
  const reviews = productData.reviews || []

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 lg:px-8">

      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-[#1a1c1e] mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> {t('product.back', 'Back to Marketplace')}
      </button>

      {/* Main Product Section */}
      <div className="grid lg:grid-cols-[1fr_460px] gap-12 mb-16">

        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-[#f5f5f7] rounded-3xl overflow-hidden border border-neutral-100 flex items-center justify-center">
            {product.verified && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-white/95 backdrop-blur-sm text-primary border-primary/20 font-bold px-2.5 py-1 text-[10px]">
                  <ShieldCheck className="w-3 h-3 mr-1" /> {t('product.verified_badge', 'LAB VERIFIED')}
                </Badge>
              </div>
            )}
            {displayImage ? (
              <img src={displayImage} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf className="w-24 h-24 text-primary/10 stroke-1" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-1 px-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all bg-white ${displayImage === img ? "border-primary shadow-lg shadow-primary/10" : "border-transparent hover:border-neutral-200"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info + Sticky Purchase Card */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {productData.category && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 border border-neutral-200 rounded-full px-3 py-1">
                  {productData.category.name}
                </span>
              )}
              {productData.form && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 border border-neutral-200 rounded-full px-3 py-1">
                  {productData.form}
                </span>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-[#1a1c1e] leading-tight">{productData.title}</h1>
            {productData.scientificName && (
              <div className="italic text-lg text-muted-foreground mt-1">{productData.scientificName}</div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? "text-amber-400 fill-current" : "text-neutral-200 fill-current"}`} />
              ))}
            </div>
            <span className="font-bold text-sm text-[#1a1c1e]">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({productData._count?.reviews || 0} {t('product.reviews_count', 'reviews')})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-display font-bold text-[#1a1c1e]">${productData.price}</span>
            {productData.originalPrice && (
              <>
                <span className="text-xl line-through text-muted-foreground">${productData.originalPrice}</span>
                <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-bold">
                  {t('product.discount', 'Save {{percent}}%', { percent: Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100) })}
                </Badge>
              </>
            )}
          </div>

          {/* Seller */}
          <Link to={`/seller/${productData.seller?.id}`} className="flex items-center gap-3 p-4 rounded-2xl border border-neutral-100 hover:border-primary/20 hover:bg-primary/[0.02] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              {productData.seller?.fullName?.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-sm text-[#1a1c1e]">{productData.seller?.fullName}</div>
              <div className="text-xs text-muted-foreground">{t('product.seller_badge', 'Verified Seller → View Storefront')}</div>
            </div>
          </Link>

          {/* Stock */}
          <div className={`flex items-center gap-2 text-sm font-bold ${productData.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
            <div className={`w-2 h-2 rounded-full ${productData.stock > 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
            {productData.stock > 0 ? t('product.stock_status', '{{count}} units in stock', { count: productData.stock }) : t('product.out_of_stock', "Out of stock")}
          </div>

          {/* Qty + Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 font-bold text-muted-foreground hover:bg-neutral-50 transition-colors">−</button>
                <span className="px-5 font-bold text-[#1a1c1e]">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-3 font-bold text-muted-foreground hover:bg-neutral-50 transition-colors">+</button>
              </div>
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-xl border transition-colors ${isWishlisted ? "bg-rose-50 border-rose-100 text-rose-500" : "border-neutral-200 text-muted-foreground hover:border-rose-200 hover:text-rose-500"}`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
              <button onClick={handleShare} className="p-3 rounded-xl border border-neutral-200 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0 || addingCart}
              className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-base shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {addingCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('product.buy_now', 'Buy Now')} <ArrowRight className="w-5 h-5" /></>}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingCart}
              className="w-full h-12 rounded-2xl border-2 border-[#1a1c1e] text-[#1a1c1e] font-bold text-sm hover:bg-[#1a1c1e] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> {t('product.add_to_cart', 'Add to Cart')}
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, label: t('product.trust.shipping', "Free Shipping"), sub: t('product.trust.shipping_sub', "Orders over $50") },
              { icon: RotateCcw, label: t('product.trust.returns', "Easy Returns"), sub: t('product.trust.returns_sub', "30-day policy") },
              { icon: ShieldCheck, label: t('product.trust.lab', "Lab Tested"), sub: t('product.trust.lab_sub', "3rd party verified") },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
                <item.icon className="w-5 h-5 mx-auto mb-1.5 text-primary" />
                <div className="text-xs font-bold text-[#1a1c1e]">{item.label}</div>
                <div className="text-[10px] text-muted-foreground">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="mb-8 border-b border-neutral-100 sticky top-[64px] bg-[#fafafa]/80 backdrop-blur-md z-30 -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="flex gap-1 overflow-x-auto no-scrollbar scrollbar-hide py-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-[#1a1c1e]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Description" && (
        <div className="prose prose-neutral max-w-none">
          <p className="text-muted-foreground text-base leading-relaxed">{productData.description}</p>
          {productData.region && (
            <div className="mt-6 p-5 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{t('product.meta.region', 'Origin Region')}</div>
              <div className="font-bold text-[#1a1c1e]">{productData.region}</div>
            </div>
          )}
        </div>
      )}

      {activeTab === "Compounds" && (
        <div className="space-y-6">
          {productData.activeCompounds ? (
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="flex items-center gap-2 mb-4">
                <Microscope className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-[#1a1c1e]">{t('product.tabs.compounds', 'Active Compounds')}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{productData.activeCompounds}</p>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Microscope className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-bold">{t('product.compounds_pending', 'Compound data pending lab analysis')}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "Quality" && (
        <div className="space-y-4">
          {[
            { label: t('product.meta.batch', "Batch Number"), value: productData.batchNumber || t('common.see_packaging', "See packaging"), icon: Package },
            { label: t('product.meta.form', "Form"), value: productData.form || t('common.raw', "Raw"), icon: Leaf },
            { label: t('product.meta.status', "Verification Status"), value: productData.verified ? t('product.verified_yes', "Lab Verified ✓") : t('product.verified_no', "Standard"), icon: ShieldCheck },
            { label: t('product.meta.origin', "Region of Origin"), value: productData.region || t('common.pending', "Information pending"), icon: Info },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{item.label}</div>
                <div className="font-bold text-[#1a1c1e] mt-0.5">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Reviews" && (
        <div className="space-y-8">
          {/* Review summary */}
          <div className="flex items-center gap-8 p-8 rounded-3xl bg-neutral-50 border border-neutral-100">
            <div className="text-center">
              <div className="text-5xl font-display font-bold text-[#1a1c1e]">{avgRating.toFixed(1)}</div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? "text-amber-400 fill-current" : "text-neutral-200 fill-current"}`} />)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{product._count?.reviews || 0} {t('product.reviews_count', 'reviews')}</div>
            </div>
          </div>

          {/* Review list */}
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-bold">{t('product.reviews.empty', 'No reviews yet. Be the first!')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-6 rounded-2xl bg-white border border-neutral-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {r.user.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#1a1c1e]">{r.user.fullName}</div>
                        <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-amber-400 fill-current" : "text-neutral-200 fill-current"}`} />)}
                    </div>
                  </div>
                  {r.text && <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Write review form */}
          {isAuthenticated && (
            <div className="p-8 rounded-3xl border border-neutral-100 bg-white">
              <h3 className="font-display font-bold text-xl mb-6">{t('product.reviews.write', 'Write a Review')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{t('product.reviews.label_rating', 'Your Rating')}</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setReviewRating(s)}>
                        <Star className={`w-8 h-8 transition-colors ${s <= reviewRating ? "text-amber-400 fill-current" : "text-neutral-200 fill-current hover:text-amber-200"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">{t('product.reviews.label_experience', 'Your Experience')}</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={t('product.reviews.placeholder', "Share your experience with this product...")}
                    rows={4}
                    className="w-full p-4 rounded-2xl border border-neutral-200 text-sm text-[#1a1c1e] bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>
                <button
                  onClick={() => submitReview()}
                  disabled={submittingReview}
                  className="h-12 px-8 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> {t('product.reviews.submit', 'Submit Review')}</>}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-display font-bold text-[#1a1c1e] mb-8">{t('product.related_title', 'Related Products')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group block rounded-3xl overflow-hidden border border-neutral-100 bg-white hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <div className="aspect-square bg-[#f5f5f7] relative">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Leaf className="w-10 h-10 text-primary/10 stroke-1" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-bold text-sm text-[#1a1c1e] line-clamp-2 group-hover:text-primary transition-colors">{p.title}</div>
                  <div className="font-bold text-primary mt-1">${p.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
