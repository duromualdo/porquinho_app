'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PiggyBank, LayoutDashboard, ArrowLeftRight, Tag, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/actions/auth'

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações',    icon: ArrowLeftRight   },
  { href: '/categories',   label: 'Categorias',    icon: Tag              },
  { href: '/settings',     label: 'Configurações', icon: Settings         },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-sidebar h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border">
        <PiggyBank className="h-7 w-7 text-primary shrink-0" />
        <span className="font-bold text-xl tracking-tight font-serif">Porquinho</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-md text-[0.95rem] font-medium font-sans transition-colors',
              pathname.startsWith(href)
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-border">
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-[0.95rem] font-medium font-sans text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
