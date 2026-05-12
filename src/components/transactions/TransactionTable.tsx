'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit2, Trash2, ArrowLeftRight } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TransactionForm } from './TransactionForm'
import { DeleteConfirm } from './DeleteConfirm'
import type { Transaction, Category } from '@/types'

interface Props {
  transactions: Transaction[]
  categories:   Category[]
  currency?:    string
}

export function TransactionTable({ transactions, categories, currency = 'BRL' }: Props) {
  const [editTx,  setEditTx]  = useState<Transaction | null>(null)
  const [deletId, setDeleteId] = useState<string | null>(null)

  if (transactions.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ArrowLeftRight className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">Nenhuma transação encontrada.</p>
        </div>
        <TransactionForm open={!!editTx} onClose={() => setEditTx(null)} categories={categories} transaction={editTx} />
        <DeleteConfirm id={deletId} onClose={() => setDeleteId(null)} />
      </>
    )
  }

  return (
    <>
      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-xs text-muted-foreground">Data</TableHead>
              <TableHead className="text-xs text-muted-foreground">Título</TableHead>
              <TableHead className="text-xs text-muted-foreground hidden sm:table-cell">Categoria</TableHead>
              <TableHead className="text-xs text-muted-foreground hidden sm:table-cell">Tipo</TableHead>
              <TableHead className="text-xs text-muted-foreground text-right">Valor</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(t => (
              <TableRow key={t.id} className="border-border hover:bg-muted/30">
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(t.date)}</TableCell>
                <TableCell className="font-medium text-sm max-w-[180px]">
                  <span className="truncate block">{t.title}</span>
                  {t.notes && <span className="text-xs text-muted-foreground truncate block">{t.notes}</span>}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {t.categories ? (
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: t.categories.color + '60', color: t.categories.color }}
                    >
                      {t.categories.name}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    variant="outline"
                    className={`text-xs ${t.type === 'income' ? 'border-emerald-500/40 text-emerald-500' : 'border-red-500/40 text-red-400'}`}
                  >
                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-sm whitespace-nowrap">
                  <span className={t.type === 'income' ? 'text-emerald-500' : 'text-red-400'}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditTx(t)}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteId(t.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TransactionForm open={!!editTx} onClose={() => setEditTx(null)} categories={categories} transaction={editTx} />
      <DeleteConfirm id={deletId} onClose={() => setDeleteId(null)} />
    </>
  )
}
