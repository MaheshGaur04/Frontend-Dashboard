import { useMemo, useState } from 'react'
import type { User } from '../../types/user'
import clsx from 'clsx'
import { getAvatarColors, getInitials } from '../../utils/avatar'

type Props = {
  user: User
}

export default function UserCard({ user }: Props) {
  const initials = useMemo(() => getInitials(user.name), [user.name])
  const colors = useMemo(() => getAvatarColors(user.name), [user.name])
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(user.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold"
            style={{ backgroundColor: colors.bg, color: colors.fg }}
            aria-hidden="true"
          >
            {initials}
          </div>

          <div>
            <div className="text-2xl font-semibold text-slate-900">{user.name}</div>
            <div className="mt-1 text-sm text-slate-600">@{user.username}</div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:justify-end">
          <div className="flex items-center gap-3">
            <div className="w-28 text-sm font-medium text-slate-700">Email</div>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate text-sm text-slate-900">{user.email}</span>
              <button
                type="button"
                onClick={copyEmail}
                className={clsx(
                  'rounded-xl border px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200',
                  copied
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                )}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-28 text-sm font-medium text-slate-700">Phone</div>
            <div className="text-sm text-slate-900">{user.phone}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-28 text-sm font-medium text-slate-700">Website</div>
            <a
              className="truncate text-sm text-blue-700 hover:underline"
              href={`https://${user.website}`}
              target="_blank"
              rel="noreferrer"
            >
              {user.website}
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-t border-slate-200 p-5 sm:p-7 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="text-lg font-semibold text-slate-900">Company</div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="space-y-2 text-sm text-slate-800">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</div>
                <div className="font-medium">{user.company.name}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Catchphrase</div>
                <div className="break-words">{user.company.catchPhrase}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">BS</div>
                <div className="break-words">{user.company.bs}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-lg font-semibold text-slate-900">Address</div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="grid gap-4 text-sm text-slate-800 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Street</div>
                <div className="break-words">{user.address.street}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Suite</div>
                <div className="break-words">{user.address.suite}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">City</div>
                <div className="break-words">{user.address.city}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Zipcode</div>
                <div className="break-words">{user.address.zipcode}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Geo location</div>
                <div className="break-words">
                  {user.address.geo.lat}, {user.address.geo.lng}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

