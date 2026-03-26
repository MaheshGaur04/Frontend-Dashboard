import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import type { User } from '../../types/user'
import { createUserFieldSortingFn, type UserSortableField } from '../../utils/sorting'
import clsx from 'clsx'
import { getAvatarColors, getInitials } from '../../utils/avatar'

type Props = {
  users: User[]
  isLoading: boolean
  onRowClick: (userId: number) => void
}

type PaginationState = {
  pageIndex: number
  pageSize: number
}

function SortingIcon({ direction }: { direction: 'asc' | 'desc' }) {
  return direction === 'asc' ? (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 3l-5 6h10l-5-6zM5 11h10v6H5v-6z" />
    </svg>
  ) : (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 17l5-6H5l5 6zM5 3h10v6H5V3z" />
    </svg>
  )
}

function getHeaderSortState(columnId: string, sorting: SortingState) {
  const entry = sorting.find((s) => s.id === columnId)
  if (!entry) return null
  if (entry.desc) return 'desc' as const
  return 'asc' as const
}

export default function UserTable({ users, isLoading, onRowClick }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const columns = useMemo<ColumnDef<User>[]>(() => {
    const makeSortingFn = (field: UserSortableField) => createUserFieldSortingFn(field)

    return [
      {
        header: 'Name',
        accessorFn: (row) => row.name,
        id: 'name',
        sortingFn: makeSortingFn('name'),
        enableSorting: true,
        cell: ({ row }) => {
          const name = row.original.name
          const initials = getInitials(name)
          const colors = getAvatarColors(name)

          return (
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                style={{ backgroundColor: colors.bg, color: colors.fg }}
                aria-hidden="true"
              >
                {initials}
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium text-slate-900">{name}</div>
                <div className="truncate text-xs text-slate-500">@{row.original.username}</div>
              </div>
            </div>
          )
        }
      },
      {
        header: 'Email',
        accessorFn: (row) => row.email,
        id: 'email',
        enableSorting: false,
        cell: ({ getValue }) => <span className="break-words">{getValue<string>()}</span>
      },
      {
        header: 'Phone',
        accessorFn: (row) => row.phone,
        id: 'phone',
        enableSorting: false,
        cell: ({ getValue }) => <span>{getValue<string>()}</span>
      },
      {
        header: 'Company',
        accessorFn: (row) => row.company?.name ?? '',
        id: 'company',
        sortingFn: makeSortingFn('company'),
        enableSorting: true,
        cell: ({ getValue }) => <span>{getValue<string>() || '-'}</span>
      }
    ]
  }, [])

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }, [users.length])

  const pageCount = table.getPageCount()
  const { pageIndex, pageSize } = pagination
  const total = users.length
  const start = total === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min(total, (pageIndex + 1) * pageSize)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">Users</div>
        <div className="text-xs text-slate-500">Tip: click a row to view details</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.isPlaceholder) return null
                  const columnId = header.column.id
                  const sortState = getHeaderSortState(columnId, sorting)
                  const canSort = header.column.getCanSort()

                  return (
                    <th key={header.id} className="px-4 py-3 font-semibold text-slate-700">
                      {canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="group inline-flex items-center gap-2 rounded-md px-1 py-1 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
                          aria-label={`Sort by ${String(header.column.columnDef.header)}`}
                        >
                          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          {sortState ? (
                            <SortingIcon direction={sortState} />
                          ) : (
                            <span className="opacity-50 group-hover:opacity-100">
                              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M10 3l6 7H4l6-7zM4 11h12l-6 7-6-7z" />
                              </svg>
                            </span>
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: pagination.pageSize }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="border-t border-slate-100">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200" />
                      <div className="space-y-2">
                        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                        <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-60 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
                  </td>
                </tr>
              ))
            ) : total === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-600">
                  No results
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={clsx(
                    'cursor-pointer border-t border-slate-100 transition-colors',
                    'hover:bg-slate-50 focus-within:bg-slate-50'
                  )}
                  onClick={() => onRowClick(row.original.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onRowClick(row.original.id)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-600">
          {isLoading ? 'Loading...' : total === 0 ? '0 users' : `Showing ${start}-${end} of ${total}`}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span className="hidden sm:inline">Rows</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const next = Number(e.target.value)
                setPagination({ pageIndex: 0, pageSize: next })
              }}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-700">
              Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

