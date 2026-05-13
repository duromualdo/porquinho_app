import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { PiggyBank, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="relative flex flex-col items-center text-center px-4 pt-28 pb-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-emerald-500/8 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-7">
        <div className="flex items-center justify-center gap-3 mb-2">
          <PiggyBank className="h-11 w-11 text-primary" />
          <span className="text-4xl font-bold font-serif tracking-tight">Porquinho</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold font-sans tracking-tight leading-tight">
          Controle total do<br />
          <span className="text-primary">seu dinheiro.</span>
        </h1>

        <p className="text-xl font-sans text-muted-foreground max-w-md mx-auto leading-relaxed">
          Registre, categorize e visualize seu fluxo de caixa em segundos. Sem complicação, sem fricção.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
          <Link href="/signup" className={cn(buttonVariants({ size: 'lg' }), 'gap-2 inline-flex text-base px-6 h-11')}>
            Começar grátis
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'inline-flex text-base px-6 h-11')}>
            Entrar
          </Link>
        </div>
      </div>
    </section>
  )
}
