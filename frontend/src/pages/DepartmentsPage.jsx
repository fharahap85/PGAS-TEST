import { useState, useEffect, useCallback } from 'react'
import { departmentAPI } from '@/services/api'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { usePermission } from '@/hooks/usePermission'
import { useToast } from '@/hooks/useToast'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ department_name: '' })

  const { canEdit, canDelete, checkPermission } = usePermission()
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      const res = await departmentAPI.getAll()
      setDepartments(res.data.data)
    } catch {
      toast({ title: 'Error', description: 'Gagal memuat data', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchData() }, [fetchData])

  function openCreate() {
    if (!checkPermission('menambah departemen')) return
    setSelected(null)
    setForm({ department_name: '' })
    setDialogOpen(true)
  }

  function openEdit(dept) {
    if (!checkPermission('mengedit departemen')) return
    setSelected(dept)
    setForm({ department_name: dept.department_name })
    setDialogOpen(true)
  }

  function openDelete(dept) {
    if (!checkPermission('menghapus departemen')) return
    setSelected(dept)
    setDeleteDialogOpen(true)
  }

  async function handleSave() {
    try {
      if (selected) {
        await departmentAPI.update(selected.department_id, form)
        toast({ title: 'Berhasil', description: 'Departemen diperbarui' })
      } else {
        await departmentAPI.create(form)
        toast({ title: 'Berhasil', description: 'Departemen ditambahkan' })
      }
      setDialogOpen(false)
      await fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menyimpan', variant: 'destructive' })
    }
  }

  async function handleDelete() {
    try {
      await departmentAPI.delete(selected.department_id)
      toast({ title: 'Berhasil', description: 'Departemen dihapus' })
      setDeleteDialogOpen(false)
      await fetchData()
    } catch {
      toast({ title: 'Error', description: 'Gagal menghapus', variant: 'destructive' })
    }
  }

  const columns = [
    { id: 'no', header: 'No', cell: ({ row }) => row.index + 1 },
    { accessorKey: 'department_name', header: 'Nama Departemen', enableSorting: true },
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
            <Plus className="h-4 w-4 mr-2" /> Tambah Departemen
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={departments}
        searchKey="department_name"
        searchPlaceholder="Cari departemen..."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit Departemen' : 'Tambah Departemen'}</DialogTitle>
            <DialogDescription>
              {selected ? 'Ubah nama departemen' : 'Masukkan nama departemen baru'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Departemen</label>
              <Input
                value={form.department_name}
                onChange={(e) => setForm({ department_name: e.target.value })}
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
            <AlertDialogTitle>Hapus Departemen</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selected?.department_name}</strong>?
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
