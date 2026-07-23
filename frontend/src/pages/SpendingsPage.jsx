import { useState, useEffect, useCallback } from 'react'
import { spendingAPI, employeeAPI } from '@/services/api'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatRupiah, formatDate } from '@/lib/utils'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { usePermission } from '@/hooks/usePermission'
import { useToast } from '@/hooks/useToast'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function SpendingsPage() {
  const [spendings, setSpendings] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ employee_id: '', spending_date: '', value: '' })

  const { canEdit, canDelete, checkPermission } = usePermission()
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      const [spRes, empRes] = await Promise.all([
        spendingAPI.getAll(),
        employeeAPI.getAll(),
      ])
      setSpendings(spRes.data.data)
      setEmployees(empRes.data.data)
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchData() }, [fetchData])

  function openCreate() {
    if (!checkPermission('menambah pengeluaran')) return
    setSelected(null)
    setForm({ employee_id: '', spending_date: '', value: '' })
    setDialogOpen(true)
  }

  function openEdit(sp) {
    if (!checkPermission('mengedit pengeluaran')) return
    setSelected(sp)
    setForm({
      employee_id: String(sp.employee_id),
      spending_date: sp.spending_date ? sp.spending_date.split('T')[0] : '',
      value: String(sp.value),
    })
    setDialogOpen(true)
  }

  function openDelete(sp) {
    if (!checkPermission('menghapus pengeluaran')) return
    setSelected(sp)
    setDeleteDialogOpen(true)
  }

  async function handleSave() {
    try {
      const payload = { ...form, value: Number(form.value) }
      if (selected) {
        await spendingAPI.update(selected.spending_id, payload)
        toast({ title: 'Berhasil', description: 'Pengeluaran diperbarui' })
      } else {
        await spendingAPI.create(payload)
        toast({ title: 'Berhasil', description: 'Pengeluaran ditambahkan' })
      }
      setDialogOpen(false)
      await fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan', variant: 'destructive' })
    }
  }

  async function handleDelete() {
    try {
      await spendingAPI.delete(selected.spending_id)
      toast({ title: 'Berhasil', description: 'Pengeluaran dihapus' })
      setDeleteDialogOpen(false)
      await fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' })
    }
  }

  const columns = [
    { accessorKey: 'spending_id', header: 'ID', enableSorting: true },
    { accessorKey: 'employee_name', header: 'Karyawan', enableSorting: true },
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
        <span className="font-medium">{formatRupiah(row.original.value)}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {canEdit && (
            <Button variant="ghost" size="sm" onClick={() => openEdit(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {canDelete && (
            <Button variant="ghost" size="sm" onClick={() => openDelete(row.original)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div />
        {canEdit && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> Tambah Pengeluaran
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={spendings}
        searchKey="employee_name"
        searchPlaceholder="Cari pengeluaran..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}</DialogTitle>
            <DialogDescription>
              {selected ? 'Ubah data pengeluaran' : 'Masukkan data pengeluaran baru'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Karyawan</label>
              <select
                value={form.employee_id}
                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Pilih karyawan</option>
                {employees.map((e) => (
                  <option key={e.employee_id} value={e.employee_id}>
                    {e.employee_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal</label>
              <Input
                type="date"
                value={form.spending_date}
                onChange={(e) => setForm({ ...form, spending_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nilai (Rp)</label>
              <Input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengeluaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengeluaran ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
