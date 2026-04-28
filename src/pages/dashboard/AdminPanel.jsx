import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import api from "../../services/api"
import { getRoleName } from "../../constants/roles"
import { getProducts } from "../../services/product.service"
import { getPlants, createPlant, deletePlant } from "../../services/plant.service"
import { getCategories, createCategory, deleteCategory } from "../../services/category.service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Link } from "react-router-dom"
import {
  Users, Package, Leaf, LayoutGrid, Activity, Zap, Loader2,
  ShieldCheck, Trash2, Plus, Globe, Server, CheckCircle2, ArrowRight, UploadCloud, BookOpen, Eye, EyeOff
} from "lucide-react"
import TranslationTabs from "../../components/shared/TranslationTabs"
import { toast } from "../../store/useToastStore"
import { getBlogs, createBlog, updateBlog, deleteBlog } from "../../services/blog.service"
import { REQUEST_STATUS } from "../../constants/enums"
import { approveRequest, rejectRequest, updateMenuStatus } from "../../services/therapist.service"

const TABS = [
  { id: "overview",   label: "Overview",   icon: Activity },
  { id: "users",      label: "Users",      icon: Users },
  { id: "products",   label: "Products",   icon: Package },
  { id: "plants",     label: "Encyclopedia", icon: Leaf },
  { id: "categories", label: "Categories", icon: LayoutGrid },
  { id: "therapists", label: "Therapists", icon: Users },
  { id: "sessions",   label: "Sessions",   icon: Activity },
  { id: "blogs",      label: "Blogs",      icon: BookOpen },
]

