import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Users, Building2, CreditCard, FileBarChart, LogOut, X,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Karyawan', icon: Users },
  { to: '/departments', label: 'Departemen', icon: Building2 },
  { to: '/spendings', label: 'Pengeluaran', icon: CreditCard },
  { to: '/reports', label: 'Laporan', icon: FileBarChart },
]

export function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    window.location.href = '/login'
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-surface-900 text-white transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-700">
          <div>
            <h1 className="text-lg font-bold tracking-tight">PGAS Solution</h1>
            <p className="text-xs text-surface-400">Sistem Manajemen</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-surface-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-surface-700 px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username || 'User'}</p>
              <p className="text-xs text-surface-400 capitalize">{user?.role || 'user'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-surface-300 transition-colors hover:bg-surface-800 hover:text-white"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}
