import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { getMyTherapistSessions, confirmSessionAsTherapist, rejectSessionAsTherapist, completeSession, setWorkingHours } from "../../services/therapySession.service"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avatar"
import { Badge } from "../../components/ui/Badge"
import { Input } from "../../components/ui/Input"
import { Calendar, Video, Clock, DollarSign, Loader2, CheckCircle2, XCircle, PlayCircle, Settings } from "lucide-react"
import { toast } from "../../store/useToastStore"

export default function ExpertPanel() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [isConfiguringHours, setIsConfiguringHours] = useState(false)
  const [workingHours, setWorkingHoursInput] = useState("")

  const { data: sessionsResponse, isLoading } = useQuery({
    queryKey: ["therapistSessions"],
    queryFn: getMyTherapistSessions
  })

  // Backend returns result.data
  const sessions = sessionsResponse?.data || []
  
  const { mutate: confirmMutation } = useMutation({
    mutationFn: ({ id, meetingLink }) => confirmSessionAsTherapist(id, { meetingLink }),
    onSuccess: () => {
      queryClient.invalidateQueries(["therapistSessions"])
      toast.success(t('expert.session_confirmed', 'Session confirmed!'))
    }
  })

  const { mutate: rejectMutation } = useMutation({
    mutationFn: (id) => rejectSessionAsTherapist(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["therapistSessions"])
      toast.info(t('expert.session_rejected', 'Session rejected.'))
    }
  })

  const { mutate: completeMutation } = useMutation({
    mutationFn: (id) => completeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["therapistSessions"])
      toast.success(t('expert.session_completed', 'Session marked as completed!'))
    }
  })

  const { mutate: saveHours, isPending: savingHours } = useMutation({
    mutationFn: () => setWorkingHours({ 
      workingHours: workingHours.split(',').map(s => s.trim()).filter(Boolean) 
    }),
    onSuccess: () => {
      toast.success(t('expert.hours_updated', 'Working hours updated!'))
      setIsConfiguringHours(false)
    }
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 0: return <Badge className="bg-orange-50 text-orange-600 border-orange-200">PENDING</Badge>
      case 1: return <Badge className="bg-blue-50 text-blue-600 border-blue-200">WAITING FOR USER</Badge>
      case 2: return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200">CONFIRMED</Badge>
      case 3: return <Badge className="bg-purple-50 text-purple-600 border-purple-200">COMPLETED</Badge>
      case 4: return <Badge className="bg-rose-50 text-rose-600 border-rose-200">CANCELLED</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-[#1a1c1e]">{t('expert.title', 'Expert Command.')}</h1>
          <p className="text-muted-foreground font-medium">{t('expert.subtitle', 'Manage clinical sessions and patient protocols.')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl font-bold h-11" onClick={() => setIsConfiguringHours(!isConfiguringHours)}>
            <Settings className="mr-2 h-4 w-4" /> {t('expert.configure_hours', 'Session Schema')}
          </Button>
          <Button className="rounded-xl font-bold h-11 shadow-lg shadow-primary/20">
            <Calendar className="mr-2 h-4 w-4" /> {t('expert.view_calendar', 'Calendar')}
          </Button>
        </div>
      </div>

      {isConfiguringHours && (
        <Card className="border-primary/20 bg-primary/[0.02]">
           <CardHeader>
              <CardTitle className="text-lg font-bold">{t('expert.hours_title', 'Configure Availability')}</CardTitle>
              <CardDescription>{t('expert.hours_desc', 'Enter available session start times (comma separated, e.g. 10:00, 12:00, 15:00)')}</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <Input 
                 placeholder="09:00, 11:00, 14:00, 16:00" 
                 value={workingHours}
                 onChange={e => setWorkingHoursInput(e.target.value)}
                 className="h-12 rounded-xl bg-white"
              />
              <div className="flex justify-end gap-3">
                 <Button variant="ghost" onClick={() => setIsConfiguringHours(false)}>{t('common.cancel', 'Cancel')}</Button>
                 <Button disabled={savingHours} onClick={() => saveHours()}>
                   {savingHours ? <Loader2 className="animate-spin h-4 w-4" /> : t('common.save', 'Save Schema')}
                 </Button>
              </div>
           </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="premium-card p-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('expert.stats.pending', 'Manifest Requests')}</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-[#1a1c1e]">{sessions.filter(s => s.status === 0).length}</div>
            <p className="text-xs font-medium text-muted-foreground/60 mt-1">{t('expert.stats.pending_desc', 'Awaiting clinical confirmation')}</p>
          </CardContent>
        </Card>
        <Card className="premium-card p-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('expert.stats.active', 'Active Protocol')}</CardTitle>
            <Video className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-[#1a1c1e]">{sessions.filter(s => s.status === 1).length}</div>
            <p className="text-xs font-medium text-muted-foreground/60 mt-1">{t('expert.stats.active_desc', 'Scheduled clinical encounters')}</p>
          </CardContent>
        </Card>
        <Card className="premium-card p-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('expert.stats.revenue', 'Settled Earnings')}</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-bold text-[#1a1c1e]">${(sessions.filter(s => s.status === 4).length * 45).toFixed(2)}</div>
            <p className="text-xs font-medium text-muted-foreground/60 mt-1">{t('expert.stats.revenue_desc', 'Verified session settlements')}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card">
        <CardHeader className="p-8 border-b border-neutral-100/50">
          <CardTitle className="text-xl font-display font-bold">{t('expert.sessions.title', 'Clinical Encounters')}</CardTitle>
          <CardDescription className="font-medium">{t('expert.sessions.subtitle', 'Real-time synchronization with the patient manifest.')}</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{t('expert.syncing', 'Syncing manifest...')}</p>
             </div>
          ) : sessions.length === 0 ? (
             <div className="text-center py-24 border-2 border-dashed border-neutral-100 rounded-3xl bg-neutral-50/50">
                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-10" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">{t('expert.no_sessions', 'No active encounters found.')}</p>
             </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((s) => (
                <div key={s.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-6 rounded-2xl border border-neutral-100 bg-white hover:border-primary/20 transition-all duration-300 gap-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-14 w-14 rounded-2xl border border-neutral-100">
                      <AvatarImage src={s.user?.avatar} />
                      <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">{s.user?.fullName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-display font-bold text-lg text-[#1a1c1e]">{s.user?.fullName}</p>
                        {getStatusBadge(s.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(s.startTime).toLocaleDateString()} {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5" /> {s.meetingLink || t('expert.link_pending', 'Link Pending')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 lg:pt-0 border-t lg:border-none border-neutral-50">
                    {s.status === 0 && (
                      <>
                        <Button variant="outline" className="rounded-xl h-10 px-6 font-bold border-red-100 text-red-500 hover:bg-red-50" onClick={() => rejectMutation(s.id)}>
                          <XCircle className="w-4 h-4 mr-2" /> {t('common.reject', 'Reject')}
                        </Button>
                        <Button className="rounded-xl h-10 px-6 font-bold" onClick={() => {
                          const link = prompt("Enter Meeting Link (Zoom/Google Meet):", "https://meet.google.com/...");
                          if (link) confirmMutation({ id: s.id, meetingLink: link });
                        }}>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> {t('common.confirm', 'Confirm')}
                        </Button>
                      </>
                    )}
                    {s.status === 1 && (
                       <p className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100">
                          {t('expert.waiting_user', 'Waiting for patient confirmation')}
                       </p>
                    )}
                    {s.status === 2 && (
                      <>
                        {s.meetingLink && (
                          <Button variant="outline" className="rounded-xl h-10 px-6 font-bold border-emerald-100 text-emerald-600 hover:bg-emerald-50" onClick={() => window.open(s.meetingLink, '_blank')}>
                            <Video className="w-4 h-4 mr-2" /> {t('expert.join', 'Join Session')}
                          </Button>
                        )}
                        <Button className="rounded-xl h-10 px-6 font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20" onClick={() => completeMutation(s.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" /> {t('expert.mark_complete', 'Complete Session')}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
