import { useState, useEffect } from 'react'
import { employeeAPI, departmentAPI, spendingAPI, reportAPI } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRupiah, formatDate } from '@/lib/utils'

const queries = [
  {
    id: 'select-all',
    title: '1. Seluruh Data',
    sql: `-- Seluruh data departments
SELECT * FROM departments;

-- Seluruh data employees
SELECT * FROM employees;

-- Seluruh data spendings
SELECT * FROM spendings;`,
    load: async () => {
      const [depts, emps, spends] = await Promise.all([
        departmentAPI.getAll(),
        employeeAPI.getAll(),
        spendingAPI.getAll(),
      ])
      return { departments: depts.data.data, employees: emps.data.data, spendings: spends.data.data }
    },
  },
  {
    id: 'join',
    title: '2. JOIN 3 Tabel',
    sql: `SELECT
    e.employee_name AS 'Employee Name',
    d.department_name AS 'Department Name',
    s.spending_date AS 'Spending Date',
    s.value AS 'Spending Value'
FROM spendings s
INNER JOIN employees e ON s.employee_id = e.employee_id
INNER JOIN departments d ON e.department_id = d.department_id;`,
    load: async () => {
      const res = await reportAPI.getSpendings({ limit: 10000 })
      return { joined: res.data.data }
    },
  },
  {
    id: 'sorted',
    title: '3. ORDER BY value ASC',
    sql: `SELECT
    e.employee_name AS 'Employee Name',
    d.department_name AS 'Department Name',
    s.spending_date AS 'Spending Date',
    s.value AS 'Spending Value'
FROM spendings s
INNER JOIN employees e ON s.employee_id = e.employee_id
INNER JOIN departments d ON e.department_id = d.department_id
ORDER BY s.value ASC;`,
    load: async () => {
      const res = await reportAPI.getSpendings({ sortBy: 'value', sortOrder: 'ASC', limit: 10000 })
      return { sorted: res.data.data }
    },
  },
  {
    id: 'filtered',
    title: '4. Laporan Filter (2020-2025)',
    sql: `SELECT
    e.employee_name, d.department_name,
    s.spending_date, s.value,
    YEAR(s.spending_date) AS 'Year',
    MONTHNAME(s.spending_date) AS 'Month'
FROM spendings s
INNER JOIN employees e ON s.employee_id = e.employee_id
INNER JOIN departments d ON e.department_id = d.department_id
WHERE
    YEAR(s.spending_date) BETWEEN 2020 AND 2025
    AND s.value BETWEEN 100000 AND 1000000
ORDER BY s.spending_date ASC;`,
    load: async () => {
      const res = await reportAPI.getSpendings({ year: '', month: '', minValue: 100000, maxValue: 1000000, sortBy: 'spending_date', sortOrder: 'ASC', limit: 10000 })
      return { filtered: res.data.data }
    },
  },
]

