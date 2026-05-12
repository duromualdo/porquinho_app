export const DEFAULT_CATEGORIES = [
  { name: 'Salário',        color: '#22c55e', icon: 'briefcase',    type: 'income'  as const },
  { name: 'Freelance',      color: '#10b981', icon: 'laptop',       type: 'income'  as const },
  { name: 'Investimentos',  color: '#6366f1', icon: 'trending-up',  type: 'income'  as const },
  { name: 'Outros',         color: '#8b5cf6', icon: 'plus-circle',  type: 'both'    as const },
  { name: 'Alimentação',    color: '#f59e0b', icon: 'utensils',     type: 'expense' as const },
  { name: 'Transporte',     color: '#3b82f6', icon: 'car',          type: 'expense' as const },
  { name: 'Moradia',        color: '#ef4444', icon: 'home',         type: 'expense' as const },
  { name: 'Saúde',          color: '#ec4899', icon: 'heart-pulse',  type: 'expense' as const },
  { name: 'Lazer',          color: '#f97316', icon: 'gamepad-2',    type: 'expense' as const },
  { name: 'Educação',       color: '#14b8a6', icon: 'book-open',    type: 'expense' as const },
  { name: 'Vestuário',      color: '#a855f7', icon: 'shirt',        type: 'expense' as const },
  { name: 'Assinaturas',    color: '#06b6d4', icon: 'credit-card',  type: 'expense' as const },
]

export const COLOR_SWATCHES = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e',
  '#10b981', '#14b8a6', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#ec4899', '#06b6d4',
]

export const CURRENCY_OPTIONS = [
  { value: 'BRL', label: 'Real Brasileiro (R$)' },
  { value: 'USD', label: 'Dólar Americano ($)' },
  { value: 'EUR', label: 'Euro (€)' },
]

export const CURRENCY_SYMBOLS: Record<string, string> = {
  BRL: 'R$',
  USD: '$',
  EUR: '€',
}
