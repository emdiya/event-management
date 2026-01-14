export function logError(message: string, error: unknown) {
  console.error(`[Error] ${message}:`, error)
  if (error instanceof Error) {
    console.error(`Stack: ${error.stack}`)
  }
}

export function logInfo(message: string, data?: unknown) {
  console.log(`[Info] ${message}:`, data || "")
}

export function logDebug(message: string, data?: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.debug(`[Debug] ${message}:`, data || "")
  }
}
