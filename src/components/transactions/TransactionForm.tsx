'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createTransaction, updateTransaction } from '@/actions/transactions'
import { transactionSchema, type TransactionInput } from '@/lib/validations'
import type { Transaction, Category } from '@/types'

interface Props {
  open:        boolean
  onClose:     () => void
  categories:  Category[]
  transaction?: Transaction | null
}

export function TransactionForm({ open, onClose, categories, transaction }: Props) {
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const type = watch('type')

  useEffect(() => {
    if (transaction) {
      reset({
        title:       transaction.title,
        amount:      transaction.amount,
        type:        transaction.type,
        category_id: transaction.category_id ?? '',
        date:        transaction.date,
        notes:       transaction.notes ?? '',
      })
    } else {
      reset({ type: 'expense', date: new Date().toISOString().split('T')[0] })
    }
  }, [transaction, reset, open])

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

  const filteredCategories = categories.filter(
    c => c.type === type || c.type === 'both'
  )

  return (
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
              onClick={() => setValue('type', 'expense')}
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
              onClick={() => setValue('type', 'income')}
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
            <Input id="amount" type="number" step="0.01" min="0.01" {...register('amount', { valueAsNumber: true })} placeholder="0,00" />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select onValueChange={v => setValue('category_id', v ?? undefined)} defaultValue={transaction?.category_id ?? ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
  )
}
