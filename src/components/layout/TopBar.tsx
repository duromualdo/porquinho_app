'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/dashboard':    'Dashboard',
  '/transactions': 'Transações',
  '/categories':   'Categorias',
  '/settings':     'Configurações',
}

export function TopBar() {
  const pathname = usePathname()
  const title = Object.entries(pageTitles).find(([k]) => pathname.startsWith(k))?.[1] ?? 'Porquinho'

  return (
    <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <Menu className="h-5 w-5 text-muted-foreground md:hidden" />
      <h1 className="text-base font-semibold tracking-tight">{title}</h1>
    </header>
  )
}
