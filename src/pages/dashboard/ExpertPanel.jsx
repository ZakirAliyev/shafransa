import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avatar"
import { Calendar, Video, Clock, DollarSign } from "lucide-react"

export default function ExpertPanel() {
  const appointments = [
    { id: 1, patient: "Sarah M.", time: "Today, 14:00 PM", type: "Video Call", status: "Upcoming" },
    { id: 2, patient: "Emin K.", time: "Tomorrow, 10:30 AM", type: "Chat Consultation", status: "Scheduled" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expert Dashboard</h1>
          <p className="text-muted-foreground">Manage your consultations and patient protocols.</p>
        </div>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" /> Manage Calendar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Video className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">For this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">Lifetime successful sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,450</div>
            <p className="text-xs text-muted-foreground">+8% vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>Your schedule for the next 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between rounded-xl border p-4 shadow-sm transition-all hover:bg-accent hover:text-accent-foreground">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{appt.patient.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{appt.patient}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" /> {appt.time}
                      <span className="mx-1">•</span>
                      <Video className="h-3 w-3" /> {appt.type}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button size="sm">Join Session</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
