'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface CategoryData {
  name:  string
  color: string
  total: number
}

interface Props {
  data:      CategoryData[]
  currency?: string
}

export function CategoryPieChart({ data, currency = 'BRL' }: Props) {
  if (data.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader className="px-6 pt-5 pb-2">
          <CardTitle className="text-base font-sans font-semibold">Despesas por categoria (mês atual)</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
          <p className="font-sans text-base">Nenhuma despesa este mês.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Despesas por categoria (mês atual)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80} strokeWidth={0}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: 8 }}
              formatter={(value) => formatCurrency(Number(value), currency)}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
