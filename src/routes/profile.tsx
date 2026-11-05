import { createFileRoute, redirect } from '@tanstack/react-router'
import ProfilePage from '@/pages/ProfilePage'

export const Route = createFileRoute('/profile')({
  beforeLoad: () => {
    if (!localStorage.getItem('@kurio:token')) throw redirect({ to: '/login' })
  },
  component: ProfilePage,
})