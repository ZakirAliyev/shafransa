import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Plus, GripVertical, Clock, Save, FileText } from "lucide-react"

export default function ProtocolBuilder() {
  const timelineItems = [
    { id: 1, type: "Tincture", time: "08:00 AM", title: "Ashwagandha Extract", dose: "2ml with water" },
    { id: 2, type: "Tea", time: "14:00 PM", title: "Ginseng & Ginger Blend", dose: "1 cup" },
    { id: 3, type: "Capsule", time: "21:00 PM", title: "Magnesium + Lavender", dose: "2 capsules" },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Protocol Builder</h1>
          <p className="text-muted-foreground">Drag and drop to build personalized health journeys.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Export PDF</Button>
          <Button><Save className="mr-2 h-4 w-4" /> Save Protocol</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Timeline</CardTitle>
              <CardDescription>Drag items to reorder the patient's daily healing plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {timelineItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                  <div className="flex items-center justify-center rounded-lg bg-primary/10 p-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.type} • {item.dose}</p>
                  </div>
                  <div className="font-medium">{item.time}</div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-4 border-dashed py-8 text-muted-foreground">
                <Plus className="mr-2 h-5 w-5" /> Add New Step
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Protocol Suggestions</CardTitle>
              <CardDescription>Based on selected symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3 cursor-pointer hover:border-primary transition-colors">
                <h4 className="font-medium text-sm">Add Evening Relaxation</h4>
                <p className="text-xs text-muted-foreground mt-1">Valerian Root Tea (1 cup)</p>
              </div>
              <div className="rounded-lg border p-3 cursor-pointer hover:border-primary transition-colors">
                <h4 className="font-medium text-sm">Add Morning Energy</h4>
                <p className="text-xs text-muted-foreground mt-1">Rhodiola Extract (200mg)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
