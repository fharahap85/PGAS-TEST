import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Users, Building2, CreditCard, FileBarChart, LogOut, X, ShieldCheck
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-full w-64 flex-col premium-sidebar text-slate-100 transition-transform duration-300 lg:static lg:translate-x-0 border-r border-slate-800/50',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-600/35">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white leading-none">PGAS Solution</h1>
              <p className="text-[10px] text-slate-400 mt-1 font-medium tracking-wide uppercase">Data System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-600/20'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer / User Profile */}
        <div className="border-t border-slate-800/60 p-4 space-y-3 bg-slate-950/20">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-800/20 border border-slate-800/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white font-extrabold shadow-inner">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-white leading-tight">{user?.username || 'User'}</p>
              <p className="text-[10px] text-slate-400 capitalize mt-0.5 tracking-wider">{user?.role || 'user'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}
