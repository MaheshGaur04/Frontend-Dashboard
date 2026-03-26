import clsx from 'clsx'

type Props = {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  className?: string
  placeholder?: string
}

export default function SearchBar({
  value,
  onChange,
  onClear,
  className,
  placeholder = 'Search by name or email...'
}: Props) {
  return (
    <div className={clsx('w-full', className)}>
      <label className="block text-sm font-medium text-slate-700">Search</label>
      <div className="relative mt-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 21l-4.3-4.3m1.8-5.4a7.6 7.6 0 11-15.2 0 7.6 7.6 0 0115.2 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />

        {value ? (
          <button
            type="button"
            onClick={() => (onClear ? onClear() : onChange(''))}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700"
            aria-label="Clear search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  )
}