export default function DatabaseQueriesPage() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAll() {
      const result = {}
      for (const q of queries) {
        result[q.id] = await q.load()
      }
      setData(result)
      setLoading(false)
    }
    loadAll()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 text-white shadow-xl">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary-300">Test Database</span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-white">SQL Query Results</h1>
          <p className="text-sm text-primary-200 mt-1">Hasil eksekusi bare query sesuai soal test.</p>
        </div>
      </div>

      {queries.map((q) => {
        const qData = data[q.id]
        return (
          <Card key={q.id} className="rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="border-b border-surface-200/50 pb-5">
              <CardTitle className="text-lg font-bold text-surface-900">{q.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-surface-950 rounded-xl p-4 overflow-x-auto">
                <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{q.sql}</pre>
              </div>

              {q.id === 'select-all' && (
                <div className="space-y-6">
                  {['departments', 'employees', 'spendings'].map((t) => (
                    <div key={t}>
                      <h4 className="text-sm font-bold text-surface-600 uppercase tracking-wide mb-2">Table: {t}</h4>
                      <div className="overflow-x-auto rounded-xl border border-surface-200">
                        <table className="w-full text-sm">
                          <thead className="bg-surface-100">
                            <tr>
                              {Object.keys(qData[t]?.[0] || {}).map((k) => (
                                <th key={k} className="px-4 py-2.5 text-left font-semibold text-surface-700">{k}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {qData[t]?.slice(0, 10).map((row, i) => (
                              <tr key={i} className="border-t border-surface-100 hover:bg-surface-50">
                                {Object.values(row).map((v, j) => (
                                  <td key={j} className="px-4 py-2 text-surface-700">{v ?? '-'}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-surface-400 mt-1">Menampilkan 10 dari {qData[t]?.length || 0} records</p>
                    </div>
                  ))}
                </div>
              )}

              {q.id === 'join' && (
                <div className="overflow-x-auto rounded-xl border border-surface-200">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-100">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">Employee Name</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">Department Name</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">Spending Date</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-surface-700">Spending Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qData?.joined?.slice(0, 15).map((row, i) => (
                        <tr key={i} className="border-t border-surface-100 hover:bg-surface-50">
                          <td className="px-4 py-2 font-medium text-surface-900">{row.employee_name}</td>
                          <td className="px-4 py-2 text-surface-700">{row.department_name}</td>
                          <td className="px-4 py-2 text-surface-700">{formatDate(row.spending_date)}</td>
                          <td className="px-4 py-2 text-right font-semibold text-surface-900">{formatRupiah(row.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-surface-400 px-4 py-2 border-t border-surface-100">
                    Menampilkan 15 dari {qData?.joined?.length || 0} records
                  </p>
                </div>
              )}

              {q.id === 'sorted' && (
                <div className="overflow-x-auto rounded-xl border border-surface-200">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-100">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">#</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">Employee Name</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">Department Name</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">Spending Date</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-surface-700">Spending Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qData?.sorted?.slice(0, 15).map((row, i) => (
                        <tr key={i} className="border-t border-surface-100 hover:bg-surface-50">
                          <td className="px-4 py-2 text-surface-400">{i + 1}</td>
                          <td className="px-4 py-2 font-medium text-surface-900">{row.employee_name}</td>
                          <td className="px-4 py-2 text-surface-700">{row.department_name}</td>
                          <td className="px-4 py-2 text-surface-700">{formatDate(row.spending_date)}</td>
                          <td className="px-4 py-2 text-right font-semibold text-surface-900">{formatRupiah(row.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-surface-400 px-4 py-2 border-t border-surface-100">
                    Diurutkan dari terkecil ke terbesar — 15 dari {qData?.sorted?.length || 0} records
                  </p>
                </div>
              )}

              {q.id === 'filtered' && (
                <div className="overflow-x-auto rounded-xl border border-surface-200">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-100">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">Employee</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">Department</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">Date</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-surface-700">Value</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">Year</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-surface-700">Month</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qData?.filtered?.slice(0, 15).map((row, i) => (
                        <tr key={i} className="border-t border-surface-100 hover:bg-surface-50">
                          <td className="px-4 py-2 font-medium text-surface-900">{row.employee_name}</td>
                          <td className="px-4 py-2 text-surface-700">{row.department_name}</td>
                          <td className="px-4 py-2 text-surface-700">{formatDate(row.spending_date)}</td>
                          <td className="px-4 py-2 text-right font-semibold text-surface-900">{formatRupiah(row.value)}</td>
                          <td className="px-4 py-2 text-surface-700">{row.year || new Date(row.spending_date).getFullYear()}</td>
                          <td className="px-4 py-2 text-surface-700">{new Date(row.spending_date).toLocaleString('id-ID', { month: 'long' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-surface-400 px-4 py-2 border-t border-surface-100">
                    Filter: 2020-2025, value Rp100.000 — Rp1.000.000 — 15 dari {qData?.filtered?.length || 0} records
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}