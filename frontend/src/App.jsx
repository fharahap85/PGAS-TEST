import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/Layout/ProtectedRoute'
import { AppLayout } from '@/components/Layout/AppLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import EmployeesPage from '@/pages/EmployeesPage'
import DepartmentsPage from '@/pages/DepartmentsPage'
import SpendingsPage from '@/pages/SpendingsPage'
import ReportPage from '@/pages/ReportPage'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/spendings" element={<SpendingsPage />} />
        <Route path="/reports" element={<ReportPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
