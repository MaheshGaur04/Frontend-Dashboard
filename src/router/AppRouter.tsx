import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from '../pages/Dashboard/Dashboard'
import UserDetails from '../pages/UserDetails/UserDetails'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

