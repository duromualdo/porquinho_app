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
  const [editTx,   setEditTx]   = useState<Transaction | null>(null)
  const [deletId,  setDeleteId] = useState<string | null>(null)

  if (transactions.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ArrowLeftRight className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="font-sans text-muted-foreground text-lg">Nenhuma transação encontrada.</p>
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
              <TableHead className="text-sm font-sans font-semibold text-muted-foreground py-4">Data</TableHead>
              <TableHead className="text-sm font-sans font-semibold text-muted-foreground">Título</TableHead>
              <TableHead className="text-sm font-sans font-semibold text-muted-foreground hidden sm:table-cell">Categoria</TableHead>
              <TableHead className="text-sm font-sans font-semibold text-muted-foreground hidden sm:table-cell">Tipo</TableHead>
              <TableHead className="text-sm font-sans font-semibold text-muted-foreground text-right">Valor</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(t => (
              <TableRow key={t.id} className="border-border hover:bg-muted/30">
                <TableCell className="font-sans text-sm text-muted-foreground whitespace-nowrap py-4">
                  {formatDate(t.date)}
                </TableCell>
                <TableCell className="max-w-[200px] py-4">
                  <span className="font-sans font-medium text-base truncate block">{t.title}</span>
                  {t.notes && (
                    <span className="font-sans text-sm text-muted-foreground truncate block">{t.notes}</span>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell py-4">
                  {t.categories ? (
                    <Badge
                      variant="outline"
                      className="text-sm font-sans"
                      style={{ borderColor: t.categories.color + '60', color: t.categories.color }}
                    >
                      {t.categories.name}
                    </Badge>
                  ) : (
                    <span className="font-serif italic text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell py-4">
                  <Badge
                    variant="outline"
                    className={`text-sm font-sans ${t.type === 'income' ? 'border-emerald-500/40 text-emerald-500' : 'border-red-500/40 text-red-400'}`}
                  >
                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap py-4">
                  <span className={`font-sans font-bold text-base ${t.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditTx(t)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteId(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
