import { useState, useEffect, useCallback } from 'react'
import { reportAPI } from '@/services/api'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRupiah, formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { FileSpreadsheet, FileText, Wallet, CreditCard, TrendingUp, Building2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts'

const months = [
  { value: '', label: 'Semua Bulan' },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: new Date(2020, i).toLocaleDateString('id-ID', { month: 'long' }),
  })),
]

const years = [
  { value: '', label: 'Semua Tahun' },
  ...Array.from({ length: 6 }, (_, i) => ({
    value: String(2020 + i),
    label: String(2020 + i),
  })),
]

export default function ReportPage() {
  const [data, setData] = useState([])
  const [_loading, _setLoading] = useState(true)
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [valueRange, setValueRange] = useState([0, 100000000])
  const [minInput, setMinInput] = useState('0')
  const [maxInput, setMaxInput] = useState('100000000')

  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    _setLoading(true)
    try {
      const params = {}
      if (year) params.year = year
      if (month) params.month = month
      if (valueRange[0] > 0) params.minValue = valueRange[0]
      if (valueRange[1] < 100000000) params.maxValue = valueRange[1]

      const res = await reportAPI.getSpendings(params)
      setData(res.data.data)
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat laporan', variant: 'destructive' })
    } finally {
      _setLoading(false)
    }
  }, [year, month, valueRange, toast])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleExport(type) {
    try {
      const params = {}
      if (year) params.year = year
      if (month) params.month = month
      if (valueRange[0] > 0) params.minValue = valueRange[0]
      if (valueRange[1] < 100000000) params.maxValue = valueRange[1]

      const apiCall = type === 'excel' ? reportAPI.exportExcel : reportAPI.exportPdf
      const res = await apiCall(params)

      const blob = new Blob([res.data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `laporan-pengeluaran.${type === 'excel' ? 'xlsx' : 'pdf'}`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast({ title: 'Error', description: 'Gagal mengexport', variant: 'destructive' })
    }
  }

  const deptTotals = {}
  const yearTotals = {}
  const monthTotals = {}
  data.forEach((r) => {
    const name = r.department_name || 'Unknown'
    deptTotals[name] = (deptTotals[name] || 0) + Number(r.value)

    const y = r.year || new Date(r.spending_date).getFullYear()
    yearTotals[y] = (yearTotals[y] || 0) + Number(r.value)
  })

  const deptChart = Object.entries(deptTotals).map(([name, value]) => ({ name, value }))
  const yearChart = Object.entries(yearTotals)
    .sort(([a], [b]) => a - b)
    .map(([year, value]) => ({ year, value }))

  const totalValue = data.reduce((sum, r) => sum + Number(r.value), 0)

  const columns = [
    { accessorKey: 'employee_name', header: 'Nama Karyawan', enableSorting: true },
    { accessorKey: 'department_name', header: 'Departemen', enableSorting: true },
    {
      accessorKey: 'spending_date',
      header: 'Tanggal',
      enableSorting: true,
      cell: ({ row }) => formatDate(row.original.spending_date),
    },
    {
      accessorKey: 'value',
      header: 'Nilai',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-semibold text-surface-900">{formatRupiah(row.original.value)}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700">Tahun</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {years.map((y) => (
                  <option key={y.value} value={y.value}>{y.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700">Bulan</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700">Nilai Min</label>
              <Input
                type="number"
                value={minInput}
                onChange={(e) => {
                  setMinInput(e.target.value)
                  setValueRange([Number(e.target.value) || 0, valueRange[1]])
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700">Nilai Max</label>
              <Input
                type="number"
                value={maxInput}
                onChange={(e) => {
                  setMaxInput(e.target.value)
                  setValueRange([valueRange[0], Number(e.target.value) || 100000000])
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-700">
              Range Nilai: {formatRupiah(valueRange[0])} — {formatRupiah(valueRange[1])}
            </label>
            <Slider
              value={valueRange}
              onValueChange={(v) => {
                setValueRange(v)
                setMinInput(String(v[0]))
                setMaxInput(String(v[1]))
              }}
              min={0}
              max={100000000}
              step={100000}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileText className="h-4 w-4 mr-2" /> Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 text-white shadow-lg shadow-blue-500/20">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-surface-500 tracking-wide uppercase">Transaksi</p>
              <p className="text-xl font-extrabold text-surface-900">{data.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-3 text-white shadow-lg shadow-emerald-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-surface-500 tracking-wide uppercase">Total Nilai</p>
              <p className="text-xl font-extrabold text-surface-900">{formatRupiah(totalValue)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 p-3 text-white shadow-lg shadow-amber-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-surface-500 tracking-wide uppercase">Departemen</p>
              <p className="text-xl font-extrabold text-surface-900">{Object.keys(deptTotals).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 p-3 text-white shadow-lg shadow-violet-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-surface-500 tracking-wide uppercase">Tahun</p>
              <p className="text-xl font-extrabold text-surface-900">{yearChart.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Pengeluaran per Departemen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChart} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f1" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#647b99' }} dy={10} />
<YAxis tick={{ fontSize: 11, fill: '#647b99' }} tickFormatter={(v) => `Rp ${v / 1000000}Jt`} />
                  <Tooltip formatter={(v) => [formatRupiah(v), 'Total']} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Tren Pengeluaran per Tahun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearChart} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f1" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#647b99' }} dy={10} />
<YAxis tick={{ fontSize: 11, fill: '#647b99' }} tickFormatter={(v) => `Rp ${v / 1000000}Jt`} />
                  <Tooltip formatter={(v) => [formatRupiah(v), 'Total']} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={data}
      />
    </div>
  )
}
