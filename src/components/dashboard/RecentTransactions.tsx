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
      <CardHeader className="flex flex-row items-center justify-between px-6 pt-5 pb-4">
        <CardTitle className="text-base font-sans font-semibold">Transações recentes</CardTitle>
        <Link href="/transactions" className="text-sm font-sans text-primary hover:underline">
          Ver todas →
        </Link>
      </CardHeader>
      <CardContent className="px-6 pb-5 space-y-3">
        {transactions.length === 0 ? (
          <p className="font-sans text-muted-foreground text-base py-6 text-center">
            Nenhuma transação registrada ainda.
          </p>
        ) : (
          transactions.slice(0, 5).map(t => (
            <div key={t.id} className="flex items-center justify-between gap-3 py-1.5 border-b border-border/40 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-base font-sans font-medium truncate">{t.title}</p>
                <p className="text-sm font-sans text-muted-foreground">{formatDate(t.date)}</p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                {t.categories && (
                  <Badge
                    variant="outline"
                    className="hidden sm:flex text-xs font-sans"
                    style={{ borderColor: t.categories.color + '60', color: t.categories.color }}
                  >
                    {t.categories.name}
                  </Badge>
                )}
                <span className={`text-base font-bold font-sans ${t.type === 'income' ? 'text-emerald-500' : 'text-red-400'}`}>
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
