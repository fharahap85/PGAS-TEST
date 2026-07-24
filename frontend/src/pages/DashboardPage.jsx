import { useState, useEffect } from 'react'
import { employeeAPI, departmentAPI, spendingAPI, reportAPI } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, CreditCard, Wallet, TrendingUp } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const summaryCards = [
  { key: 'totalEmployees', label: 'Total Karyawan', icon: Users, gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
  { key: 'totalDepartments', label: 'Total Departemen', icon: Building2, gradient: 'from-emerald-400 to-teal-600', shadow: 'shadow-emerald-500/20' },
  { key: 'totalSpendings', label: 'Transaksi Pengeluaran', icon: CreditCard, gradient: 'from-amber-400 to-orange-600', shadow: 'shadow-amber-500/20' },
  { key: 'totalValue', label: 'Total Nilai Anggaran', icon: Wallet, gradient: 'from-violet-500 to-purple-700', shadow: 'shadow-violet-500/20' },
]

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [employees, departments, spendings, report] = await Promise.all([
          employeeAPI.getAll(),
          departmentAPI.getAll(),
          spendingAPI.getAll(),
          reportAPI.getSpendings({ limit: 10000 }),
        ])

        const totalValue = spendings.data.data.reduce((sum, s) => sum + Number(s.value), 0)

        setSummary({
          totalEmployees: employees.data.data.length,
          totalDepartments: departments.data.data.length,
          totalSpendings: spendings.data.data.length,
          totalValue,
        })

        const deptMap = {}
        departments.data.data.forEach((d) => {
          deptMap[d.department_id] = d.department_name
        })

        const deptTotals = {}
        report.data.data.forEach((r) => {
          const name = r.department_name || deptMap[r.department_id] || 'Unknown'
          deptTotals[name] = (deptTotals[name] || 0) + Number(r.value)
        })

        setChartData(
          Object.entries(deptTotals).map(([name, value]) => ({
            name,
            value,
          }))
        )
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-600 border-t-transparent shadow-md" />
          <p className="text-sm font-semibold text-surface-500">Memuat Ringkasan Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 text-white shadow-xl shadow-primary-950/10">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary-300">Ringkasan Eksekutif</span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-white">Selamat Datang di PGAS Solution</h1>
          <p className="text-sm text-primary-200 mt-1">Pantau seluruh operasional, departemen, dan alokasi anggaran secara real-time.</p>
        </div>
        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shrink-0">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-semibold text-primary-100">Sistem Aktif & Terpantau</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.key} className="glass-card border-none rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-surface-500 tracking-wide uppercase">{card.label}</p>
                  <p className="text-2xl font-extrabold text-surface-900 tracking-tight">
                    {card.key === 'totalValue'
                      ? formatRupiah(summary[card.key])
                      : summary[card.key]}
                  </p>
                </div>
                <div className={`rounded-xl bg-gradient-to-br ${card.gradient} p-3 text-white shadow-lg ${card.shadow} shrink-0`}>
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="glass-card border-none rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="border-b border-surface-200/50 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-surface-900 tracking-tight">Pengeluaran per Departemen</CardTitle>
              <p className="text-xs text-surface-500 mt-1">Visualisasi grafik distribusi anggaran belanja departemen terkait.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f1" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#647b99', fontWeight: 500 }} 
                  stroke="#cbd6e2" 
                  dy={10}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#647b99', fontWeight: 500 }} 
                  stroke="#cbd6e2" 
                  dx={-5}
                  tickFormatter={(val) => `Rp ${val / 1000000}M`}
                />
                <Tooltip
                  formatter={(value) => [formatRupiah(value), 'Total Pengeluaran']}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    fontFamily: 'inherit',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" fill="url(#colorBar)" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6375eb" stopOpacity={1} />
                      <stop offset="95%" stopColor="#4a54e1" stopOpacity={0.85} />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
