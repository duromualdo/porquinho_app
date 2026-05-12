import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { PiggyBank, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="relative flex flex-col items-center text-center px-4 pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-500/8 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <PiggyBank className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold tracking-tight">Porquinho</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Controle total do<br />
          <span className="text-primary">seu dinheiro.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Registre, categorize e visualize seu fluxo de caixa em segundos. Sem complicação, sem fricção.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          <Link href="/signup" className={cn(buttonVariants({ size: 'lg' }), 'gap-2 inline-flex')}>
            Começar grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'inline-flex')}>
            Entrar
          </Link>
        </div>
      </div>
    </section>
  )
}
