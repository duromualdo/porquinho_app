'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCategory, updateCategory } from '@/actions/categories'
import { categorySchema, type CategoryInput } from '@/lib/validations'
import { COLOR_SWATCHES } from '@/lib/constants'
import type { Category } from '@/types'

interface Props {
  open:      boolean
  onClose:   () => void
  category?: Category | null
}

export function CategoryForm({ open, onClose, category }: Props) {
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { color: '#6366f1', type: 'expense', icon: 'tag' },
  })

  const selectedColor = watch('color')

  useEffect(() => {
    if (category) {
      reset({ name: category.name, color: category.color, icon: category.icon, type: category.type })
    } else {
      reset({ color: '#6366f1', type: 'expense', icon: 'tag' })
    }
  }, [category, reset, open])

  function onSubmit(data: CategoryInput) {
    startTransition(async () => {
      const result = category
        ? await updateCategory(category.id, data)
        : await createCategory(data)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(category ? 'Categoria atualizada!' : 'Categoria criada!')
        onClose()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{category ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register('name')} placeholder="Ex: Alimentação" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select onValueChange={v => setValue('type', v as 'income' | 'expense' | 'both')} defaultValue={category?.type ?? 'expense'}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="both">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`h-7 w-7 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : category ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
