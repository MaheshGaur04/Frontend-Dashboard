import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  right?: ReactNode
  children: ReactNode
}

export default function AppShell({ title, subtitle, right, children }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-50/70 via-white to-cyan-50/70" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <div className="truncate text-xl font-semibold text-slate-900">{title}</div>
            {subtitle ? <div className="mt-1 truncate text-sm text-slate-600">{subtitle}</div> : null}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}

