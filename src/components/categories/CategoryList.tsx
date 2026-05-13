'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2, Tag } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteCategory } from '@/actions/categories'
import { CategoryForm } from './CategoryForm'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
}

const typeLabel: Record<string, string> = {
  income:  'Receita',
  expense: 'Despesa',
  both:    'Ambos',
}

export function CategoryList({ categories }: Props) {
  const [editCat,   setEditCat]   = useState<Category | null>(null)
  const [deleteId,  setDeleteId]  = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteCategory(deleteId)
      if (result?.error) toast.error(result.error)
      else toast.success('Categoria excluída.')
      setDeleteId(null)
    })
  }

  if (categories.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Tag className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">Nenhuma categoria criada.</p>
        </div>
        <CategoryForm open={!!editCat} onClose={() => setEditCat(null)} category={editCat} />

      </>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map(cat => (
          <Card key={cat.id} className="border-border/50 hover:border-border transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: cat.color + '25', border: `1px solid ${cat.color}50` }}
              >
                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{cat.name}</p>
                <Badge
                  variant="outline"
                  className="text-xs mt-0.5"
                  style={{ borderColor: cat.color + '60', color: cat.color }}
                >
                  {typeLabel[cat.type]}
                </Badge>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setEditCat(cat)}
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleteId(cat.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CategoryForm open={!!editCat} onClose={() => setEditCat(null)} category={editCat} />


      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              As transações associadas perderão a categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
