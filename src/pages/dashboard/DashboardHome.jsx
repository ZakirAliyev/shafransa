import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Leaf, Users, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react"

export default function DashboardHome() {
  const stats = [
    { name: "Total Prescribed Plans", value: "24", icon: TrendingUp, change: "+12%" },
    { name: "Consultations Completed", value: "12", icon: Users, change: "+3" },
    { name: "Saved Herbs", value: "89", icon: Leaf, change: "+14" },
    { name: "Active Risk Alerts", value: "2", icon: AlertTriangle, change: "-1", variant: "destructive" },
  ]

  const recentActivity = [
    { id: 1, action: "Viewed herb passport", target: "Ashwagandha", time: "2 hours ago", status: "success" },
    { id: 2, action: "Completed consultation", target: "Dr. Aliyeva", time: "1 day ago", status: "success" },
    { id: 3, action: "Risk warning detected", target: "High dosage - Ginseng", time: "2 days ago", status: "warning" },
    { id: 4, action: "Purchased", target: "Turmeric Extract (1000mg)", time: "3 days ago", status: "success" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.variant === 'destructive' ? 'text-destructive' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-green-500' : 'text-primary'}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Health Progress</CardTitle>
            <CardDescription>Your protocol adherence over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-border">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Chart Visualization Rendered Here
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <span className="relative flex h-2 w-2 mr-4 mt-1 rounded-full bg-primary" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.target}</p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button className="text-sm font-semibold flex items-center text-primary hover:underline">
                View all activity <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
