'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { updateProfile, signOut } from '@/actions/auth'
import { CURRENCY_OPTIONS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [isPending,  startTransition]  = useTransition()
  const [isLoading,  setIsLoading]     = useState(true)
  const [profile,    setProfile]       = useState({ full_name: '', currency: 'BRL' })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('full_name, currency').eq('id', user.id).single()
      if (data) setProfile({ full_name: data.full_name ?? '', currency: data.currency })
      setIsLoading(false)
    })
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result?.error) toast.error(result.error)
      else toast.success('Perfil atualizado!')
    })
  }

  if (isLoading) return <div className="text-muted-foreground text-sm">Carregando...</div>

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Perfil</CardTitle>
          <CardDescription>Atualize seus dados de conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome completo</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile.full_name}
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <Label>Moeda</Label>
              <Select name="currency" defaultValue={profile.currency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="currency" value={profile.currency} />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Zona de perigo</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <form action={signOut}>
            <Button variant="destructive" type="submit" size="sm">
              Sair da conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
