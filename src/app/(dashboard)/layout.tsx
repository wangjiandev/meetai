import { SidebarProvider } from '@/components/ui/sidebar'
import AppSiderbar from '@/modules/dashboard/ui/components/app-siderbar'
import AppNavbar from '@/modules/dashboard/ui/components/app-navbar'

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <SidebarProvider>
      <AppSiderbar />
      <main className="bg-muted flex h-screen w-screen flex-col">
        <AppNavbar />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout
