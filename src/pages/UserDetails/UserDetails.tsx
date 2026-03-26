import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUsers } from '../../hooks/useUsers'
import UserCard from '../../components/UserCard/UserCard'
import { useUser } from '../../hooks/useUser'
import AppShell from '../../components/Layout/AppShell'

export default function UserDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const userId = useMemo(() => {
    const parsed = Number(id)
    return Number.isFinite(parsed) ? parsed : null
  }, [id])

  const { users, isLoading, error, refetch } = useUsers()
  const { user: fetchedUser, isLoading: isUserLoading, error: userError, refetch: refetchUser } = useUser(userId)

  const user = useMemo(() => {
    if (userId === null) return null
    return users.find((u) => u.id === userId) ?? null
  }, [users, userId])

  useEffect(() => {
    if (userId === null) return
    if (user) return
    if (fetchedUser) return
    void refetchUser()
  }, [fetchedUser, refetchUser, user, userId])

  const resolvedUser = user ?? fetchedUser
  const resolvedError = error ?? userError
  const resolvedLoading = isLoading || isUserLoading

  return (
    <AppShell
      title="User details"
      subtitle={resolvedUser ? resolvedUser.name : 'View full profile information.'}
      right={
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
        >
          Back to dashboard
        </button>
      }
    >
      {resolvedError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="text-sm font-medium text-red-800">{resolvedError}</div>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => void (error ? refetch() : refetchUser())}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-red-800 shadow-sm ring-1 ring-red-200 hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        </div>
      ) : resolvedLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
        </div>
      ) : resolvedUser ? (
        <UserCard user={resolvedUser} />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-base font-semibold text-slate-900">User not found</div>
          <div className="mt-2 text-sm text-slate-600">Please go back to the dashboard and try again.</div>
        </div>
      )}
    </AppShell>
  )
}

