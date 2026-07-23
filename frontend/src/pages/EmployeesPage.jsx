import { useState, useEffect, useCallback } from 'react'
import { employeeAPI, departmentAPI } from '@/services/api'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { usePermission } from '@/hooks/usePermission'
import { useToast } from '@/hooks/useToast'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ employee_name: '', department_id: '' })

  const { canEdit, canDelete, checkPermission } = usePermission()
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      const [empRes, deptRes] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
      ])
      setEmployees(empRes.data.data)
      setDepartments(deptRes.data.data)
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchData() }, [fetchData])

  function openCreate() {
    if (!checkPermission('menambah karyawan')) return
    setSelected(null)
    setForm({ employee_name: '', department_id: '' })
    setDialogOpen(true)
  }

  function openEdit(emp) {
    if (!checkPermission('mengedit karyawan')) return
    setSelected(emp)
    setForm({ employee_name: emp.employee_name, department_id: String(emp.department_id) })
    setDialogOpen(true)
  }

  function openDelete(emp) {
    if (!checkPermission('menghapus karyawan')) return
    setSelected(emp)
    setDeleteDialogOpen(true)
  }

  async function handleSave() {
    try {
      if (selected) {
        await employeeAPI.update(selected.employee_id, form)
        toast({ title: 'Berhasil', description: 'Karyawan diperbarui' })
      } else {
        await employeeAPI.create(form)
        toast({ title: 'Berhasil', description: 'Karyawan ditambahkan' })
      }
      setDialogOpen(false)
      await fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan', variant: 'destructive' })
    }
  }

  async function handleDelete() {
    try {
      await employeeAPI.delete(selected.employee_id)
      toast({ title: 'Berhasil', description: 'Karyawan dihapus' })
      setDeleteDialogOpen(false)
      await fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' })
    }
  }

  const columns = [
    { accessorKey: 'employee_id', header: 'ID', enableSorting: true },
    { accessorKey: 'employee_name', header: 'Nama Karyawan', enableSorting: true },
    {
      accessorKey: 'department_name',
      header: 'Departemen',
      enableSorting: true,
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.department_name || '-'}</Badge>
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
            <Plus className="h-4 w-4 mr-2" /> Tambah Karyawan
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={employees}
        searchKey="employee_name"
        searchPlaceholder="Cari karyawan..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Karyawan' : 'Tambah Karyawan'}</DialogTitle>
            <DialogDescription>
              {selected ? 'Ubah data karyawan' : 'Masukkan data karyawan baru'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Karyawan</label>
              <Input
                value={form.employee_name}
                onChange={(e) => setForm({ ...form, employee_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Departemen</label>
              <select
                value={form.department_id}
                onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">Pilih departemen</option>
                {departments.map((d) => (
                  <option key={d.department_id} value={d.department_id}>
                    {d.department_name}
                  </option>
                ))}
              </select>
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
            <AlertDialogTitle>Hapus Karyawan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selected?.employee_name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
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
