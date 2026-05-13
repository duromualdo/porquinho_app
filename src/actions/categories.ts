'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { categorySchema } from '@/lib/validations'
import { DEFAULT_CATEGORIES } from '@/lib/constants'
import type { CategoryInput } from '@/lib/validations'

export async function getCategories() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (!data) return []

  // Deduplicate by name — keeps only the first occurrence of each name
  const seen = new Set<string>()
  return data.filter(c => {
    if (seen.has(c.name)) return false
    seen.add(c.name)
    return true
  })
}

export async function seedDefaultCategories() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('categories')
    .select('name')
    .eq('user_id', user.id)

  const existingNames = new Set((existing ?? []).map(c => c.name))
  const toInsert = DEFAULT_CATEGORIES.filter(c => !existingNames.has(c.name))

  if (toInsert.length === 0) return

  await supabase.from('categories').insert(
    toInsert.map(c => ({ ...c, user_id: user.id }))
  )
}

export async function createCategory(data: CategoryInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const parsed = categorySchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase
    .from('categories')
    .insert({ ...parsed.data, user_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/categories')
  revalidatePath('/transactions')
  return { success: true }
}

export async function updateCategory(id: string, data: CategoryInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const parsed = categorySchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { error } = await supabase
    .from('categories')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/categories')
  return { success: true }
}
