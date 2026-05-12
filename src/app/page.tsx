import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { CTA } from '@/components/landing/CTA'
import { Separator } from '@/components/ui/separator'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Separator className="max-w-4xl mx-auto opacity-30" />
      <Features />
      <Separator className="max-w-4xl mx-auto opacity-30" />
      <CTA />
      <footer className="text-center py-8 text-xs text-muted-foreground/50">
        © {new Date().getFullYear()} Porquinho. Todos os direitos reservados.
      </footer>
    </main>
  )
}
