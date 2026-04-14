import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { getTherapistById } from "../../services/therapist.service"
import { getAvailabilitySummary, createSession } from "../../services/therapySession.service"
import { useAuthStore } from "../../store/useAuthStore"
import { toast } from "../../store/useToastStore"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { 
  Loader2, User, MapPin, Star, ShieldCheck, 
  Calendar, Clock, CheckCircle2, ChevronLeft,
  ChevronRight, Phone, Mail, Award, Info
} from "lucide-react"

export default function TherapistDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const { data: therapist, isLoading: loadingTherapist } = useQuery({
    queryKey: ["therapist", id],
    queryFn: () => getTherapistById(id),
  })

  const { data: availability, isLoading: loadingAvailability } = useQuery({
    queryKey: ["availability", id, currentYear, currentMonth],
    queryFn: () => getAvailabilitySummary(id, currentYear, currentMonth),
  })

  const { mutate: bookSession, isPending: booking } = useMutation({
    mutationFn: (data) => createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["sessions", "my"])
      toast.success(t('therapists.booking_success', 'Session requested successfully!'))
      navigate("/user/sessions") // We'll create this tab soon
    },
    onError: (err) => toast.error(err.message || t('therapists.booking_error', 'Failed to book session'))
  })

  const handleBook = () => {
    if (!isAuthenticated) {
      toast.info(t('auth.login_required_booking', "Please sign in to book a session"))
      navigate("/login")
      return
    }
    if (!selectedSlot) return
    
    // selectedSlot is "11:00" string from availability
    const sessionDate = new Date(selectedDate)
    const [hours, minutes] = selectedSlot.split(":")
    sessionDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    bookSession({
      therapistId: id,
      startTime: sessionDate.toISOString(),
    })
  }

  const changeMonth = (offset) => {
    let nextMonth = currentMonth + offset
    let nextYear = currentYear
    if (nextMonth > 12) { nextMonth = 1; nextYear++; }
    if (nextMonth < 1) { nextMonth = 12; nextYear--; }
    setCurrentMonth(nextMonth)
    setCurrentYear(nextYear)
  }

  if (loadingTherapist) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-500 opacity-30" />
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">{t('common.loading', 'Loading details...')}</p>
    </div>
  )

  const profile = therapist?.data || therapist

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      
      {/* Breadcrumb / Back */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-[#1a1c1e] transition-colors">
          <ChevronLeft className="w-4 h-4" /> {t('common.back', 'Back')}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="premium-card p-10 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 opacity-50" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
               {/* Avatar */}
               <div className="w-48 h-48 rounded-3xl bg-[#f5f5f7] border border-neutral-100 overflow-hidden flex-shrink-0 shadow-lg shadow-black/5">
                 {profile?.avatar ? (
                   <img src={profile.avatar} className="w-full h-full object-cover" alt="" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-200">
                     <User className="w-24 h-24 stroke-[0.5]" />
                   </div>
                 )}
               </div>

               {/* Header Info */}
               <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                     <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold text-[10px] uppercase tracking-widest px-3">Verified Specialist</Badge>
                     <h1 className="text-4xl font-display font-bold text-[#1a1c1e]">{profile?.fullName}</h1>
                     <p className="text-lg font-bold text-emerald-600 italic">
                        {profile?.specialization || t('therapists.default_specialty', 'Physiotherapist')}
                     </p>
                  </div>

                  <div className="flex flex-wrap gap-6 items-center pt-2">
                     <div className="flex items-center gap-2 text-sm font-bold text-[#1a1c1e]">
                        <Star className="w-5 h-5 text-amber-400 fill-current" />
                        {profile?.rating?.toFixed(1) || "4.9"}
                        <span className="text-muted-foreground/40 font-medium">({profile?.reviewsCount || "12"} {t('reviews', 'reviews')})</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <MapPin className="w-5 h-5 text-emerald-500" /> Baku, Azerbaijan
                     </div>
                     <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                        <ShieldCheck className="w-5 h-5" /> {t('therapists.certified', 'Shafransa Certified')}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                     <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col items-center justify-center text-center">
                        <Award className="w-5 h-5 text-emerald-500 mb-2" />
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('therapists.experience', 'Exp')}</div>
                        <div className="font-bold text-[#1a1c1e]">8+ Years</div>
                     </div>
                     <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('therapists.patients', 'Patients')}</div>
                        <div className="font-bold text-[#1a1c1e]">1,200+</div>
                     </div>
                     <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col items-center justify-center text-center">
                        <FlaskConical className="w-5 h-5 text-emerald-500 mb-2" />
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('therapists.methods', 'Methods')}</div>
                        <div className="font-bold text-[#1a1c1e]">Clinical</div>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* About Section */}
          <section className="premium-card p-10 bg-white space-y-6">
             <div className="flex items-center gap-3 border-b border-neutral-100 pb-6">
                <Info className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-display font-bold text-[#1a1c1e]">{t('therapists.about', 'Clinical Abstract')}</h2>
             </div>
             <div className="prose prose-emerald max-w-none">
                <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                   {profile?.description || t('therapists.default_description', "Qualified physical therapist specializing in restorative recovery and clinical wellness. Focused on developing personalized treatment plans that integrate advanced therapeutic techniques with biological insights.")}
                </p>
             </div>
          </section>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="space-y-8">
           <section className="premium-card bg-white border border-neutral-100 shadow-2xl shadow-black/5 overflow-hidden sticky top-24">
              <header className="bg-[#1a1c1e] text-white p-6">
                 <h3 className="text-xl font-display font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" /> {t('therapists.booking_title', 'Reserve Session')}
                 </h3>
                 <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Available Professional Slots</p>
              </header>

              <div className="p-6 space-y-8">
                 {/* Calendar Picker (Simplified) */}
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-sm font-bold text-[#1a1c1e]">
                          {new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                       </h4>
                       <div className="flex gap-2">
                          <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg hover:bg-neutral-100 text-muted-foreground"><ChevronLeft className="w-4 h-4" /></button>
                          <button onClick={() => changeMonth(1)} className="p-2 rounded-lg hover:bg-neutral-100 text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
                       </div>
                    </div>

                    {loadingAvailability ? (
                      <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-emerald-500/30" /></div>
                    ) : (
                      <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] uppercase tracking-tighter text-muted-foreground/40 mb-2">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => <div key={d}>{d}</div>)}
                      </div>
                    )}
                    
                    {!loadingAvailability && (
                      <div className="grid grid-cols-7 gap-2">
                        {/* Summary comes as array of { date: string, isAvailable: bool } */}
                        {availability?.map((day, idx) => {
                          const dateObj = new Date(day.date)
                          const isSelected = selectedDate === day.date
                          const isPast = new Date(day.date) < new Date().setHours(0,0,0,0)
                          
                          return (
                            <button
                              key={idx}
                              disabled={!day.isAvailable || isPast}
                              onClick={() => { setSelectedDate(day.date); setSelectedSlot(null); }}
                              className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                                isSelected ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110 z-10" :
                                day.isAvailable && !isPast ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:scale-105" :
                                "bg-neutral-50 text-neutral-200 cursor-not-allowed opacity-50"
                              }`}
                            >
                              {dateObj.getDate()}
                            </button>
                          )
                        })}
                      </div>
                    )}
                 </div>

                 {/* Time Slot Picker */}
                 {selectedDate && (
                    <div className="space-y-4 animate-fade-in-up">
                       <h4 className="text-xs font-bold uppercase tracking-widest text-[#1a1c1e] flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-500" /> {t('therapists.select_time', 'Clinical Slots')}
                       </h4>
                       <div className="grid grid-cols-3 gap-2">
                          {/* Hardware mock or real slots if summary contains them */}
                          {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map(slot => (
                             <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`h-10 rounded-xl text-xs font-bold border transition-all ${
                                   selectedSlot === slot 
                                      ? "bg-[#1a1c1e] border-[#1a1c1e] text-white shadow-md" 
                                      : "border-neutral-200 text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-700"
                                }`}
                             >
                                {slot}
                             </button>
                          ))}
                       </div>
                    </div>
                 )}

                 {/* Confirmation / Action */}
                 <div className="pt-6 border-t border-neutral-100 space-y-4">
                    {selectedDate && selectedSlot && (
                       <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100/50">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/60">{t('therapists.appointment', 'Appointment')}</div>
                          <div className="font-bold text-[#1a1c1e] text-sm mt-1">
                             {new Date(selectedDate).toLocaleDateString('default', { day: 'numeric', month: 'long' })} @ {selectedSlot}
                          </div>
                       </div>
                    )}
                    <Button 
                       onClick={handleBook}
                       disabled={!selectedDate || !selectedSlot || booking}
                       className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xl shadow-emerald-600/20 disabled:opacity-30 disabled:shadow-none transition-all"
                    >
                       {booking ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          <>
                             <CheckCircle2 className="w-5 h-5 mr-2" />
                             {t('therapists.confirm_booking', 'Confirm Manifest')}
                          </>
                       )}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground/60 font-medium px-4">
                       By confirming, you agree to our <span className="underline">Session Cancellation Policy</span> and health guidelines.
                    </p>
                 </div>
              </div>
           </section>

           <div className="premium-card p-6 bg-emerald-600 text-white relative overflow-hidden group">
              <div className="absolute right-[-10%] bottom-[-10%] w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <Phone className="w-8 h-8 opacity-20 mb-4" />
              <h4 className="text-lg font-display font-bold">{t('therapists.need_help', 'Clinical Support')}</h4>
              <p className="text-sm text-white/60 mt-1 leading-relaxed">Required urgent consultation or have questions about a therapist?</p>
              <Link to="/contact" className="inline-flex items-center gap-2 mt-4 text-xs font-bold uppercase tracking-widest text-white hover:underline transition-colors">
                 Contact Liaison →
              </Link>
           </div>
        </div>
      </div>
    </div>
  )
}

function FlaskConical(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2v7.5" />
      <path d="M14 2v7.5" />
      <path d="M8.5 2h7" />
      <path d="M14 9.5a5 5 0 1 1-4 0" />
      <path d="M5.52 16h12.96" />
      <path d="M3 22h18" />
    </svg>
  )
}
