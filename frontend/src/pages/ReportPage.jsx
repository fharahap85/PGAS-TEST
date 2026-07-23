import { useState, useEffect, useCallback } from 'react'
import { reportAPI } from '@/services/api'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent } from '@/components/ui/card'
import { formatRupiah, formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { FileSpreadsheet, FileText } from 'lucide-react'

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

      <DataTable
        columns={columns}
        data={data}
      />
    </div>
  )
}
