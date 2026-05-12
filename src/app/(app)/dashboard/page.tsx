import { getDashboardStats } from '@/actions/transactions'
import { getTransactions } from '@/actions/transactions'
import { createClient } from '@/lib/supabase/server'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { OverviewChart } from '@/components/dashboard/OverviewChart'
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [stats, recent, profileRow] = await Promise.all([
    getDashboardStats(),
    getTransactions(),
    supabase.from('profiles').select('currency').eq('id', user!.id).single(),
  ])

  const currency = profileRow.data?.currency ?? 'BRL'

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SummaryCards
        totalIncome={stats.totalIncome}
        totalExpense={stats.totalExpense}
        balance={stats.balance}
        currency={currency}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OverviewChart data={stats.byMonth} />
        <CategoryPieChart data={stats.byCategory} currency={currency} />
      </div>

      <RecentTransactions transactions={recent} currency={currency} />
    </div>
  )
}
