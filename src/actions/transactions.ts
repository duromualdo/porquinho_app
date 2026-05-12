'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { transactionSchema } from '@/lib/validations'
import type { TransactionFilters, DashboardStats } from '@/types'
import type { TransactionInput } from '@/lib/validations'

export async function getTransactions(filters?: TransactionFilters) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('transactions')
    .select('*, categories(id, name, color, icon, type)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`)
  }
  if (filters?.type) {
    query = query.eq('type', filters.type)
  }
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }
  if (filters?.dateFrom) {
    query = query.gte('date', filters.dateFrom)
  }
  if (filters?.dateTo) {
    query = query.lte('date', filters.dateTo)
  }

  const { data } = await query
  return data ?? []
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { totalIncome: 0, totalExpense: 0, balance: 0, byCategory: [], byMonth: [] }
  }

  const { data: all } = await supabase
    .from('transactions')
    .select('*, categories(name, color)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  const transactions = all ?? []

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const balance      = totalIncome - totalExpense

  // expense by category (current month)
  const now = new Date()
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const thisMonth = transactions.filter(t => t.date.startsWith(monthPrefix) && t.type === 'expense')

  const catMap: Record<string, { name: string; color: string; total: number }> = {}
  for (const t of thisMonth) {
    const key  = t.category_id ?? '__none'
    const name  = (t.categories as {name:string;color:string} | null)?.name ?? 'Sem categoria'
    const color = (t.categories as {name:string;color:string} | null)?.color ?? '#6b7280'
    if (!catMap[key]) catMap[key] = { name, color, total: 0 }
    catMap[key].total += Number(t.amount)
  }
  const byCategory = Object.values(catMap).sort((a, b) => b.total - a.total).slice(0, 6)

  // income vs expense for last 6 months
  const months: string[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const byMonth = months.map(m => {
    const mTx = transactions.filter(t => t.date.startsWith(m))
    return {
      month:   m,
      income:  mTx.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
      expense: mTx.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
    }
  })

  return { totalIncome, totalExpense, balance, byCategory, byMonth }
}

export async function createTransaction(data: TransactionInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const parsed = transactionSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase.from('transactions').insert({
    ...parsed.data,
    user_id: user.id,
    category_id: parsed.data.category_id || null,
  })

  if (error) return { error: error.message }

  revalidatePath('/transactions')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateTransaction(id: string, data: TransactionInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const parsed = transactionSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase
    .from('transactions')
    .update({ ...parsed.data, category_id: parsed.data.category_id || null })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/transactions')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/transactions')
  revalidatePath('/dashboard')
  return { success: true }
}
