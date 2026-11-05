import { createFileRoute, redirect } from '@tanstack/react-router'
import WalletsPage from '@/pages/WalletsPage'

export const Route = createFileRoute('/wallets')({
  beforeLoad: () => {
    if (!localStorage.getItem('@kurio:token')) throw redirect({ to: '/login' })
  },
  component: WalletsPage,
})