export default function AdminPanel({ tab = "overview" }) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState(tab)
  const [activeLang, setActiveLang] = useState('az')

  // Sync route-provided tab prop
  useEffect(() => setActiveTab(tab), [tab])

  const { data: healthData } = useQuery({
    queryKey: ["health"],
    queryFn: () => api.get("/health"),
  })

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.get("/user"),
    enabled: activeTab === "users" || activeTab === "overview",
  })

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ["products", {}],
    queryFn: () => getProducts({ limit: 100 }),
    enabled: activeTab === "products" || activeTab === "overview",
  })

  const { data: plantsData, isLoading: loadingPlants } = useQuery({
    queryKey: ["plants", {}],
    queryFn: () => getPlants(),
    enabled: activeTab === "plants" || activeTab === "overview",
  })

  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: activeTab === "categories" || activeTab === "overview",
  })

  const { data: therapistRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ["admin", "therapist-requests", "pending"],
    queryFn: () => api.get("/therapists/requests/pending"),
    enabled: activeTab === "therapists"
  })

  const { data: processedRequests, isLoading: loadingProcessed } = useQuery({
    queryKey: ["admin", "therapist-requests", "processed"],
    queryFn: () => api.get("/therapists/requests/processed"),
    enabled: activeTab === "therapists"
  })

  const { data: allTherapists, isLoading: loadingTherapists } = useQuery({
    queryKey: ["admin", "therapists"],
    queryFn: () => api.get("/therapists"),
    enabled: activeTab === "therapists"
  })

  const { data: blogsData, isLoading: loadingBlogs } = useQuery({
    queryKey: ["admin", "blogs"],
    queryFn: () => getBlogs(),
    enabled: activeTab === "blogs"
  })

  const users       = Array.isArray(usersData) ? usersData : []
  const products    = Array.isArray(productsData) ? productsData : (productsData?.data || [])
  const plants      = Array.isArray(plantsData) ? plantsData : (plantsData?.data || [])
  const categories  = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || [])
  const blogs       = Array.isArray(blogsData) ? blogsData : (blogsData?.data || [])
  const isOnline    = healthData?.status === "ok"

  // ── Mutations ──
  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"])
      toast.success(t('admin.products.deleted', 'Product removed.'))
    },
  })

  const { mutate: deletePlantMutation } = useMutation({
    mutationFn: (id) => deletePlant(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["plants", {}])
      toast.success(t('admin.plants.deleted', 'Plant removed.'))
    },
  })

  const { mutate: deleteCategoryMutation } = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"])
      toast.success(t('admin.categories.deleted', 'Category removed.'))
    },
  })

  const { mutate: deleteBlogMutation } = useMutation({
    mutationFn: (id) => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "blogs"])
      toast.success(t('admin.blogs.deleted', 'Article removed.'))
    },
  })

  // Category Form
  const initialCategoryTranslations = {
    az: { name: "", description: "" },
    en: { name: "", description: "" },
    ru: { name: "", description: "" },
    tr: { name: "", description: "" }
  }
  const [catTranslations, setCatTranslations] = useState(initialCategoryTranslations)
  const [catSlug, setCatSlug] = useState("")
  const [catIcon, setCatIcon] = useState(null)
  const [catIconPreview, setCatIconPreview] = useState(null)
  const [catParentId, setCatParentId] = useState("")
  const [editingCategoryId, setEditingCategoryId] = useState(null)

  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat.id)
    setCatSlug(cat.slug || "")
    setCatIconPreview(cat.icon || "")
    setCatParentId(cat.parentId || "")
    
    const newTrans = { ...initialCategoryTranslations }
    cat.translations?.forEach(t => {
      if (newTrans[t.language]) {
        newTrans[t.language] = { ...t }
      }
    })
    setCatTranslations(newTrans)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const { mutate: createCategoryMutation, isPending: creatingCat } = useMutation({
    mutationFn: () => {
      const form = new FormData()
      form.append("slug", catSlug || catTranslations.az.name.toLowerCase().replace(/\s+/g, "-"))
      if (catIcon) form.append("IconFile", catIcon)
      if (catParentId) form.append("ParentId", catParentId)

      const transArray = Object.entries(catTranslations).map(([lang, fields]) => ({
        language: lang,
        ...fields
      })).filter(t => t.name.trim())

      transArray.forEach(tr => {
        form.append("translationJson", JSON.stringify(tr))
      })

      return api.post("/categories", form)
    },
    onSuccess: () => { 
      queryClient.invalidateQueries(["categories"])
      setCatTranslations(initialCategoryTranslations)
      setCatSlug("")
      setCatIcon(null)
      setCatIconPreview(null)
      toast.success(t('admin.categories.created', 'Category created!'))
    },
  })

  const { mutate: updateCategoryMutation, isPending: updatingCat } = useMutation({
    mutationFn: () => {
      const form = new FormData()
      form.append("slug", catSlug)
      if (catIcon) form.append("NewIconFile", catIcon)
      if (catParentId) form.append("ParentId", catParentId)

      const transArray = Object.entries(catTranslations).map(([lang, fields]) => ({
        language: lang,
        ...fields
      })).filter(t => t.name.trim())

      transArray.forEach(tr => {
        form.append("translationJson", JSON.stringify(tr))
      })

      return api.put(`/categories/${editingCategoryId}`, form)
    },
    onSuccess: () => { 
      queryClient.invalidateQueries(["categories"])
      setCatTranslations(initialCategoryTranslations)
      setCatSlug("")
      setCatIcon(null)
      setCatIconPreview(null)
      setEditingCategoryId(null)
      toast.success(t('admin.categories.updated', 'Category updated!'))
    },
  })

  // Plant Form
  const initialPlantTranslations = {
    az: { name: "", localName: "", shortSummary: "", description: "", benefits: "", usage: "", dosage: "", sideEffects: "", contraindications: "", drugInteractions: "", pregnancyWarnings: "", continent: "", country: "", region: "", terroir: "", wildCultivated: "", climate: "", evidenceGrade: "", activeCompounds: "", chemotype: "", usedIn: "", notes: "", generalSafety: "", pregnancy: "", allergy: "", dosageCaution: "", medicalConditions: "", usageForms: [], references: [] },
    en: { name: "", localName: "", shortSummary: "", description: "", benefits: "", usage: "", dosage: "", sideEffects: "", contraindications: "", drugInteractions: "", pregnancyWarnings: "", continent: "", country: "", region: "", terroir: "", wildCultivated: "", climate: "", evidenceGrade: "", activeCompounds: "", chemotype: "", usedIn: "", notes: "", generalSafety: "", pregnancy: "", allergy: "", dosageCaution: "", medicalConditions: "", usageForms: [], references: [] },
    ru: { name: "", localName: "", shortSummary: "", description: "", benefits: "", usage: "", dosage: "", sideEffects: "", contraindications: "", drugInteractions: "", pregnancyWarnings: "", continent: "", country: "", region: "", terroir: "", wildCultivated: "", climate: "", evidenceGrade: "", activeCompounds: "", chemotype: "", usedIn: "", notes: "", generalSafety: "", pregnancy: "", allergy: "", dosageCaution: "", medicalConditions: "", usageForms: [], references: [] },
    tr: { name: "", localName: "", shortSummary: "", description: "", benefits: "", usage: "", dosage: "", sideEffects: "", contraindications: "", drugInteractions: "", pregnancyWarnings: "", continent: "", country: "", region: "", terroir: "", wildCultivated: "", climate: "", evidenceGrade: "", activeCompounds: "", chemotype: "", usedIn: "", notes: "", generalSafety: "", pregnancy: "", allergy: "", dosageCaution: "", medicalConditions: "", usageForms: [], references: [] }
  }
  const [plantTranslations, setPlantTranslations] = useState(initialPlantTranslations)
  const [plantMisc, setPlantMisc] = useState({ scientificName: "", slug: "" })
  const [plantImage, setPlantImage] = useState(null)
  const [plantGallery, setPlantGallery] = useState([])
  const [plantPreviews, setPlantPreviews] = useState({ main: null, gallery: [] })
  const [editingPlantId, setEditingPlantId] = useState(null)

  const handleEditPlant = (plant) => {
    setEditingPlantId(plant.id)
    setPlantMisc({
      scientificName: plant.scientificName || "",
      slug: plant.slug || ""
    })
    setPlantPreviews({ main: plant.image, gallery: plant.gallery || [] })
    
    // Create new translations object from existing data
    const newTrans = { ...initialPlantTranslations }
    plant.translations?.forEach(t => {
      if (newTrans[t.language]) {
        newTrans[t.language] = { ...t }
      }
    })
    setPlantTranslations(newTrans)
    
    // Scroll to form
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const { mutate: createPlantMutation, isPending: creatingPlant } = useMutation({
    mutationFn: () => {
      const form = new FormData()
      form.append("scientificName", plantMisc.scientificName || "")
      if (plantMisc.slug) form.append("slug", plantMisc.slug)
      
      if (plantImage) form.append("ImageFile", plantImage)
      
      plantGallery.forEach(file => {
        form.append("GalleryFiles", file)
      })

      const transArray = Object.entries(plantTranslations).map(([lang, fields]) => ({
        language: lang,
        ...fields
      })).filter(t => t.name.trim())

      transArray.forEach(tr => {
        form.append("translationJson", JSON.stringify(tr))
      })

      return api.post("/plants", form)
    },
    onSuccess: () => { 
      queryClient.invalidateQueries(["plants", {}])
      setPlantTranslations(initialPlantTranslations)
      setPlantMisc({ scientificName: "" })
      setPlantImage(null)
      setPlantGallery([])
      setPlantPreviews({ main: null, gallery: [] })
      toast.success(t('admin.plants.created', 'Plant entry created!'))
    },
  })

  const { mutate: updatePlantMutation, isPending: updatingPlant } = useMutation({
    mutationFn: () => {
      const form = new FormData()
      form.append("scientificName", plantMisc.scientificName || "")
      if (plantMisc.slug) form.append("slug", plantMisc.slug)
      
      if (plantImage) form.append("NewImageFile", plantImage)
      
      plantGallery.forEach(file => {
        form.append("NewGalleryFiles", file)
      })

      const transArray = Object.entries(plantTranslations).map(([lang, fields]) => ({
        language: lang,
        ...fields
      })).filter(t => t.name.trim())

      transArray.forEach(tr => {
        form.append("translationJson", JSON.stringify(tr))
      })

      return api.put(`/plants/${editingPlantId}`, form)
    },
    onSuccess: () => { 
      queryClient.invalidateQueries(["plants", {}])
      setPlantTranslations(initialPlantTranslations)
      setPlantMisc({ scientificName: "" })
      setPlantImage(null)
      setPlantGallery([])
      setPlantPreviews({ main: null, gallery: [] })
      setEditingPlantId(null)
      toast.success(t('admin.plants.updated', 'Plant entry updated!'))
    },
  })

  // Blog Form
  const initialBlogTranslations = {
    az: { title: "", description: "" },
    en: { title: "", description: "" },
    tr: { title: "", description: "" },
    ru: { title: "", description: "" },
  }
  const [blogTranslations, setBlogTranslations] = useState(initialBlogTranslations)
  const [blogMisc, setBlogMisc] = useState({ author: "", videoUrl: "" })
  const [blogGallery, setBlogGallery] = useState([])
  const [blogGalleryPreviews, setBlogGalleryPreviews] = useState([])
  const [editingBlogId, setEditingBlogId] = useState(null)

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog.id)
    setBlogMisc({
      author: blog.author || "",
      videoUrl: blog.videoUrl || ""
    })
    setBlogGalleryPreviews(blog.gallery || [])
    
    const newTrans = { ...initialBlogTranslations }
    blog.translations?.forEach(t => {
      if (newTrans[t.language]) {
        newTrans[t.language] = { ...t }
      }
    })
    setBlogTranslations(newTrans)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const { mutate: createBlogMutation, isPending: creatingBlog } = useMutation({
    mutationFn: () => {
      const form = new FormData()
      form.append("Author", blogMisc.author)
      form.append("VideoUrl", blogMisc.videoUrl || "")

      blogGallery.forEach(file => {
        form.append("GalleryFiles", file)
      })

      const transArray = Object.entries(blogTranslations).map(([lang, fields]) => ({
        language: lang,
        ...fields
      })).filter(t => t.title.trim())

      transArray.forEach(tr => {
        form.append("translationJson", JSON.stringify(tr))
      })

      return api.post("/blogs", form)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "blogs"])
      setBlogTranslations(initialBlogTranslations)
      setBlogMisc({ author: "", videoUrl: "" })
      setBlogGallery([])
      setBlogGalleryPreviews([])
      toast.success(t('admin.blogs.created', 'Article published!'))
    }
  })

  const { mutate: updateBlogMutation, isPending: updatingBlog } = useMutation({
    mutationFn: () => {
      const form = new FormData()
      form.append("Author", blogMisc.author)
      form.append("VideoUrl", blogMisc.videoUrl || "")

      blogGallery.forEach(file => {
        form.append("NewGalleryFiles", file)
      })

      const transArray = Object.entries(blogTranslations).map(([lang, fields]) => ({
        language: lang,
        ...fields
      })).filter(t => t.title.trim())

      transArray.forEach(tr => {
        form.append("translationJson", JSON.stringify(tr))
      })

      return api.put(`/blogs/${editingBlogId}`, form)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "blogs"])
      setEditingBlogId(null)
      setBlogTranslations(initialBlogTranslations)
      setBlogMisc({ author: "", videoUrl: "" })
      setBlogGallery([])
      setBlogGalleryPreviews([])
      toast.success(t('admin.blogs.updated', 'Article updated!'))
    }
  })

  const requests = Array.isArray(therapistRequests) ? therapistRequests : (therapistRequests?.data || [])
  const processed = Array.isArray(processedRequests) ? processedRequests : (processedRequests?.data || [])
  const therapists = Array.isArray(allTherapists) ? allTherapists : (allTherapists?.data || [])

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
      <header className="border-b border-white/5 pb-8">
        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold uppercase tracking-widest text-[10px] px-3 mb-3">
          {t('admin.badge', 'Admin — Root Access')}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
          {t('admin.title', 'Command Center')}
        </h1>
        <p className="text-white/40 font-medium mt-1">
          {t('admin.subtitle', 'Manage users, products, encyclopedia, and categories.')}
        </p>
      </header>

      <div className="flex gap-1 overflow-x-auto border-b border-white/5 pb-0">
        {TABS.map((t_item) => (
          <button
            key={t_item.id}
            onClick={() => setActiveTab(t_item.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === t_item.id ? "border-rose-500 text-white" : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            <t_item.icon className="w-4 h-4" />
            {t(activeTab === t_item.id ? `admin.tabs.${t_item.id}` : `admin.tabs.${t_item.id}`, t_item.label)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8 text-white">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t('admin.overview.users', "Total Users"),    value: users.length, icon: Users,   color: "text-blue-400" },
              { label: t('admin.overview.products', "Products"),       value: products.length, icon: Package, color: "text-emerald-400" },
              { label: t('admin.overview.plants', "Encyclopedia"),   value: plants.length, icon: Leaf,    color: "text-teal-400" },
              { label: t('admin.overview.status', "System"),         value: isOnline ? t('admin.status.online', "Online") : t('admin.status.offline', "Offline"), icon: Server, color: isOnline ? "text-emerald-400" : "text-rose-400" },
            ].map((s) => (
              <Card key={s.label} className="bg-white/5 border-white/5 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{s.label}</span>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="text-4xl font-display font-bold text-white">{s.value}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <Card className="bg-[#09090b] border-white/5">
          <CardHeader className="p-8 border-b border-white/5">
            <CardTitle className="text-xl font-display font-bold text-white">{t('admin.users.list', 'Global User Directory')}</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {loadingUsers ? (
              <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-white/20" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="text-[10px] font-bold uppercase tracking-widest text-white/30 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">{t('admin.users.name', 'Full Name')}</th>
                      <th className="px-6 py-4">{t('admin.users.email', 'Email')}</th>
                      <th className="px-6 py-4">{t('admin.users.role', 'Role')}</th>
                      <th className="px-6 py-4 text-right">{t('admin.users.actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5 font-bold text-white whitespace-nowrap">{u.fullName}</td>
                        <td className="px-6 py-5 text-white/40">{u.email}</td>
                        <td className="px-6 py-5">
                          {(() => {
                            const roleStr = getRoleName(u.role);
                            return (
                              <Badge className={`${roleStr === 'ADMIN' || roleStr === 'EDITOR' ? 'bg-rose-500/10 text-rose-500' : roleStr === 'SELLER' ? 'bg-blue-500/10 text-blue-500' : 'bg-white/5 text-white/60'} border-none font-bold text-[9px] px-2 py-0`}>
                                {roleStr}
                              </Badge>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 opacity-20 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "products" && (
        <Card className="bg-[#09090b] border-white/5">
          <CardHeader className="p-8 border-b border-white/5">
            <CardTitle className="text-xl font-display font-bold text-white">{t('admin.products.list', 'Global Inventory Ledger')}</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {loadingProducts ? (
              <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-white/20" /></div>
            ) : (
              <div className="grid gap-4">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                        {p.image && <img src={p.image} className="w-full h-full object-cover" alt="" />}
                      </div>
                      <div>
                        <div className="font-bold text-white">{p.title}</div>
                        <div className="text-xs text-white/30 mt-0.5">{p.seller?.fullName} • ${p.price}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link to={`/product/${p.id}`} target="_blank" className="p-2 rounded-lg hover:bg-white/10 text-white/40">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteProductMutation(p.id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "plants" && (
        <div className="space-y-8">
          <Card className="bg-[#09090b] border-white/5">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" /> {t('admin.plants.add', 'Add Encyclopedia Entry')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TranslationTabs activeLang={activeLang} onLangChange={setActiveLang}>
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <Input
                    placeholder={t('admin.plants.placeholder_name', "Common Name")}
                    value={plantTranslations[activeLang].name}
                    onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], name: e.target.value } })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <Input
                    placeholder={t('admin.plants.placeholder_local', "Local Name")}
                    value={plantTranslations[activeLang].localName}
                    onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], localName: e.target.value } })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <Input
                    placeholder={t('admin.plants.placeholder_summary', "Short Summary")}
                    value={plantTranslations[activeLang].shortSummary}
                    onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], shortSummary: e.target.value } })}
                    className="bg-white/5 border-white/10 text-white md:col-span-2"
                  />
                  <textarea
                    placeholder={t('admin.plants.placeholder_description', "Detailed Description")}
                    value={plantTranslations[activeLang].description}
                    onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], description: e.target.value } })}
                    className="w-full min-h-[120px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none md:col-span-2"
                  />

                  {/* Medical & Safety */}
                  <div className="md:col-span-2 grid md:grid-cols-2 gap-4 mt-4 border-t border-white/5 pt-6">
                    <h3 className="md:col-span-2 text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">{t('admin.plants.sections.medical', 'Medical & Safety')}</h3>
                    <textarea
                      placeholder={t('admin.plants.placeholder_benefits', "Benefits")}
                      value={plantTranslations[activeLang].benefits}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], benefits: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />
                    <textarea
                      placeholder={t('admin.plants.placeholder_usage', "Usage Instructions")}
                      value={plantTranslations[activeLang].usage}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], usage: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />
                    <Input
                      placeholder={t('admin.plants.placeholder_dosage', "Recommended Dosage")}
                      value={plantTranslations[activeLang].dosage}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], dosage: e.target.value } })}
                      className="bg-white/5 border-white/10 text-white h-11"
                    />
                    <Input
                      placeholder={t('admin.plants.placeholder_side_effects', "Side Effects")}
                      value={plantTranslations[activeLang].sideEffects}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], sideEffects: e.target.value } })}
                      className="bg-white/5 border-white/10 text-white h-11"
                    />
                    <textarea
                      placeholder={t('admin.plants.placeholder_contraindications', "Contraindications")}
                      value={plantTranslations[activeLang].contraindications}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], contraindications: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />
                    <textarea
                      placeholder={t('admin.plants.placeholder_drug_interactions', "Drug Interactions")}
                      value={plantTranslations[activeLang].drugInteractions}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], drugInteractions: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />
                    <textarea
                      placeholder={t('admin.plants.placeholder_safety', "General Safety")}
                      value={plantTranslations[activeLang].generalSafety}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], generalSafety: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />
                    <textarea
                      placeholder={t('admin.plants.placeholder_pregnancy', "Pregnancy Warnings (Clinical)")}
                      value={plantTranslations[activeLang].pregnancy}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], pregnancy: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />
                    <textarea
                      placeholder={t('admin.plants.placeholder_pregnancy_warnings', "Additional Pregnancy Alerts")}
                      value={plantTranslations[activeLang].pregnancyWarnings}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], pregnancyWarnings: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />
                    <textarea
                      placeholder={t('admin.plants.placeholder_allergy', "Allergy Warnings")}
                      value={plantTranslations[activeLang].allergy}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], allergy: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />
                    <textarea
                      placeholder={t('admin.plants.placeholder_dosage_caution', "Dosage Caution / Overdose")}
                      value={plantTranslations[activeLang].dosageCaution}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], dosageCaution: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />
                    <textarea
                      placeholder={t('admin.plants.placeholder_medical_conditions', "Medical Conditions to Avoid")}
                      value={plantTranslations[activeLang].medicalConditions}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], medicalConditions: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />
                    <textarea
                      placeholder={t('admin.plants.placeholder_used_in', "Used In (Traditional Medicine)")}
                      value={plantTranslations[activeLang].usedIn}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], usedIn: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />
                    <textarea
                      placeholder={t('admin.plants.placeholder_notes', "Expert Notes")}
                      value={plantTranslations[activeLang].notes}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], notes: e.target.value } })}
                      className="w-full min-h-[80px] p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-teal-500/50 outline-none"
                    />

                    {/* Usage Forms */}
                    <div className="md:col-span-2 mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-teal-400">{t('admin.plants.sections.usage_forms', 'Usage Forms')}</h3>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            const newForms = [...(plantTranslations[activeLang].usageForms || []), { name: "", description: "" }]
                            setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], usageForms: newForms } })
                          }}
                          className="bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 h-8"
                        >
                          <Plus className="w-3 h-3 mr-1" /> {t('common.add', 'Add')}
                        </Button>
                      </div>
                      {(plantTranslations[activeLang].usageForms || []).map((form, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_2fr_auto] gap-3 items-start p-4 rounded-xl bg-white/5 border border-white/5">
                          <Input 
                            placeholder="Name (e.g. Tincture)" 
                            value={form.name} 
                            onChange={(e) => {
                              const newForms = [...plantTranslations[activeLang].usageForms]
                              newForms[idx].name = e.target.value
                              setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], usageForms: newForms } })
                            }}
                            className="bg-white/5 border-white/10 text-white"
                          />
                          <textarea 
                            placeholder="Usage instructions..." 
                            value={form.description} 
                            onChange={(e) => {
                              const newForms = [...plantTranslations[activeLang].usageForms]
                              newForms[idx].description = e.target.value
                              setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], usageForms: newForms } })
                            }}
                            className="w-full min-h-[40px] p-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none"
                          />
                          <button 
                            onClick={() => {
                              const newForms = plantTranslations[activeLang].usageForms.filter((_, i) => i !== idx)
                              setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], usageForms: newForms } })
                            }}
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* References */}
                    <div className="md:col-span-2 mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-teal-400">{t('admin.plants.sections.references', 'Scientific References')}</h3>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            const newRefs = [...(plantTranslations[activeLang].references || []), { description: "", link: "" }]
                            setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], references: newRefs } })
                          }}
                          className="bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 h-8"
                        >
                          <Plus className="w-3 h-3 mr-1" /> {t('common.add', 'Add')}
                        </Button>
                      </div>
                      {(plantTranslations[activeLang].references || []).map((ref, idx) => (
                        <div key={idx} className="grid grid-cols-[2fr_1fr_auto] gap-3 items-start p-4 rounded-xl bg-white/5 border border-white/5">
                          <textarea 
                            placeholder="Journal description..." 
                            value={ref.description} 
                            onChange={(e) => {
                              const newRefs = [...plantTranslations[activeLang].references]
                              newRefs[idx].description = e.target.value
                              setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], references: newRefs } })
                            }}
                            className="w-full min-h-[40px] p-3 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none"
                          />
                          <Input 
                            placeholder="URL (optional)" 
                            value={ref.link} 
                            onChange={(e) => {
                              const newRefs = [...plantTranslations[activeLang].references]
                              newRefs[idx].link = e.target.value
                              setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], references: newRefs } })
                            }}
                            className="bg-white/5 border-white/10 text-white"
                          />
                          <button 
                            onClick={() => {
                              const newRefs = plantTranslations[activeLang].references.filter((_, i) => i !== idx)
                              setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], references: newRefs } })
                            }}
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Habitat & Scientific */}
                  <div className="md:col-span-2 grid md:grid-cols-2 gap-4 mt-4 border-t border-white/5 pt-6">
                    <h3 className="md:col-span-2 text-xs font-bold uppercase tracking-widest text-teal-400 mb-2">{t('admin.plants.sections.habitat', 'Habitat & Scientific')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder={t('admin.plants.placeholder_country', "Country")}
                        value={plantTranslations[activeLang].country}
                        onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], country: e.target.value } })}
                        className="bg-white/5 border-white/10 text-white h-11"
                      />
                      <Input
                        placeholder={t('admin.plants.placeholder_region', "Region")}
                        value={plantTranslations[activeLang].region}
                        onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], region: e.target.value } })}
                        className="bg-white/5 border-white/10 text-white h-11"
                      />
                    </div>
                    <Input
                      placeholder={t('admin.plants.placeholder_climate', "Climate")}
                      value={plantTranslations[activeLang].climate}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], climate: e.target.value } })}
                      className="bg-white/5 border-white/10 text-white h-11"
                    />
                    <Input
                      placeholder={t('admin.plants.placeholder_active_compounds', "Active Compounds")}
                      value={plantTranslations[activeLang].activeCompounds}
                      onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], activeCompounds: e.target.value } })}
                      className="bg-white/5 border-white/10 text-white h-11"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder={t('admin.plants.placeholder_continent', "Continent")}
                        value={plantTranslations[activeLang].continent}
                        onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], continent: e.target.value } })}
                        className="bg-white/5 border-white/10 text-white h-11"
                      />
                      <Input
                        placeholder={t('admin.plants.placeholder_evidence', "Evidence Grade")}
                        value={plantTranslations[activeLang].evidenceGrade}
                        onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], evidenceGrade: e.target.value } })}
                        className="bg-white/5 border-white/10 text-white h-11"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        placeholder={t('admin.plants.placeholder_terroir', "Terroir")}
                        value={plantTranslations[activeLang].terroir}
                        onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], terroir: e.target.value } })}
                        className="bg-white/5 border-white/10 text-white h-11"
                      />
                      <Input
                        placeholder={t('admin.plants.placeholder_cultivation', "Cultivation")}
                        value={plantTranslations[activeLang].wildCultivated}
                        onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], wildCultivated: e.target.value } })}
                        className="bg-white/5 border-white/10 text-white h-11"
                      />
                      <Input
                        placeholder={t('admin.plants.placeholder_chemotype', "Chemotype")}
                        value={plantTranslations[activeLang].chemotype}
                        onChange={(e) => setPlantTranslations({ ...plantTranslations, [activeLang]: { ...plantTranslations[activeLang], chemotype: e.target.value } })}
                        className="bg-white/5 border-white/10 text-white h-11"
                      />
                    </div>
                  </div>
                </div>
              </TranslationTabs>
              
              <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/5">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t('admin.plants.scientific', "Scientific Name")}</label>
                      <Input
                        placeholder="e.g. Crocus sativus"
                        value={plantMisc.scientificName}
                        onChange={(e) => setPlantMisc({ ...plantMisc, scientificName: e.target.value })}
                        className="bg-white/5 border-white/10 text-white h-11 italic"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t('admin.plants.slug', "URL Slug")}</label>
                      <Input
                        placeholder="e.g. crocus-sativus"
                        value={plantMisc.slug}
                        onChange={(e) => setPlantMisc({ ...plantMisc, slug: e.target.value })}
                        className="bg-white/5 border-white/10 text-white h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t('admin.plants.main_image', 'Central Specimen Media')}</label>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                          {plantPreviews.main ? <img src={plantPreviews.main} className="w-full h-full object-cover" /> : <UploadCloud className="w-5 h-5 text-white/10" />}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setPlantImage(file);
                              setPlantPreviews(prev => ({ ...prev, main: URL.createObjectURL(file) }));
                            }
                          }}
                          className="bg-white/5 border-white/10 text-white h-11 cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t('admin.plants.field_gallery', 'Habitat Gallery')}</label>
                      <div className="flex flex-wrap gap-2">
                         {plantPreviews.gallery.map((img, i) => (
                           <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                              <img src={img} className="w-full h-full object-cover" />
                           </div>
                         ))}
                         <label className="w-10 h-10 rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10">
                            <Plus className="w-4 h-4 text-white/20" />
                            <input 
                              type="file" 
                              multiple 
                              className="hidden" 
                              onChange={(e) => {
                                const files = Array.from(e.target.files || [])
                                setPlantGallery(prev => [...prev, ...files])
                                setPlantPreviews(prev => ({ 
                                  ...prev, 
                                  gallery: [...prev.gallery, ...files.map(f => URL.createObjectURL(f))] 
                                }))
                              }}
                            />
                         </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {editingPlantId && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingPlantId(null)
                          setPlantTranslations(initialPlantTranslations)
                          setPlantMisc({ scientificName: "" })
                          setPlantImage(null)
                          setPlantPreviews({ main: null, gallery: [] })
                        }}
                        className="flex-1 border-white/10 text-white hover:bg-white/5 h-11"
                      >
                        {t('common.cancel', 'Cancel')}
                      </Button>
                    )}
                    <Button
                      onClick={() => editingPlantId ? updatePlantMutation() : createPlantMutation()}
                      disabled={!plantTranslations.az.name || creatingPlant || updatingPlant}
                      className="flex-[2] bg-teal-500 text-white font-bold hover:bg-teal-600 h-11"
                    >
                      {creatingPlant || updatingPlant ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingPlantId ? t('common.save', 'Save Changes') : t('common.add', 'Add'))}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#09090b] border-white/5">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-display font-bold text-white">{t('admin.plants.list', 'Encyclopedia Entries')}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {loadingPlants ? (
                <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-white/20" /></div>
              ) : plants.length === 0 ? (
                <p className="text-center text-white/30 py-16 font-bold">{t('admin.plants.empty', 'No entries found.')}</p>
              ) : (
                <div className="grid gap-3">
                  {plants.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/20 transition-colors">
                      <div>
                        <div className="font-bold text-white">{p.name}</div>
                        {p.scientificName && <div className="text-xs italic text-white/40 mt-0.5">{p.scientificName}</div>}
                      </div>
                      <div className="flex items-center gap-3">
                        <Link to={`/herb/${p.id}`} className="p-2 rounded-lg hover:bg-teal-500/10 text-teal-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleEditPlant(p)} className="p-2 rounded-lg hover:bg-white/10 text-white/50">
                          <Globe className="w-4 h-4" />
                        </button>
                        <button onClick={() => deletePlantMutation(p.id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="space-y-8">
          <Card className="bg-[#09090b] border-white/5">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" /> {t('admin.categories.create', 'Create Category')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TranslationTabs activeLang={activeLang} onLangChange={setActiveLang}>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-4">
                      <Input
                        placeholder={t('admin.categories.placeholder_name', "Category Name")}
                        value={catTranslations[activeLang].name}
                        onChange={(e) => setCatTranslations({ ...catTranslations, [activeLang]: { ...catTranslations[activeLang], name: e.target.value } })}
                        className="bg-white/5 border-white/10 text-white h-11"
                      />
                      <textarea
                        placeholder={t('admin.categories.placeholder_desc', "Category Description")}
                        value={catTranslations[activeLang].description}
                        onChange={(e) => setCatTranslations({ ...catTranslations, [activeLang]: { ...catTranslations[activeLang], description: e.target.value } })}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 text-sm min-h-[80px] focus:ring-1 focus:ring-blue-500/50 outline-none"
                      />
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {catIconPreview ? <img src={catIconPreview} className="w-full h-full object-cover" /> : <LayoutGrid className="w-5 h-5 text-white/10" />}
                    </div>
                    <label className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-white/40 cursor-pointer hover:bg-white/10 transition-colors">
                      {t('common.upload', 'Upload Icon')}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCatIcon(file);
                            setCatIconPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>
              </TranslationTabs>
              
              <div className="flex gap-4 mt-6 pt-6 border-t border-white/5">
                <Input
                  placeholder="Slug (optional)"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="bg-white/5 border-white/10 text-white max-w-xs"
                />
                <select 
                  value={catParentId}
                  onChange={(e) => setCatParentId(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white/60 h-11 px-4 rounded-xl text-sm focus:bg-[#09090b] outline-none"
                >
                  <option value="">{t('admin.categories.no_parent', '-- No Parent --')}</option>
                  {categories.filter(c => c.id !== editingCategoryId && !c.parentId).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="flex gap-2 w-full">
                  {editingCategoryId && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingCategoryId(null)
                        setCatTranslations(initialCategoryTranslations)
                        setCatSlug("")
                        setCatIcon(null)
                        setCatIconPreview(null)
                        setCatParentId("")
                      }}
                      className="flex-1 border-white/10 text-white hover:bg-white/5 h-11"
                    >
                      {t('common.cancel', 'Cancel')}
                    </Button>
                  )}
                  <Button
                    onClick={() => editingCategoryId ? updateCategoryMutation() : createCategoryMutation()}
                    disabled={!catTranslations.az.name || creatingCat || updatingCat}
                    className="flex-[2] bg-blue-500 text-white font-bold hover:bg-blue-600 h-11 px-8"
                  >
                    {creatingCat || updatingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingCategoryId ? t('common.save', 'Save Changes') : t('common.create', 'Create'))}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#09090b] border-white/5">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-display font-bold text-white">{t('admin.categories.list', 'Category Bank')}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {loadingCategories ? (
                <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-white/20" /></div>
              ) : categories.length === 0 ? (
                <p className="text-center text-white/30 py-16 font-bold">{t('admin.categories.empty', 'No categories found.')}</p>
              ) : (
                <div className="grid gap-3">
                  {categories.map((c) => (
                    <div key={c.id} className="space-y-3">
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/20 transition-colors">
                        <div>
                          <div className="font-bold text-white uppercase tracking-wider text-sm">{c.name}</div>
                          <div className="text-[10px] text-white/30 mt-1 font-mono">{c.slug}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleEditCategory(c)} className="p-2 rounded-lg hover:bg-white/10 text-white/50">
                            <Globe className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteCategoryMutation(c.id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* Children */}
                      {c.children && c.children.length > 0 && (
                        <div className="pl-6 grid gap-2 border-l border-white/5 ml-5">
                          {c.children.map(child => (
                            <div key={child.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5">
                              <div className="text-sm text-white/60">{child.name}</div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleEditCategory(child)} className="p-1.5 rounded-md hover:bg-white/10 text-white/30">
                                  <Globe className="w-3 h-3" />
                                </button>
                                <button onClick={() => deleteCategoryMutation(child.id)} className="p-1.5 rounded-md hover:bg-rose-500/10 text-rose-400">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {activeTab === "therapists" && (
        <div className="space-y-8">
           <Card className="bg-[#09090b] border-white/5">
              <CardHeader className="p-8 border-b border-white/5">
                 <CardTitle className="text-xl font-display font-bold text-white">{t('admin.therapists.requests', 'Therapist Verification Requests')}</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                 {loadingRequests ? (
                   <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-white/20" /></div>
                 ) : !requests || requests.length === 0 ? (
                   <p className="text-center text-white/30 py-16 font-bold">{t('admin.therapists.no_requests', 'No pending requests.')}</p>
                 ) : (
                   <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left border-collapse">
                         <thead className="text-[10px] font-bold uppercase tracking-widest text-white/30 border-b border-white/5">
                            <tr>
                               <th className="px-6 py-4">Therapist</th>
                               <th className="px-6 py-4">Specialization</th>
                               <th className="px-6 py-4">License</th>
                               <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/[0.02]">
                            {requests.map((req) => (
                               <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                                  <td className="px-6 py-5">
                                     <div className="font-bold text-white">{req.therapist?.user?.fullName || "No Name"}</div>
                                     <div className="text-[10px] text-white/30">{req.therapist?.phoneNumber || req.therapist?.email}</div>
                                  </td>
                                  <td className="px-6 py-5 text-white/60">{req.therapist?.specialization || "-"}</td>
                                  <td className="px-6 py-5 text-white/60">{req.therapist?.licenseNumber || "N/A"}</td>
                                  <td className="px-6 py-5 text-right">
                                     <div className="flex justify-end gap-2">
                                        <Button 
                                           size="sm" 
                                           className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                           onClick={async () => {
                                              await api.post(`/therapists/requests/${req.id}/approve`)
                                              queryClient.invalidateQueries(["admin", "therapist-requests"])
                                              queryClient.invalidateQueries(["admin", "therapists"])
                                              toast.success("Therapist approved!")
                                           }}
                                        >
                                           Approve
                                        </Button>
                                        <Button 
                                           size="sm" 
                                           variant="destructive"
                                           onClick={async () => {
                                              const reason = prompt("Enter rejection reason:")
                                              if (reason) {
                                                 await api.post(`/therapists/requests/${req.id}/reject`, { reason })
                                                 queryClient.invalidateQueries(["admin", "therapist-requests"])
                                                 toast.info("Request rejected.")
                                              }
                                           }}
                                        >
                                           Reject
                                        </Button>
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                 )}
              </CardContent>
           </Card>

           <Card className="bg-[#09090b] border-white/5">
              <CardHeader className="p-8 border-b border-white/5">
                 <CardTitle className="text-xl font-display font-bold text-white">{t('admin.therapists.list', 'Verified Therapists')}</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                 {loadingTherapists ? (
                   <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-white/20" /></div>
                 ) : !therapists || therapists.length === 0 ? (
                   <p className="text-center text-white/30 py-16 font-bold">{t('admin.therapists.no_therapists', 'No therapists found.')}</p>
                 ) : (
                   <div className="grid gap-4">
                      {therapists.map((therapist) => (
                        <div key={therapist.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                                 {therapist.user?.avatar && <img src={therapist.user.avatar} className="w-full h-full object-cover" alt="" />}
                              </div>
                              <div>
                                 <div className="font-bold text-white">{therapist.user?.fullName}</div>
                                 <div className="text-xs text-white/30 mt-0.5">{therapist.specialization || "General"} • {therapist.rating || 0} ⭐</div>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <button 
                                onClick={async () => {
                                   await api.put(`/therapists/${therapist.id}/menu-status`, { isShowMenu: !therapist.isShowMenu })
                                   queryClient.invalidateQueries(["admin", "therapists"])
                                   toast.success("Menu status updated!")
                                }}
                                className={`p-2 rounded-lg transition-colors ${therapist.isShowMenu ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-white/20'}`}
                                title={therapist.isShowMenu ? "Visible in Menu" : "Hidden from Menu"}
                              >
                                 {therapist.isShowMenu ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                              <Badge className={`${therapist.isVerified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'} border-none font-bold text-[9px]`}>
                                 {therapist.isVerified ? "VERIFIED" : "PENDING"}
                              </Badge>
                              <button className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400">
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </CardContent>
           </Card>
        </div>
      )}

      {activeTab === "sessions" && (
        <Card className="bg-[#09090b] border-white/5">
           <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-display font-bold text-white">Institutional Session Ledger</CardTitle>
              <CardDescription className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Global appointment tracking</CardDescription>
           </CardHeader>
           <CardContent className="p-8">
              <div className="text-center py-20">
                 <Activity className="h-10 w-10 text-white/10 mx-auto mb-4" />
                 <p className="text-white/30 font-bold">Session management is restricted to authorized clinicians.</p>
                 <p className="text-[10px] uppercase tracking-widest text-white/20 mt-2">Access Point: Private Therapist Dashboard</p>
              </div>
           </CardContent>
        </Card>
      )}
      {activeTab === "blogs" && (
        <div className="space-y-8">
          <Card className="bg-[#09090b] border-white/5">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> {editingBlogId ? t('admin.blogs.edit', 'Edit Article') : t('admin.blogs.create', 'Draft New Article')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <TranslationTabs activeLang={activeLang} onLangChange={setActiveLang}>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t('admin.blogs.field_title', 'Article Title')}</label>
                        <Input
                          placeholder="Nature's Pharmacy..."
                          value={blogTranslations[activeLang].title}
                          onChange={(e) => setBlogTranslations({
                            ...blogTranslations,
                            [activeLang]: { ...blogTranslations[activeLang], title: e.target.value }
                          })}
                          className="bg-white/5 border-white/10 text-white h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t('admin.blogs.field_description', 'Description / Content')}</label>
                        <textarea
                          placeholder="Article content..."
                          value={blogTranslations[activeLang].description}
                          onChange={(e) => setBlogTranslations({
                            ...blogTranslations,
                            [activeLang]: { ...blogTranslations[activeLang], description: e.target.value }
                          })}
                          className="w-full min-h-[300px] p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:ring-1 focus:ring-primary/50 outline-none"
                        />
                      </div>
                    </div>
                  </TranslationTabs>
                </div>

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t('admin.blogs.field_author', 'Author')}</label>
                      <Input
                        placeholder="Dr. Zakir Aliyev"
                        value={blogMisc.author}
                        onChange={(e) => setBlogMisc({ ...blogMisc, author: e.target.value })}
                        className="bg-white/5 border-white/10 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t('admin.blogs.field_video', 'Video URL')}</label>
                      <Input
                        placeholder="https://youtube.com/..."
                        value={blogMisc.videoUrl}
                        onChange={(e) => setBlogMisc({ ...blogMisc, videoUrl: e.target.value })}
                        className="bg-white/5 border-white/10 text-white h-12"
                      />
                    </div>
                  </div>


                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{t('admin.blogs.field_gallery', 'Gallery Images')}</label>
                    <div className="grid grid-cols-4 gap-2">
                      {blogGalleryPreviews.map((p, i) => (
                        <div key={i} className="aspect-square rounded-lg bg-white/5 border border-white/10 overflow-hidden relative group">
                          <img src={typeof p === 'string' ? p : URL.createObjectURL(p)} className="w-full h-full object-cover" alt="" />
                          <button 
                            onClick={() => {
                              const newG = [...blogGallery]
                              const newP = [...blogGalleryPreviews]
                              newG.splice(i, 1)
                              newP.splice(i, 1)
                              setBlogGallery(newG)
                              setBlogGalleryPreviews(newP)
                            }}
                            className="absolute inset-0 bg-rose-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-lg bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                        <Plus className="w-4 h-4 text-white/20" />
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setBlogGallery([...blogGallery, ...files]);
                            setBlogGalleryPreviews([...blogGalleryPreviews, ...files]);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    {editingBlogId && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingBlogId(null)
                          setBlogTranslations(initialBlogTranslations)
                          setBlogMisc({ author: "", videoUrl: "" })
                          setBlogGallery([])
                          setBlogGalleryPreviews([])
                        }}
                        className="flex-1 border-white/10 text-white hover:bg-white/5 h-12"
                      >
                        {t('common.cancel', 'Cancel')}
                      </Button>
                    )}
                    <Button
                      onClick={() => editingBlogId ? updateBlogMutation() : createBlogMutation()}
                      disabled={!blogTranslations.az.title || creatingBlog || updatingBlog}
                      className="flex-[2] bg-primary text-white font-bold h-12"
                    >
                      {creatingBlog || updatingBlog ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingBlogId ? t('common.save', 'Update Article') : t('admin.blogs.publish', 'Publish Article'))}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#09090b] border-white/5">
            <CardHeader className="p-8 border-b border-white/5">
              <CardTitle className="text-xl font-display font-bold text-white">{t('admin.blogs.list_title', 'Editorial Archives')}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {loadingBlogs ? (
                <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-white/20" /></div>
              ) : blogs.length === 0 ? (
                <p className="text-center text-white/30 py-16 font-bold">{t('admin.blogs.empty_list', 'No articles found in archives.')}</p>
              ) : (
                <div className="grid gap-4">
                  {blogs.map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                          {b.image && <img src={b.image} className="w-full h-full object-cover" alt="" />}
                        </div>
                        <div>
                          <div className="font-bold text-white">{b.title}</div>
                          <div className="text-xs text-white/30 mt-1">{b.author} • {new Date(b.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link to={`/blog/${b.id}`} className="p-2 rounded-lg hover:bg-white/10 text-white/40">
                           <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleEditBlog(b)} className="p-2 rounded-lg hover:bg-white/10 text-white/50">
                          <Globe className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteBlogMutation(b.id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
