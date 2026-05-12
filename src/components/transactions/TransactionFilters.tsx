'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X, Download } from 'lucide-react'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
}

export function TransactionFilters({ categories }: Props) {
  const router     = useRouter()
  const pathname   = usePathname()
  const params     = useSearchParams()

  const update = useCallback((key: string, value: string | null) => {
    const sp = new URLSearchParams(params.toString())
    if (value) sp.set(key, value)
    else sp.delete(key)
    router.push(`${pathname}?${sp.toString()}`)
  }, [params, pathname, router])

  const hasFilters = params.size > 0

  function handleExport() {
    window.location.href = `/api/export?${params.toString()}`
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Input
        placeholder="Buscar transação..."
        defaultValue={params.get('search') ?? ''}
        onChange={e => update('search', e.target.value)}
        className="h-9 w-48"
      />

      <Select value={params.get('type') ?? 'all'} onValueChange={v => update('type', v === 'all' ? '' : v)}>
        <SelectTrigger className="h-9 w-32">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="income">Receita</SelectItem>
          <SelectItem value="expense">Despesa</SelectItem>
        </SelectContent>
      </Select>

      <Select value={params.get('categoryId') ?? 'all'} onValueChange={v => update('categoryId', v === 'all' ? '' : v)}>
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {categories.map(c => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={params.get('dateFrom') ?? ''}
        onChange={e => update('dateFrom', e.target.value)}
        className="h-9 w-36"
        placeholder="De"
      />
      <Input
        type="date"
        value={params.get('dateTo') ?? ''}
        onChange={e => update('dateTo', e.target.value)}
        className="h-9 w-36"
        placeholder="Até"
      />

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1 text-muted-foreground"
          onClick={() => router.push(pathname)}
        >
          <X className="h-3.5 w-3.5" />
          Limpar
        </Button>
      )}

      <Button variant="outline" size="sm" className="h-9 gap-1.5 ml-auto" onClick={handleExport}>
        <Download className="h-3.5 w-3.5" />
        Exportar CSV
      </Button>
    </div>
  )
}
