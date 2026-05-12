'use client'

import { useState, useEffect, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CategoryList } from '@/components/categories/CategoryList'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { getCategories } from '@/actions/categories'
import type { Category } from '@/types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm,   setShowForm]   = useState(false)
  const [, startTransition]         = useTransition()

  function load() {
    startTransition(async () => {
      const cats = await getCategories()
      setCategories(cats as Category[])
    })
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Categorias</h2>
          <p className="text-sm text-muted-foreground">{categories.length} categoria(s)</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Nova
        </Button>
      </div>

      <CategoryList categories={categories} />

      <CategoryForm
        open={showForm}
        onClose={() => { setShowForm(false); load() }}
      />
    </div>
  )
}
