import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { getPlant } from "../../services/plant.service"
import { Badge } from "../../components/ui/Badge"
import {
  Leaf, ChevronLeft, Loader2, Microscope, ArrowRight, ShieldCheck,
  MapPin, FlaskConical, AlertTriangle, BookOpen, Search, Package
} from "lucide-react"

export default function HerbDetailsPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("Monograph")

  const TABS = [
    { id: "Monograph", label: t('herb.tabs.monograph', 'Monograph'), icon: BookOpen },
    { id: "Clinical Data", label: t('herb.tabs.clinical', 'Clinical Data'), icon: FlaskConical },
    { id: "Interactions & Safety", label: t('herb.tabs.safety', 'Interactions & Safety'), icon: AlertTriangle },
    { id: "Marketplace", label: t('herb.tabs.marketplace', 'Marketplace'), icon: Search },
  ]

  const { data: herb, isLoading, error } = useQuery({
    queryKey: ["plant", id],
    queryFn: () => getPlant(id),
  })

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary opacity-30" />
    </div>
  )

  if (error || !herbData) return (
    <div className="text-center py-40 max-w-md mx-auto">
      <p className="font-bold text-rose-500 text-lg">{t('herb.not_found', 'Botanical entry not found')}</p>
      <Link to="/herbs" className="text-sm text-primary mt-4 block hover:underline">← {t('herb.back', 'Back to Herb Bank')}</Link>
    </div>
  )

  const items = herbData.products || []

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 lg:px-8">

      {/* Back */}
      <button onClick={() => navigate("/herbs")} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-[#1a1c1e] mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> {t('herb.back', 'Back to Herb Bank')}
      </button>

      {/* Main Header */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-12 mb-16">

        {/* Info Column */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px] px-3">
                {herbData.evidenceGrade ? `${t('encyclopedia.grade', 'Grade')}: ${herbData.evidenceGrade}` : t('herb.badge.default', "Clinical Monograph")}
              </Badge>
              {herbData.region && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 border border-neutral-200 rounded-full px-3 py-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {herbData.region}
                </span>
              )}
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-[#1a1c1e] leading-tight flex items-center gap-4">
              {herbData.name}
            </h1>

            {(herbData.scientificName || herbData.localName) && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3 text-lg text-muted-foreground font-medium">
                {herbData.scientificName && <span className="italic">{herbData.scientificName}</span>}
                {herbData.scientificName && herbData.localName && <span className="hidden sm:inline text-neutral-300">•</span>}
                {herbData.localName && <span>{t('herb.local_name', 'Local')}: {herbData.localName}</span>}
              </div>
            )}
          </div>

          <div className="prose prose-neutral max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              {herbData.shortSummary || (herbData.description?.substring(0, 150) + "...")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{t('encyclopedia.filters.continent', 'Continent')}</div>
              <div className="font-bold text-[#1a1c1e]">{herbData.continent || "Global"}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{t('herb.meta.terroir', 'Terroir')}</div>
              <div className="font-bold text-[#1a1c1e]">{herbData.terroir || "Varied"}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{t('herb.meta.cultivation', 'Cultivation')}</div>
              <div className="font-bold text-[#1a1c1e]">{herbData.wildCultivated || "Wildcrafted"}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{t('herb.meta.chemotype', 'Chemotype')}</div>
              <div className="font-bold text-[#1a1c1e]">{herbData.chemotype || "Standard"}</div>
            </div>
          </div>
        </div>

        {/* Gallery Image */}
        <div className="relative aspect-square bg-[#f5f5f7] rounded-3xl overflow-hidden border border-neutral-100 flex items-center justify-center">
          {herbData.image ? (
            <img src={herbData.image} alt={herbData.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <Leaf className="w-24 h-24 text-primary/10 stroke-1" />
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">{t('herb.image_pending', 'Imaging Pending')}</div>
            </div>
          )}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="mb-10 border-b border-neutral-100 sticky top-20 bg-[#fafafa] z-20">
        <div className="flex gap-2 overflow-x-auto pb-4 thin-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-[#1a1c1e] hover:border-neutral-200"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[40vh]">
        {activeTab === "Monograph" && (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-display font-bold text-[#1a1c1e] mb-4">{t('herb.sections.description', 'Botanical Description')}</h2>
                <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed">
                  {herbData.description}
                </div>
              </section>
              <section>
                <h2 className="text-2xl font-display font-bold text-[#1a1c1e] mb-4">{t('herb.sections.benefits', 'Therapeutic Benefits')}</h2>
                <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  {herbData.benefits}
                </div>
              </section>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-xl shadow-black/5">
                <h3 className="font-bold text-[#1a1c1e] mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {t('herb.meta.climate', 'Endemic Climate')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{herbData.climate || t('herb.climate_default', "Global adaptivity. Often found in temperate to subtropical zones.")}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-xl shadow-black/5">
                <h3 className="font-bold text-[#1a1c1e] mb-4 flex items-center gap-2"><Leaf className="w-4 h-4 text-primary" /> {t('herb.sections.usage', 'Traditional Usage')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{herbData.usage}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Clinical Data" && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Microscope className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1c1e] mb-2">{t('herb.sections.compounds', 'Active Compounds')}</h3>
                <p className="text-muted-foreground leading-relaxed">{herbData.activeCompounds || t('herb.compounds_pending', "Pending precise spectrophotometry analytics.")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-neutral-50 border border-neutral-100">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <FlaskConical className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a1c1e] mb-2">{t('herb.sections.dosage', 'Clinical Dosage')}</h3>
                <p className="text-muted-foreground leading-relaxed">{herbData.dosage}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Interactions & Safety" && (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            <div className="p-8 rounded-3xl bg-rose-50/50 border border-rose-100 space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
                <h3 className="text-xl font-bold text-rose-700">{t('herb.sections.contraindications', 'Contraindications')}</h3>
              </div>
              <p className="text-rose-600/80 leading-relaxed font-medium">{herbData.contraindications}</p>
            </div>

            <div className="p-8 rounded-3xl bg-orange-50/50 border border-orange-100 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-orange-700">{t('herb.sections.side_effects', 'Side Effects')}</h3>
              </div>
              <p className="text-orange-600/80 leading-relaxed font-medium">{herbData.sideEffects}</p>
            </div>

            {(herbData.drugInteractions || herbData.pregnancyWarnings) && (
              <div className="md:col-span-2 p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl shadow-black/5 space-y-6">
                {herbData.drugInteractions && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[#1a1c1e] mb-2 border-b border-neutral-100 pb-2">{t('herb.sections.drug_interactions', 'Drug Interactions')}</h4>
                    <p className="text-muted-foreground leading-relaxed">{herbData.drugInteractions}</p>
                  </div>
                )}
                {herbData.pregnancyWarnings && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-rose-500 mb-2 border-b border-rose-100 pb-2">{t('herb.sections.pregnancy_warnings', 'Pregnancy & Nursing Warnings')}</h4>
                    <p className="text-muted-foreground leading-relaxed">{herbData.pregnancyWarnings}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "Marketplace" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-[#1a1c1e]">{t('herb.sections.formulations', 'Verified Formulations')}</h2>
              <Badge className="bg-primary text-white font-bold">{t('herb.products_found', '{{count}} Products Found', { count: items.length })}</Badge>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-24 rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50/50">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-bold text-[#1a1c1e]">{t('herb.no_products', 'No Commercial Products')}</h3>
                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">{t('herb.no_products_sub', 'There are currently no seller-listed products sourced precisely from this botanical record.')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((p) => (
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
                    <div className="p-5">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{p.seller?.fullName}</div>
                      <div className="font-bold text-sm text-[#1a1c1e] line-clamp-2 group-hover:text-primary transition-colors">{p.title}</div>
                      <div className="font-bold text-primary text-lg mt-2">${p.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}
