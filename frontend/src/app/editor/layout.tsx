import { SidebarProvider } from "@/components/ui/sidebar"
import { ReactNode } from "react"
import "@/app/globals.css"
import EditorNavbar from "@/components/EditorNavbar"
import EditorSidebar from "@/components/EditorSidebar"

const layout = ({ children }: { children: ReactNode }) => {

  return (
    <SidebarProvider>
      <EditorNavbar />
      <EditorSidebar />
      <main className="w-screen h-screen mt-12">
        {children}
      </main>
    </SidebarProvider>
  )
}

export default layout