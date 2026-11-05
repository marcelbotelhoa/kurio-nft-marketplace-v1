import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { useRealtime } from '../hooks/useRealtime'
import { RealtimeSimulator } from '../components/RealtimeSimulator'

export const Route = createRootRoute({
  component: () => {
    useRealtime(); // Inicia o Socket.IO globalmente

    return (
      <>
        <Layout>
          <Outlet />
        </Layout>
        <RealtimeSimulator />
      </>
    )
  },
})