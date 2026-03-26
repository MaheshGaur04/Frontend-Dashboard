import type { User } from '../types/user'

export type UserSortableField = 'name' | 'company'

export function getUserSortableValue(user: User, field: UserSortableField): string {
  if (field === 'name') return user.name
  return user.company?.name ?? ''
}

export function localeCompareSafe(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true })
}

export function createUserFieldSortingFn(field: UserSortableField) {
  return (rowA: { original: User }, rowB: { original: User }, _columnId: string) => {
    const a = getUserSortableValue(rowA.original, field)
    const b = getUserSortableValue(rowB.original, field)
    return localeCompareSafe(a, b)
  }
}

