import { z } from 'zod'

export const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const signUpSchema = loginSchema.extend({
  full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})

export const transactionSchema = z.object({
  title:       z.string().min(1, 'Título obrigatório'),
  amount:      z.number().positive('Valor deve ser positivo'),
  type:        z.enum(['income', 'expense']),
  category_id: z.string().optional(),
  date:        z.string().min(1, 'Data obrigatória'),
  notes:       z.string().optional(),
})

export const categorySchema = z.object({
  name:  z.string().min(1, 'Nome obrigatório'),
  color: z.string().min(1, 'Cor obrigatória'),
  icon:  z.string().min(1, 'Ícone obrigatório'),
  type:  z.enum(['income', 'expense', 'both']),
})

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  currency:  z.string().min(1),
})

export type LoginInput        = z.infer<typeof loginSchema>
export type SignUpInput        = z.infer<typeof signUpSchema>
export type TransactionInput   = z.infer<typeof transactionSchema>
export type CategoryInput      = z.infer<typeof categorySchema>
export type ProfileInput       = z.infer<typeof profileSchema>
