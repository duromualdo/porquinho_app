import { Zap, BarChart3, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon:  Zap,
    title: 'Registro rápido',
    desc:  'Adicione uma transação em menos de 10 segundos. Sem menus escondidos, sem burocracia.',
  },
  {
    icon:  BarChart3,
    title: 'Gráficos claros',
    desc:  'Veja sua evolução financeira com gráficos limpos de receitas vs. despesas por mês e categoria.',
  },
  {
    icon:  Download,
    title: 'Exportação CSV',
    desc:  'Exporte todas as suas transações com filtros aplicados para análises externas ou arquivamento.',
  },
]

export function Features() {
  return (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">
        Tudo que você precisa, nada do que não precisa.
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="border-border/50 hover:border-primary/40 transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
