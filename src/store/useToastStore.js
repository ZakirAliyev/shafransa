import { create } from "zustand"

let toastId = 0

export const useToastStore = create((set) => ({
  toasts: [],
  
  toast: ({ type = "info", title, message, duration = 4000 }) => {
    const id = toastId++
    set((state) => ({
      toasts: [...state.toasts, { id, type, title, message }]
    }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, duration)
    return id
  },

  success: (message, title = "Success") => {
    const store = useToastStore.getState()
    return store.toast({ type: "success", title, message })
  },

  error: (message, title = "Error") => {
    const store = useToastStore.getState()
    return store.toast({ type: "error", title, message })
  },

  warning: (message, title = "Warning") => {
    const store = useToastStore.getState()
    return store.toast({ type: "warning", title, message })
  },

  info: (message, title = "Info") => {
    const store = useToastStore.getState()
    return store.toast({ type: "info", title, message })
  },

  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  },
}))

// Convenience export for usage outside React components
export const toast = {
  success: (msg, title) => useToastStore.getState().success(msg, title),
  error: (msg, title) => useToastStore.getState().error(msg, title),
  warning: (msg, title) => useToastStore.getState().warning(msg, title),
  info: (msg, title) => useToastStore.getState().info(msg, title),
}
