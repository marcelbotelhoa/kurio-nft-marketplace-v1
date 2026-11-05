import { createFileRoute, redirect } from '@tanstack/react-router'
import CheckoutPage from '@/pages/CheckoutPage'

export const Route = createFileRoute('/checkout')({
  beforeLoad: () => {
    if (!localStorage.getItem('@kurio:token')) {
      throw redirect({ to: '/login' })
    }
  },
  component: CheckoutPage,
})