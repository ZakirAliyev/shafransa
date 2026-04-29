import React, { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { getPlant } from "../../services/plant.service"
import { safeGet } from "../../lib/safeData"
import { Badge } from "../../components/ui/Badge"
import {
  Leaf, ChevronLeft, Loader2, Microscope, ArrowRight, ShieldCheck,
  MapPin, FlaskConical, AlertTriangle, BookOpen, Search, Package,
  Heart, Baby, UserMinus, Info
} from "lucide-react"

export default function HerbDetailsPage() {
  const { t, i18n } = useTranslation()
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

  // ✅ Robust data extraction (handles arrays, nested data: { data: [...] } or single objects)
  const rawHerb = (Array.isArray(herb) ? herb[0] : (herb?.data?.[0] || herb?.data || herb)) || {}

  // ✅ Merge current language translation
  const currentLang = i18n.language || 'az'
  const herbData = React.useMemo(() => {
    if (!rawHerb.translations || !Array.isArray(rawHerb.translations)) return rawHerb
    
    const translation = rawHerb.translations.find(t => t.language === currentLang)
    if (!translation) return rawHerb

    // Create a merged object prioritizing translated fields
    const merged = { ...rawHerb }
    Object.keys(translation).forEach(key => {
      const val = translation[key]
      const isValid = Array.isArray(val) ? val.length > 0 : (val !== null && val !== undefined && val !== "")
      if (isValid) {
        merged[key] = val
      }
    })
    return merged
  }, [rawHerb, currentLang])

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary opacity-30" />
    </div>
  )

  // ✅ Check if data loaded successfully
  if (error || !herbData?.name) return (
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
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-[#1a1c1e] leading-tight">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-100">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{t('encyclopedia.filters.continent', 'Continent')}</div>
              <div className="font-bold text-[#1a1c1e]">{herbData.continent || "Global"}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{t('herb.meta.country', 'Country')}</div>
              <div className="font-bold text-[#1a1c1e]">{herbData.country || "Varied"}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{t('herb.meta.climate', 'Climate')}</div>
              <div className="font-bold text-[#1a1c1e]">{herbData.climate || "Stable"}</div>
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

        {/* Media / Gallery Column */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-[#f5f5f7] rounded-3xl overflow-hidden border border-neutral-100 flex items-center justify-center group">
            {herbData.image ? (
              <img src={herbData.image} alt={herbData.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <Leaf className="w-24 h-24 text-primary/10 stroke-1" />
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">{t('herb.image_pending', 'Imaging Pending')}</div>
              </div>
            )}
          </div>
          
          {herbData.gallery && herbData.gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {herbData.gallery.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-[#f5f5f7] border border-neutral-100 overflow-hidden hover:border-primary/40 transition-colors cursor-zoom-in group">
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                </div>
              ))}
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
                <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {herbData.description}
                </div>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-[#1a1c1e] mb-4">{t('herb.sections.benefits', 'Therapeutic Benefits')}</h2>
                <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed p-6 rounded-2xl bg-primary/5 border border-primary/10 whitespace-pre-wrap">
                  {herbData.benefits}
                </div>
              </section>

              {herbData.usageForms && herbData.usageForms.length > 0 && (
                <section>
                  <h2 className="text-2xl font-display font-bold text-[#1a1c1e] mb-6">{t('herb.sections.usage_forms', 'Available Forms')}</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {herbData.usageForms.map((f, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:border-primary/20 transition-colors">
                        <h3 className="font-bold text-[#1a1c1e] mb-2 text-sm uppercase tracking-wider">{f.name}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {herbData.usedIn && (
                <section>
                  <h2 className="text-2xl font-display font-bold text-[#1a1c1e] mb-4">{t('herb.sections.used_in', 'Traditional Medicine & Used In')}</h2>
                  <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {herbData.usedIn}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-xl shadow-black/5">
                <h3 className="font-bold text-[#1a1c1e] mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {t('herb.meta.climate', 'Endemic Climate')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{herbData.climate || t('herb.climate_default', "Global adaptivity. Often found in temperate to subtropical zones.")}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-neutral-100 shadow-xl shadow-black/5">
                <h3 className="font-bold text-[#1a1c1e] mb-2 flex items-center gap-2"><Leaf className="w-4 h-4 text-primary" /> {t('herb.sections.usage', 'Traditional Usage')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{herbData.usage}</p>
              </div>
              {herbData.notes && (
                <div className="p-6 rounded-2xl bg-[#f5f5f7] border border-neutral-200">
                  <h3 className="font-bold text-[#1a1c1e] mb-2 flex items-center gap-2 text-xs uppercase tracking-widest">{t('herb.sections.expert_notes', 'Expert Notes')}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed italic whitespace-pre-wrap">{herbData.notes}</p>
                </div>
              )}
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
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{herbData.dosage}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Interactions & Safety" && (
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl">
            {/* Contraindications & Side Effects - High Priority */}
            <div className="p-8 rounded-3xl bg-rose-50/50 border border-rose-100 space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
                <h3 className="text-xl font-bold text-rose-700">{t('herb.sections.contraindications', 'Contraindications')}</h3>
              </div>
              <p className="text-rose-600/80 leading-relaxed font-medium whitespace-pre-wrap">{herbData.contraindications}</p>
            </div>

            <div className="p-8 rounded-3xl bg-orange-50/50 border border-orange-100 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-orange-700">{t('herb.sections.side_effects', 'Side Effects')}</h3>
              </div>
              <p className="text-orange-600/80 leading-relaxed font-medium whitespace-pre-wrap">{herbData.sideEffects}</p>
            </div>

            {/* Detailed Clinical Safety */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl shadow-black/5 space-y-10">
              
              <div className="grid md:grid-cols-2 gap-10">
                {/* General Safety */}
                {herbData.generalSafety && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary border-b border-neutral-100 pb-2">
                      <ShieldCheck className="w-4 h-4" /> {t('herb.sections.general_safety', 'Clinical Safety Overview')}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">{herbData.generalSafety}</p>
                  </div>
                )}

                {/* Drug Interactions */}
                {herbData.drugInteractions && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#1a1c1e] border-b border-neutral-100 pb-2">
                      <FlaskConical className="w-4 h-4" /> {t('herb.sections.drug_interactions', 'Drug Interactions')}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">{herbData.drugInteractions}</p>
                  </div>
                )}

                {/* Pregnancy (Clinical) */}
                {(herbData.pregnancy || herbData.pregnancyWarnings) && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-rose-500 border-b border-rose-100 pb-2">
                      <Baby className="w-4 h-4" /> {t('herb.sections.pregnancy_clinical', 'Pregnancy & Nursing')}
                    </h4>
                    <div className="space-y-4">
                      {herbData.pregnancy && <p className="text-muted-foreground leading-relaxed">{herbData.pregnancy}</p>}
                      {herbData.pregnancyWarnings && (
                        <div className="p-4 rounded-xl bg-rose-50 text-rose-600 text-xs font-medium border border-rose-100">
                          <strong>{t('herb.alerts.pregnancy_warning', 'Warning')}:</strong> {herbData.pregnancyWarnings}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Allergen Alerts */}
                {herbData.allergy && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-orange-500 border-b border-orange-100 pb-2">
                      <AlertTriangle className="w-4 h-4" /> {t('herb.sections.allergy_warnings', 'Potential Allergen Alerts')}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">{herbData.allergy}</p>
                  </div>
                )}

                {/* Sensitive Medical Conditions */}
                {herbData.medicalConditions && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-500 border-b border-amber-100 pb-2">
                      <Heart className="w-4 h-4" /> {t('herb.sections.clinical_conditions', 'Sensitive Medical Conditions')}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">{herbData.medicalConditions}</p>
                  </div>
                )}

                {/* Dosage Caution */}
                {herbData.dosageCaution && (
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-600 border-b border-amber-100 pb-2">
                      <Info className="w-4 h-4" /> {t('herb.sections.dosage_caution', 'Dosage Caution')}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">{herbData.dosageCaution}</p>
                  </div>
                )}
              </div>
            </div>
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
                      {p.image || p.images?.[0] ? (
                        <img
                          src={p.image || p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
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

      {herbData.references && herbData.references.length > 0 && (
        <div className="mt-20 pt-10 border-t border-neutral-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-6 flex items-center gap-2">
            <Microscope className="w-4 h-4" /> {t('herb.sections.references', 'Scientific References')}
          </h3>
          <ul className="space-y-4">
            {herbData.references.map((ref, idx) => (
              <li key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 text-xs font-bold text-neutral-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">{ref.description || ref}</p>
                  {ref.link && (
                    <a href={ref.link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-primary hover:underline mt-2 inline-block uppercase tracking-widest">
                      {t('common.view_source', 'View Source')} →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}
