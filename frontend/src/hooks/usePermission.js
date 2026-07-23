import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

export function usePermission() {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()

  const canEdit = isAdmin
  const canDelete = isAdmin

  function checkPermission(action = 'melakukan aksi ini') {
    if (!isAdmin) {
      toast({
        title: 'Akses Ditolak',
        description: `Akses ditolak: Hanya Admin yang dapat ${action}.`,
        variant: 'destructive',
      })
      return false
    }
    return true
  }

  return {
    isAdmin,
    canEdit,
    canDelete,
    checkPermission,
    role: user?.role || 'user',
  }
}
