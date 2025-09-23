import AppSidebar from "@/components/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ReactNode } from "react"
import "@/app/globals.css"

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-screen h-screen">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default layout