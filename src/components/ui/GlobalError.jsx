import React from "react"
import { useRouteError, useNavigate } from "react-router-dom"
import { ShieldAlert, RefreshCw, Home } from "lucide-react"
import { Button } from "./Button"

export default function GlobalError() {
  const error = useRouteError()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7] p-4 text-center">
      <div className="premium-card p-10 max-w-xl w-full flex flex-col items-center space-y-6 bg-white border-none shadow-2xl">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-2">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-3xl font-display font-bold text-[#1a1c1e] tracking-tight">System Exception Detected</h1>
        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
          The node encountered an unexpected anomaly. Our engineers have been notified.
        </p>
        
        {error && (
          <div className="w-full bg-neutral-50 border border-neutral-100 p-4 rounded-xl text-left overflow-hidden">
            <p className="font-mono text-xs text-rose-500/80 truncate font-bold">
              {error.message || error.statusText || "Unknown ReferenceError"}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
          <Button 
            className="flex-1 h-14 rounded-xl font-bold shadow-lg shadow-primary/20 btn-hover" 
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reload Node
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 h-14 rounded-xl font-bold border-neutral-200" 
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4 mr-2" /> Return to Root
          </Button>
        </div>
      </div>
      <div className="mt-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
        Shafransa Telemetry Diagnostics
      </div>
    </div>
  )
}
