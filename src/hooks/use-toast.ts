"use client"

// Inspired by react-hot-toast library
import { useState, useEffect, type ReactNode } from "react"

export type ToastProps = {
  id: string
  title?: string
  description?: ReactNode
  action?: ReactNode
  variant?: "default" | "destructive"
  onDismiss?: () => void
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000
type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: ReactNode
  action?: ReactNode
  variant?: "default" | "destructive"
  onDismiss?: () => void
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// type ToastActionType = (props: ToastProps) => void

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const listeners: Array<(toasts: ToasterToast[]) => void> = []

let toasts: ToasterToast[] = []

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

function dispatch(action: {
  type: "ADD_TOAST" | "UPDATE_TOAST" | "DISMISS_TOAST" | "REMOVE_TOAST"
  toast?: ToasterToast
  toastId?: string
}) {
  switch (action.type) {
    case "ADD_TOAST":
      if (action.toast) {
        toasts = [action.toast, ...toasts].slice(0, TOAST_LIMIT)
      }
      break

    case "UPDATE_TOAST":
      if (action.toast) {
        toasts = toasts.map((t) => (t.id === action.toast?.id ? { ...t, ...action.toast } : t))
      }
      break

    case "DISMISS_TOAST": {
      if (action.toastId) {
        addToRemoveQueue(action.toastId)
      } else {
        toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }
      break
    }

    case "REMOVE_TOAST":
      if (action.toastId) {
        toasts = toasts.filter((t) => t.id !== action.toastId)
      }
      break
  }

  listeners.forEach((listener) => {
    listener(toasts)
  })
}

function toast(props: Omit<ToasterToast, "id">) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      onDismiss: dismiss,
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}

function useToast() {
  const [toastState, setToastState] = useState<ToasterToast[]>([])

  useEffect(() => {
    listeners.push(setToastState)
    return () => {
      const index = listeners.indexOf(setToastState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    toast,
    toasts: toastState,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
