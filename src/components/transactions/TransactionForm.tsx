'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { createTransaction, updateTransaction } from '@/actions/transactions'
import { getCategories } from '@/actions/categories'
import { transactionSchema, type TransactionInput } from '@/lib/validations'
import type { Transaction, Category } from '@/types'

interface Props {
  open:         boolean
  onClose:      () => void
  categories:   Category[]
  transaction?: Transaction | null
}

export function TransactionForm({ open, onClose, categories: initialCategories, transaction }: Props) {
  const [isPending,     startTransition]    = useTransition()
  const [categoryId,    setCategoryId]      = useState<string>('')
  const [categories,    setCategories]      = useState<Category[]>(initialCategories)
  const [showCatForm,   setShowCatForm]     = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const type = watch('type')

  // Sync categories when prop changes (parent refreshes)
  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  useEffect(() => {
    if (!open) return
    if (transaction) {
      reset({
        title:       transaction.title,
        amount:      transaction.amount,
        type:        transaction.type,
        category_id: transaction.category_id ?? '',
        date:        transaction.date,
        notes:       transaction.notes ?? '',
      })
      setCategoryId(transaction.category_id ?? '')
    } else {
      reset({ type: 'expense', date: new Date().toISOString().split('T')[0] })
      setCategoryId('')
    }
  }, [transaction, reset, open])

  async function refreshCategories(selectName?: string) {
    const fresh = await getCategories() as Category[]
    setCategories(fresh)
    if (selectName) {
      const created = fresh.find(c => c.name === selectName)
      if (created) {
        setCategoryId(created.id)
        setValue('category_id', created.id)
      }
    }
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setCategoryId(val)
    setValue('category_id', val || undefined)
  }

  function onSubmit(data: TransactionInput) {
    startTransition(async () => {
      const result = transaction
        ? await updateTransaction(transaction.id, data)
        : await createTransaction(data)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(transaction ? 'Transação atualizada!' : 'Transação criada!')
        onClose()
      }
    })
  }

  const visibleCategories = categories.filter(c => c.type === type || c.type === 'both')

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{transaction ? 'Editar transação' : 'Nova transação'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Type toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setValue('type', 'expense'); setCategoryId('') }}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  type === 'expense'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-secondary text-muted-foreground border border-border hover:text-foreground'
                }`}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => { setValue('type', 'income'); setCategoryId('') }}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  type === 'income'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-secondary text-muted-foreground border border-border hover:text-foreground'
                }`}
              >
                Receita
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...register('title')} placeholder="Ex: Almoço, Salário..." />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                {...register('amount', { valueAsNumber: true })}
                placeholder="0,00"
              />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="category_id">Categoria</Label>
                  <button
                    type="button"
                    onClick={() => setShowCatForm(true)}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/85 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Nova
                  </button>
                </div>
                <select
                  id="category_id"
                  value={categoryId}
                  onChange={handleCategoryChange}
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
                >
                  <option value="">Selecionar</option>
                  {visibleCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea id="notes" {...register('notes')} placeholder="Observações..." rows={2} />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : transaction ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CategoryForm
        open={showCatForm}
        onClose={async (createdName?: string) => {
          setShowCatForm(false)
          await refreshCategories(createdName)
        }}
      />
    </>
  )
}
