import React, { useState, useMemo } from "react"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useAuthStore } from "../../store/useAuthStore"
import { toast } from "../../store/useToastStore"
import { Link, useNavigate } from "react-router-dom"
import { 
  BrainCircuit, ArrowRight, ArrowLeft, Leaf, ShieldCheck, 
  AlertTriangle, CheckCircle2, Loader2, RotateCcw, ShoppingCart,
  Sparkles, Heart 
} from "lucide-react"
import api from "../../services/api"

export default function AIConsultant() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  const STEPS = useMemo(() => [
    {
      id: "symptoms",
      question: t("ai.steps.symptoms.q", "What symptoms or health concerns are you experiencing?"),
      placeholder: t("ai.steps.symptoms.p", "e.g. fatigue, poor digestion, stress, insomnia..."),
      type: "textarea",
    },
    {
      id: "goal",
      question: t("ai.steps.goal.q", "What is your primary health goal?"),
      type: "choice",
      choices: [
        t("ai.goals.energy", "Improve energy & vitality"),
        t("ai.goals.sleep", "Better sleep & stress reduction"),
        t("ai.goals.immune", "Immune system support"),
        t("ai.goals.digestive", "Digestive health"),
        t("ai.goals.cardio", "Cardiovascular support"),
        t("ai.goals.hormonal", "Hormonal balance"),
        t("ai.goals.weight", "Weight management"),
        t("ai.goals.wellness", "General wellness"),
      ],
    },
    {
      id: "conditions",
      question: t("ai.steps.conditions.q", "Do you have any pre-existing conditions or take medications?"),
      placeholder: t("ai.steps.conditions.p", "List any conditions or medications, or type 'None'"),
      type: "textarea",
    },
    {
      id: "lifestyle",
      question: t("ai.steps.lifestyle.q", "How would you describe your lifestyle?"),
      type: "choice",
      choices: [
        t("ai.lifestyle.very_active", "Very active (daily exercise)"),
        t("ai.lifestyle.moderately_active", "Moderately active"),
        t("ai.lifestyle.sedentary", "Mostly sedentary"),
        t("ai.lifestyle.high_stress", "High-stress professional"),
        t("ai.lifestyle.caregiver", "New parent / caregiver"),
        t("ai.lifestyle.senior", "Senior (60+)"),
      ],
    },
  ], [t])

  const RISK_COLORS = {
    low: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", dot: "bg-emerald-500" },
    medium: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", dot: "bg-amber-500" },
    high: { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", dot: "bg-rose-500" },
  }

  const { mutate: runConsultation, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post("/ai/consult", answers)
      return res
    },
    onSuccess: (data) => {
      setResult(data)
      toast.success(t("ai.ready_toast", "Your personalized protocol is ready!"))
    },
    onError: () => {
      toast.error(t("ai.error_toast", "Consultation failed."))
    },
  })

  const currentStep = STEPS[step]
  const progress = ((step) / STEPS.length) * 100

  const handleNext = () => {
    if (!answers[currentStep.id]) {
      toast.warning(t("ai.warn_answer", "Please answer the question before proceeding"))
      return
    }
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      runConsultation()
    }
  }

  const handleReset = () => {
    setStep(0)
    setAnswers({})
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#1a1c1e] text-white py-20 px-4">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/60 mb-4">
            <BrainCircuit className="w-3.5 h-3.5 text-primary" /> {t('ai.badge', 'AI Botanical Consultant')}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight leading-tight">
            {t('ai.title_p1', 'Your Personal')}<br />
            <span className="text-primary">{t('ai.title_p2', 'Herb Protocol')}</span>
          </h1>
          <p className="text-lg text-white/60 font-medium max-w-xl mx-auto leading-relaxed">
            {t('ai.subtitle', 'Answer 4 questions. Get a personalized, evidence-based botanical recommendation matched to your unique health profile.')}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        
        {!result ? (
          <div className="space-y-8">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>{t('ai.step_info', { current: step + 1, total: STEPS.length }, `Step ${step + 1} of ${STEPS.length}`)}</span>
                <span>{Math.round(progress)}% {t('ai.progress_info', 'complete')}</span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5">
              <h2 className="text-2xl font-display font-bold text-[#1a1c1e] mb-10 leading-tight">
                {currentStep.question}
              </h2>

              {currentStep.type === "textarea" ? (
                <textarea
                  value={answers[currentStep.id] || ""}
                  onChange={(e) => setAnswers(a => ({ ...a, [currentStep.id]: e.target.value }))}
                  placeholder={currentStep.placeholder}
                  rows={4}
                  className="w-full p-6 rounded-2xl border border-neutral-200 text-base text-[#1a1c1e] bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/30 transition-all resize-none font-medium"
                  autoFocus
                />
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {currentStep.choices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => setAnswers(a => ({ ...a, [currentStep.id]: choice }))}
                      className={`p-5 rounded-2xl text-left text-sm font-bold border-2 transition-all duration-300 relative group ${
                        answers[currentStep.id] === choice
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-neutral-50 text-muted-foreground hover:border-primary/20 hover:text-[#1a1c1e] hover:bg-neutral-50/50"
                      }`}
                    >
                      {answers[currentStep.id] === choice && (
                        <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      {choice}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-12 pt-8 border-t border-neutral-50">
                <button
                  onClick={() => setStep(s => s - 1)}
                  disabled={step === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-muted-foreground hover:text-[#1a1c1e] disabled:opacity-30 transition-colors uppercase tracking-widest text-[10px]"
                >
                  <ArrowLeft className="w-4 h-4" /> {t('ai.back', 'Back')}
                </button>
                <button
                  onClick={handleNext}
                  disabled={isPending}
                  className="flex items-center gap-2 px-10 py-4 rounded-full bg-primary text-white font-bold shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-70 uppercase tracking-widest text-[11px]"
                >
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {t('ai.analyzing', 'Analyzing...')}</>
                  ) : step < STEPS.length - 1 ? (
                    <>{t('ai.next', 'Continue')} <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> {t('ai.generate', 'Generate Protocol')}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Result Banner */}
            <div className="bg-[#1a1c1e] text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute right-[-10%] top-[-10%] w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-6 text-primary font-bold text-[10px] uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" /> {t('ai.result_badge', 'Protocol Generated')}
                </div>
                <h2 className="text-3xl font-display font-bold mb-4">{t('ai.result_title', 'Your Personalized Herb Protocol')}</h2>
                <p className="text-white/60 text-lg leading-relaxed font-medium">{result.summary}</p>
              </div>
            </div>

            {/* Risk Level */}
            {result.riskLevel && (() => {
              const colors = RISK_COLORS[result.riskLevel] || RISK_COLORS.low
              return (
                <div className={`flex items-start gap-4 p-6 rounded-3xl border ${colors.bg} ${colors.border} shadow-sm transition-all hover:shadow-md`}>
                  <div className={`w-4 h-4 rounded-full ${colors.dot} mt-1.5 flex-shrink-0 animate-pulse`} />
                  <div>
                    <div className={`font-bold text-xs ${colors.text} uppercase tracking-widest mb-1`}>{t('ai.risk_label', 'Risk Level')}: {t(`ai.risk_${result.riskLevel}`, result.riskLevel)}</div>
                    <div className="text-sm text-muted-foreground font-medium leading-relaxed">{t('ai.risk_desc', 'Always consult a qualified healthcare provider before beginning any herbal protocol.')}</div>
                  </div>
                </div>
              )
            })()}

            {/* Herb Recommendations */}
            <div>
              <h3 className="font-display font-bold text-2xl text-[#1a1c1e] mb-8">{t('ai.rec_title', 'Recommended Botanicals')}</h3>
              <div className="grid gap-6">
                {(result.herbs || []).map((herb, i) => {
                  const colors = RISK_COLORS[herb.risk || "low"]
                  return (
                    <div key={i} className="group p-8 rounded-[2.5rem] bg-white border border-neutral-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                          <Leaf className="w-8 h-8 text-emerald-600 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h4 className="font-display font-bold text-xl text-[#1a1c1e]">{herb.name}</h4>
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${colors.bg} ${colors.border} ${colors.text}`}>
                              {t(`ai.risk_${herb.risk || 'low'}`, herb.risk || 'low')} {t('ai.risk_suffix', 'risk')}
                            </span>
                          </div>
                          <div className="italic text-sm text-muted-foreground font-medium mb-4">{herb.scientificName}</div>
                          <p className="text-muted-foreground leading-relaxed font-medium">{herb.benefit}</p>
                          {herb.safety && (
                            <div className="flex items-start gap-2.5 mt-5 text-xs text-amber-700 bg-amber-50/50 border border-amber-100 rounded-2xl p-4 font-medium">
                              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" /> {herb.safety}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-8 pt-8 border-t border-neutral-50 flex flex-col sm:flex-row gap-3">
                        <Link 
                          to={`/herbs?search=${encodeURIComponent(herb.name)}`}
                          className="flex-1 text-center py-3.5 rounded-xl border border-neutral-200 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:border-primary/30 hover:text-primary transition-all"
                        >
                          {t('ai.learn_more', 'Learn More')}
                        </Link>
                        <Link
                          to={`/marketplace?search=${encodeURIComponent(herb.name)}`}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                          <ShoppingCart className="w-4 h-4" /> {t('ai.shop_now', 'Shop This Herb')}
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground/60">{t('ai.warnings_title', 'Important Health Warnings')}</h3>
                {result.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-rose-50 border border-rose-100/50 text-sm text-rose-700 font-medium leading-relaxed">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" /> {w}
                  </div>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-neutral-100">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 h-16 rounded-2xl border-2 border-neutral-200 font-bold text-muted-foreground hover:border-primary/30 hover:text-primary transition-all uppercase tracking-widest text-[11px]"
              >
                <RotateCcw className="w-4 h-4" /> {t('ai.start_over', 'Start Over')}
              </button>
              <Link
                to="/marketplace"
                className="flex-1 flex items-center justify-center gap-2 h-16 rounded-2xl bg-primary text-white font-bold shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all uppercase tracking-widest text-[11px]"
              >
                <ShoppingCart className="w-4 h-4" /> {t('ai.browse_marketplace', 'Browse Related Products')}
              </Link>
            </div>

            {!isAuthenticated && (
              <div className="p-10 rounded-[2.5rem] bg-[#1a1c1e] text-white text-center space-y-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[60px]" />
                <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
                <div className="space-y-2">
                  <p className="text-xl font-display font-bold">{t('ai.save_vault_title', 'Save your protocol to your health vault')}</p>
                  <p className="text-sm text-white/50 leading-relaxed font-medium max-w-md mx-auto">{t('ai.save_vault_desc', 'Create a free account to save recommendations, track your progress, and receive personalized insights.')}</p>
                </div>
                <Link to="/register" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-primary text-white font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">
                  {t('ai.create_account', 'Create Free Account')} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
