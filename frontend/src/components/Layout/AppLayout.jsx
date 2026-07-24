import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/Layout/Sidebar'
import { Header } from '@/components/Layout/Header'
import { Toaster } from '@/components/ui/toaster'

const pageTitles = {
  '/dashboard': 'Dashboard Ringkasan',
  '/employees': 'Manajemen Data Karyawan',
  '/departments': 'Daftar Departemen & Divisi',
  '/spendings': 'Rekapitulasi Pengeluaran',
  '/reports': 'Laporan Analitik Pengeluaran',
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'PGAS Solution'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-tr from-slate-50 via-slate-100/30 to-white/70">
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
