import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/modules/dashboard/ui/components/app-siderbar'

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-muted flex h-screen w-screen flex-col">{children}</main>
    </SidebarProvider>
  )
}

export default Layout
