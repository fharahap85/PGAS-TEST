import { useState, useEffect } from 'react'
import { employeeAPI, departmentAPI, spendingAPI, reportAPI } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Building2, CreditCard, DollarSign } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const summaryCards = [
  { key: 'totalEmployees', label: 'Total Karyawan', icon: Users, color: 'bg-blue-500' },
  { key: 'totalDepartments', label: 'Total Departemen', icon: Building2, color: 'bg-emerald-500' },
  { key: 'totalSpendings', label: 'Total Pengeluaran', icon: CreditCard, color: 'bg-amber-500' },
  { key: 'totalValue', label: 'Nilai Total', icon: DollarSign, color: 'bg-violet-500' },
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
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.key}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-500">{card.label}</p>
                  <p className="text-2xl font-bold text-surface-900 mt-1">
                    {card.key === 'totalValue'
                      ? formatRupiah(summary[card.key])
                      : summary[card.key]}
                  </p>
                </div>
                <div className={`rounded-lg ${card.color} p-3 text-white`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengeluaran per Departemen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  formatter={(value) => formatRupiah(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
