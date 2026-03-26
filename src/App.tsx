import AppRouter from './router/AppRouter'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary title="App error">
      <AppRouter />
    </ErrorBoundary>
  )
}

