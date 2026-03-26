type AvatarColors = { bg: string; fg: string }

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]?.[0] ?? '?'
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''
  return `${first}${last}`.toUpperCase()
}

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  return hash
}

export function getAvatarColors(seed: string): AvatarColors {
  const palette = ['#0f766e', '#1d4ed8', '#7c3aed', '#047857', '#b45309', '#dc2626', '#0891b2', '#4f46e5']
  const index = hashString(seed) % palette.length
  return { bg: palette[index] ?? '#1f2937', fg: '#ffffff' }
}

