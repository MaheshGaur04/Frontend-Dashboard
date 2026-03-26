import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import type { User } from '../types/user'
import { fetchUsers } from '../services/api'

let usersCache: User[] | null = null
let usersPromise: Promise<User[]> | null = null

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data ? 'Failed to load users.' : error.message
  }
  return error instanceof Error ? error.message : 'Failed to load users.'
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>(usersCache ?? [])
  const [isLoading, setIsLoading] = useState<boolean>(usersCache === null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!usersPromise) {
        usersPromise = fetchUsers()
          .then((data) => {
            usersCache = data
            return data
          })
          .finally(() => {
            usersPromise = null
          })
      }

      const data = await usersPromise
      setUsers(data)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (usersCache) return
    void load()
  }, [load])

  const refetch = useCallback(async () => {
    usersCache = null
    usersPromise = null
    await load()
  }, [load])

  return { users, isLoading, error, refetch }
}

