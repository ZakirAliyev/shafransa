import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { registerAsTherapist } from "../../services/therapist.service"
import { useAuthStore } from "../../store/useAuthStore"
import { toast } from "../../store/useToastStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { 
  Loader2, User, Award, FileText, 
  MapPin, CheckCircle2, ShieldCheck, 
  ChevronRight, BrainCircuit, Activity,
  Camera, Upload, Trash2, X
} from "lucide-react"

export default function TherapistRegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    specialization: "",
    bio: "",
    phoneNumber: "",
    email: user?.email || "",
    password: "",
  })

  const [cvFile, setCvFile] = useState(null)
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [certificateFiles, setCertificateFiles] = useState([])
  const [previews, setPreviews] = useState({ profile: null, certs: [] })

  const { mutate: register, isPending: registering } = useMutation({
    mutationFn: (data) => {
      const fd = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) fd.append(key, value)
      })
      if (cvFile) fd.append("CvFile", cvFile)
      if (profileImageFile) fd.append("ProfileImageFile", profileImageFile)
      certificateFiles.forEach(file => {
        fd.append("CertificateFiles", file)
      })
      
      return registerAsTherapist(fd)
    },
    onSuccess: () => {
      toast.success(t('therapists.registration_success', 'Application submitted successfully!'))
      navigate("/user")
    },
    onError: (err) => toast.error(err.message || t('therapists.registration_error', 'Failed to submit application'))
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.info(t('auth.login_required_register', "Please sign in to register as a therapist"))
      navigate("/login")
      return
    }
    register(formData)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-20 px-4">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-12">
        
        {/* Left Column: Info & Trust */}
        <div className="lg:col-span-2 space-y-8">
           <div className="space-y-4 pt-10">
              <Badge className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px] px-3">
                 Institutional Program
              </Badge>
              <h1 className="text-4xl font-display font-bold tracking-tight text-[#1a1c1e]">
                 {t('therapists.register_title', 'Join Shafransa Professional Network.')}
              </h1>
              <p className="text-muted-foreground font-medium leading-relaxed">
                 Apply to become a verified physiotherapist on our platform and connect with patients seeking restorative clinical care.
              </p>
           </div>

           <div className="space-y-6 pt-6">
              {[
                { icon: ShieldCheck, title: "Verified Status", desc: "Gain institutional credibility with our 'Verified' clinical badge." },
                { icon: BrainCircuit, title: "Patient Network", desc: "Access a growing ecosystem of patients seeking botanical-integrated recovery." },
                { icon: Activity, title: "Session Management", desc: "Manage your clinical slots and patient sessions through our intuitive dashboard." },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white border border-neutral-100 shadow-sm">
                   <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-[#1a1c1e]">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-3">
           <Card className="premium-card bg-white p-2">
              <CardHeader className="p-8 border-b border-neutral-100">
                 <CardTitle className="text-xl font-display font-bold">{t('therapists.register_form_title', 'Professional Manifest')}</CardTitle>
                 <CardDescription>{t('therapists.register_form_desc', 'Please provide your clinical credentials for verification.')}</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('user.label_fullname', 'Full Name')}</label>
                          <Input 
                             value={formData.fullName} 
                             onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                             placeholder="Dr. Specialist"
                             required
                             className="h-12 bg-neutral-50/50 border-neutral-200"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('therapists.label_specialization', 'Specialization')}</label>
                          <Input 
                             value={formData.specialization} 
                             onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                             placeholder="e.g. Neurological Physio"
                             required
                             className="h-12 bg-neutral-50/50 border-neutral-200"
                          />
                       </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('therapists.label_email', 'Email Address')}</label>
                          <Input 
                             type="email"
                             value={formData.email} 
                             onChange={(e) => setFormData({...formData, email: e.target.value})}
                             placeholder="specialist@shafransa.com"
                             required
                             className="h-12 bg-neutral-50/50 border-neutral-200"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('therapists.label_phone', 'Contact Phone')}</label>
                          <Input 
                             value={formData.phoneNumber} 
                             onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                             placeholder="+994 (__) ___ __ __"
                             required
                             className="h-12 bg-neutral-50/50 border-neutral-200"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('therapists.label_password', 'Password (for your account)')}</label>
                       <Input 
                          type="password"
                          value={formData.password} 
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          placeholder="••••••••"
                          required
                          className="h-12 bg-neutral-50/50 border-neutral-200"
                       />
                    </div>

                    <div className="space-y-8 py-6 border-y border-neutral-100">
                       <h3 className="text-xs font-bold uppercase tracking-widest text-primary">{t('therapists.documentation', 'Clinical Documentation')}</h3>
                       
                       <div className="grid md:grid-cols-2 gap-8">
                          {/* Profile Photo */}
                          <div className="space-y-4">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('therapists.avatar_photo', 'Profile Photo')}</label>
                             <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center overflow-hidden relative group">
                                   {previews.profile ? <img src={previews.profile} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-neutral-200" />}
                                   <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                      <Camera className="w-5 h-5 text-white" />
                                      <input 
                                         type="file" 
                                         accept="image/*" 
                                         className="hidden" 
                                         onChange={(e) => {
                                            const file = e.target.files[0]
                                            if (file) {
                                               setProfileImageFile(file)
                                               setPreviews(p => ({ ...p, profile: URL.createObjectURL(file) }))
                                            }
                                         }}
                                      />
                                   </label>
                                </div>
                                <p className="text-[9px] text-muted-foreground leading-tight max-w-[120px]">Used for your public specialist profile.</p>
                             </div>
                          </div>

                          {/* CV Upload */}
                          <div className="space-y-4">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('therapists.cv_upload', 'CV / Resume (PDF)')}</label>
                             <div className={`relative h-20 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center ${cvFile ? 'border-emerald-200 bg-emerald-50' : 'border-neutral-200 hover:border-primary/20 bg-neutral-50'}`}>
                                {cvFile ? (
                                   <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                                      <FileText className="w-4 h-4" /> {cvFile.name.substring(0, 15)}...
                                      <button onClick={() => setCvFile(null)}><X className="w-3 h-3 ml-2 text-rose-500" /></button>
                                   </div>
                                ) : (
                                   <label className="cursor-pointer flex flex-col items-center">
                                      <Upload className="w-5 h-5 text-neutral-300 mb-1" />
                                      <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Select File</span>
                                      <input 
                                         type="file" 
                                         accept=".pdf,.doc,.docx" 
                                         className="hidden" 
                                         onChange={(e) => setCvFile(e.target.files[0])}
                                      />
                                   </label>
                                )}
                             </div>
                          </div>
                       </div>

                       {/* Certificates */}
                       <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('therapists.certificates', 'Clinical Certificates & Accreditations')}</label>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                             {previews.certs.map((url, idx) => (
                                <div key={idx} className="aspect-square rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden relative group">
                                   <img src={url} className="w-full h-full object-cover" />
                                   <button 
                                      onClick={() => {
                                         const newFiles = [...certificateFiles]
                                         const newPreviews = [...previews.certs]
                                         newFiles.splice(idx, 1)
                                         newPreviews.splice(idx, 1)
                                         setCertificateFiles(newFiles)
                                         setPreviews(p => ({ ...p, certs: newPreviews }))
                                      }}
                                      className="absolute inset-0 bg-rose-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                   >
                                      <Trash2 className="w-4 h-4 text-white" />
                                   </button>
                                </div>
                             ))}
                             <label className="aspect-square rounded-xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors">
                                <Plus className="w-5 h-5 text-neutral-300" />
                                <input 
                                   type="file" 
                                   multiple 
                                   accept="image/*" 
                                   className="hidden" 
                                   onChange={(e) => {
                                      const files = Array.from(e.target.files)
                                      setCertificateFiles(prev => [...prev, ...files])
                                      setPreviews(p => ({ ...p, certs: [...p.certs, ...files.map(f => URL.createObjectURL(f))] }))
                                   }}
                                />
                             </label>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('therapists.label_bio', 'Professional Bio / Clinical Approach')}</label>
                       <textarea 
                          value={formData.bio} 
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          placeholder="Describe your methods, focus areas, and clinical experience..."
                          required
                          className="w-full min-h-[120px] p-4 rounded-xl bg-neutral-50/50 border border-neutral-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                       />
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                       <div className="p-3 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                       </div>
                       <p className="text-[10px] font-bold text-muted-foreground leading-tight">
                          By submitting, your profile will undergo a manual review process by our clinical board. Verification typically takes 48-72 hours.
                       </p>
                    </div>

                    <Button 
                       type="submit" 
                       disabled={registering}
                       className="w-full h-14 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    >
                       {registering ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                          <>
                             {t('therapists.submit_application', 'Submit Clinical Manifest')}
                             <ChevronRight className="w-4 h-4 ml-1" />
                          </>
                       )}
                    </Button>
                 </form>
              </CardContent>
           </Card>
        </div>

      </div>
    </div>
  )
}
