'use client'

import { useState, useEffect, useTransition, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { getTransactions } from '@/actions/transactions'
import { getCategories } from '@/actions/categories'
import type { Transaction, Category } from '@/types'

function TransactionsContent() {
  const searchParams = useSearchParams()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories,   setCategories]   = useState<Category[]>([])
  const [showForm,     setShowForm]     = useState(false)
  const [, startTransition]             = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const filters = {
        search:     searchParams.get('search')     ?? undefined,
        type:       (searchParams.get('type')      ?? '') as 'income' | 'expense' | '',
        categoryId: searchParams.get('categoryId') ?? undefined,
        dateFrom:   searchParams.get('dateFrom')   ?? undefined,
        dateTo:     searchParams.get('dateTo')     ?? undefined,
      }
      const [txs, cats] = await Promise.all([getTransactions(filters), getCategories()])
      setTransactions(txs as Transaction[])
      setCategories(cats as Category[])
    })
  }, [searchParams])

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold font-sans tracking-tight">Transações</h2>
          <p className="text-base font-sans text-muted-foreground">{transactions.length} registro(s)</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Nova
        </Button>
      </div>

      <TransactionFilters categories={categories} />
      <TransactionTable transactions={transactions} categories={categories} />

      <TransactionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        categories={categories}
      />
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <Suspense>
      <TransactionsContent />
    </Suspense>
  )
}
