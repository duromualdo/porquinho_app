export interface Profile {
  id: string
  full_name: string | null
  currency: string
  created_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  icon: string
  type: 'income' | 'expense' | 'both'
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  category_id: string | null
  title: string
  amount: number
  type: 'income' | 'expense'
  date: string
  notes: string | null
  created_at: string
  updated_at: string
  categories?: Category | null
}

export interface TransactionFilters {
  search?: string
  type?: 'income' | 'expense' | ''
  categoryId?: string
  dateFrom?: string
  dateTo?: string
}

export interface DashboardStats {
  totalIncome: number
  totalExpense: number
  balance: number
  byCategory: { name: string; color: string; total: number }[]
  byMonth: { month: string; income: number; expense: number }[]
}
