import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import HomePage from '@/pages/HomePage'

// Dizemos ao roteador que a Home aceita um parâmetro de busca 'q'
const homeSearchSchema = z.object({
  q: z.string().optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: (search) => homeSearchSchema.parse(search),
  component: HomePage,
})