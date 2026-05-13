'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCategory, updateCategory } from '@/actions/categories'
import { categorySchema, type CategoryInput } from '@/lib/validations'
import { COLOR_SWATCHES } from '@/lib/constants'
import type { Category } from '@/types'

interface Props {
  open:      boolean
  onClose:   (createdName?: string) => void
  category?: Category | null
}

export function CategoryForm({ open, onClose, category }: Props) {
  const [isPending, startTransition] = useTransition()
  const [typeValue, setTypeValue]    = useState<'income' | 'expense' | 'both'>('expense')

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { color: '#6366f1', type: 'expense', icon: 'tag' },
  })

  const selectedColor = watch('color')

  useEffect(() => {
    if (category) {
      reset({ name: category.name, color: category.color, icon: category.icon, type: category.type })
      setTypeValue(category.type)
    } else {
      reset({ color: '#6366f1', type: 'expense', icon: 'tag' })
      setTypeValue('expense')
    }
  }, [category, reset, open])

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value as 'income' | 'expense' | 'both'
    setTypeValue(val)
    setValue('type', val)
  }

  function onSubmit(data: CategoryInput) {
    startTransition(async () => {
      const result = category
        ? await updateCategory(category.id, data)
        : await createCategory(data)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(category ? 'Categoria atualizada!' : 'Categoria criada!')
        onClose(category ? undefined : data.name)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{category ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Nome</Label>
            <Input id="cat-name" {...register('name')} placeholder="Ex: Alimentação" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-type">Tipo</Label>
            <select
              id="cat-type"
              value={typeValue}
              onChange={handleTypeChange}
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
              <option value="both">Ambos</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`h-7 w-7 rounded-full transition-all ${
                    selectedColor === color
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-110'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onClose()}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : category ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
