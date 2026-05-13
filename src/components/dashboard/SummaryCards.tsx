import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Props {
  totalIncome:  number
  totalExpense: number
  balance:      number
  currency?:    string
}

export function SummaryCards({ totalIncome, totalExpense, balance, currency = 'BRL' }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-6">
          <CardTitle className="text-base font-sans font-semibold text-muted-foreground">Receitas</CardTitle>
          <TrendingUp className="h-5 w-5 text-emerald-500" />
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <p className="text-4xl font-bold font-serif text-emerald-500 tracking-tight">
            {formatCurrency(totalIncome, currency)}
          </p>
          <p className="text-sm font-sans text-muted-foreground mt-1">total acumulado</p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-6">
          <CardTitle className="text-base font-sans font-semibold text-muted-foreground">Despesas</CardTitle>
          <TrendingDown className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <p className="text-4xl font-bold font-serif text-red-500 tracking-tight">
            {formatCurrency(totalExpense, currency)}
          </p>
          <p className="text-sm font-sans text-muted-foreground mt-1">total acumulado</p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5 px-6">
          <CardTitle className="text-base font-sans font-semibold text-muted-foreground">Saldo</CardTitle>
          <Wallet className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <p className={`text-4xl font-bold font-serif tracking-tight ${balance >= 0 ? 'text-foreground' : 'text-red-500'}`}>
            {formatCurrency(balance, currency)}
          </p>
          <p className="text-sm font-sans text-muted-foreground mt-1">
            {balance >= 0 ? 'saldo positivo' : 'saldo negativo'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
