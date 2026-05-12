import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search     = searchParams.get('search')
  const type       = searchParams.get('type')
  const categoryId = searchParams.get('categoryId')
  const dateFrom   = searchParams.get('dateFrom')
  const dateTo     = searchParams.get('dateTo')

  let query = supabase
    .from('transactions')
    .select('*, categories(name)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (search)     query = query.ilike('title', `%${search}%`)
  if (type)       query = query.eq('type', type)
  if (categoryId) query = query.eq('category_id', categoryId)
  if (dateFrom)   query = query.gte('date', dateFrom)
  if (dateTo)     query = query.lte('date', dateTo)

  const { data, error } = await query

  if (error) return new Response('Error fetching data', { status: 500 })

  const rows = data ?? []
  const header = ['Data', 'Título', 'Tipo', 'Categoria', 'Valor', 'Notas']
  const lines  = rows.map(t => [
    t.date,
    `"${(t.title ?? '').replace(/"/g, '""')}"`,
    t.type === 'income' ? 'Receita' : 'Despesa',
    `"${((t.categories as {name:string}|null)?.name ?? '').replace(/"/g, '""')}"`,
    String(t.amount),
    `"${(t.notes ?? '').replace(/"/g, '""')}"`,
  ].join(','))

  const csv = [header.join(','), ...lines].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type':        'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="porquinho-export.csv"',
    },
  })
}
