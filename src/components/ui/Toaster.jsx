import React, { useEffect, useState } from "react"
import { useToastStore } from "../../store/useToastStore"
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react"

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const COLORS = {
  success: {
    bar: "bg-emerald-500",
    icon: "text-emerald-500",
    bg: "bg-white",
    border: "border-emerald-100",
  },
  error: {
    bar: "bg-rose-500",
    icon: "text-rose-500",
    bg: "bg-white",
    border: "border-rose-100",
  },
  warning: {
    bar: "bg-amber-500",
    icon: "text-amber-500",
    bg: "bg-white",
    border: "border-amber-100",
  },
  info: {
    bar: "bg-blue-500",
    icon: "text-blue-500",
    bg: "bg-white",
    border: "border-blue-100",
  },
}

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false)
  const Icon = ICONS[toast.type] || Info
  const colors = COLORS[toast.type] || COLORS.info

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  return (
    <div
      className={`relative flex items-start gap-3 p-4 pr-10 rounded-2xl border shadow-xl shadow-black/10 max-w-sm w-full overflow-hidden transition-all duration-500 ${colors.bg} ${colors.border}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      {/* Left color bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.bar} rounded-l-2xl`} />
      
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
      
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-bold text-sm text-[#1a1c1e]">{toast.title}</div>
        )}
        {toast.message && (
          <div className="text-sm text-muted-foreground mt-0.5 leading-snug">{toast.message}</div>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="absolute top-3 right-3 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function Toaster() {
  const { toasts, dismiss } = useToastStore()

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  )
}
