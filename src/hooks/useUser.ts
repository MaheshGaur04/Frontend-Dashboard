import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import type { User } from '../types/user'
import { fetchUserById } from '../services/api'

const cache = new Map<number, User>()
const inFlight = new Map<number, Promise<User>>()

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data ? 'Failed to load user.' : error.message
  }
  return error instanceof Error ? error.message : 'Failed to load user.'
}

export function useUser(userId: number | null) {
  const cached = useMemo(() => (userId ? cache.get(userId) ?? null : null), [userId])
  const [user, setUser] = useState<User | null>(cached)
  const [isLoading, setIsLoading] = useState<boolean>(userId !== null && cached === null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (userId === null) return

    setIsLoading(true)
    setError(null)

    try {
      const existing = inFlight.get(userId)
      const promise =
        existing ??
        fetchUserById(userId).finally(() => {
          inFlight.delete(userId)
        })

      inFlight.set(userId, promise)

      const data = await promise
      cache.set(userId, data)
      setUser(data)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId === null) return
    if (cache.has(userId)) return
    void load()
  }, [load, userId])

  const refetch = useCallback(async () => {
    if (userId === null) return
    cache.delete(userId)
    inFlight.delete(userId)
    await load()
  }, [load, userId])

  return { user, isLoading, error, refetch }
}

