'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PiggyBank, LayoutDashboard, ArrowLeftRight, Tag, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/actions/auth'

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações',   icon: ArrowLeftRight   },
  { href: '/categories',   label: 'Categorias',   icon: Tag              },
  { href: '/settings',     label: 'Configurações', icon: Settings         },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-sidebar h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border">
        <PiggyBank className="h-6 w-6 text-primary shrink-0" />
        <span className="font-bold text-base tracking-tight">Porquinho</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-2 border-t border-border">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
