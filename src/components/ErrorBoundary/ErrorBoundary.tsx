import type { ReactNode } from 'react'
import React from 'react'

type Props = {
  children: ReactNode
  title?: string
}

type State = { hasError: boolean }

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-base font-semibold text-slate-900">{this.props.title ?? 'Something went wrong'}</div>
            <div className="mt-2 text-sm text-slate-600">Try refreshing the page. If the problem persists, please try again later.</div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

