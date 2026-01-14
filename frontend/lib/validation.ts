export function validateEventData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title || data.title.trim().length === 0) {
    errors.push("Event title is required")
  }

  if (!data.date) {
    errors.push("Event date is required")
  }

  if (!data.location || data.location.trim().length === 0) {
    errors.push("Event location is required")
  }

  if (data.max_capacity && data.max_capacity < 1) {
    errors.push("Max capacity must be greater than 0")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateAttendeeData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Name is required")
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Valid email is required")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
