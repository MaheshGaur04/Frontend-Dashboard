import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar/SearchBar'
import UserTable from '../../components/UserTable/UserTable'
import { useUsers } from '../../hooks/useUsers'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import AppShell from '../../components/Layout/AppShell'

export default function Dashboard() {
  const navigate = useNavigate()
  const { users, isLoading, error, refetch } = useUsers()

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 150)

  const filteredUsers = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    if (!q) return users

    return users.filter((u) => {
      const name = u.name.toLowerCase()
      const email = u.email.toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [users, debouncedSearch])

  return (
    <AppShell title="User Directory Dashboard" subtitle="Search, sort, and explore users.">
      <div className="grid gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <SearchBar value={searchInput} onChange={setSearchInput} onClear={() => setSearchInput('')} />
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                {isLoading ? 'Loading…' : `${filteredUsers.length} / ${users.length}`}
              </div>
              {searchInput ? (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Reset
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="text-sm font-medium text-red-800">{error}</div>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-red-800 shadow-sm ring-1 ring-red-200 hover:bg-red-100"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/50 p-0.5">
            <UserTable users={filteredUsers} isLoading={isLoading} onRowClick={(id) => navigate(`/users/${id}`)} />
          </div>
        )}
      </div>
    </AppShell>
  )
}

