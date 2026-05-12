import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Transaction } from '@/types'

interface Props {
  transactions: Transaction[]
  currency?:    string
}

export function RecentTransactions({ transactions, currency = 'BRL' }: Props) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Transações recentes</CardTitle>
        <Link href="/transactions" className="text-xs text-primary hover:underline">
          Ver todas
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">Nenhuma transação ainda.</p>
        ) : (
          transactions.slice(0, 5).map(t => (
            <div key={t.id} className="flex items-center justify-between gap-2 py-1">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{t.title}</p>
                <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {t.categories && (
                  <Badge
                    variant="outline"
                    className="hidden sm:flex text-xs"
                    style={{ borderColor: t.categories.color + '60', color: t.categories.color }}
                  >
                    {t.categories.name}
                  </Badge>
                )}
                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
