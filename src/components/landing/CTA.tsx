import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CTA() {
  return (
    <section className="px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Comece agora, é grátis.</h2>
        <p className="text-muted-foreground text-sm">
          Sem cartão de crédito. Sem período de teste. Só você e seu dinheiro.
        </p>
        <Link href="/signup" className={cn(buttonVariants({ size: 'lg' }), 'gap-2 inline-flex')}>
          Criar conta grátis
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
