'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteTransaction } from '@/actions/transactions'

interface Props {
  id:      string | null
  onClose: () => void
}

export function DeleteConfirm({ id, onClose }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!id) return
    startTransition(async () => {
      const result = await deleteTransaction(id)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Transação excluída.')
        onClose()
      }
    })
  }

  return (
    <AlertDialog open={!!id} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
