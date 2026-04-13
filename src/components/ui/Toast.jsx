import React, { createContext, useContext, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "../../lib/utils"

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ title, description, variant = "default", duration = 3000 }) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, description, variant }])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all mb-4",
                t.variant === "default" && "bg-background text-foreground",
                t.variant === "destructive" && "destructive group border-destructive bg-destructive text-destructive-foreground",
                t.variant === "success" && "border-green-500 bg-green-50 text-green-900 border"
              )}
            >
              <div className="flex gap-3 items-start">
                {t.variant === "success" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                {t.variant === "destructive" && <AlertCircle className="h-5 w-5 text-destructive-foreground" />}
                {t.variant === "default" && <Info className="h-5 w-5 text-muted-foreground" />}
                <div className="grid gap-1">
                  {t.title && <div className="text-sm font-semibold">{t.title}</div>}
                  {t.description && <div className="text-sm opacity-90">{t.description}</div>}
                </div>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="absolute right-2 top-2 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}
