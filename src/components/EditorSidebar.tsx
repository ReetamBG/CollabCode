"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useFilesStore from "@/store/files.store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilePlus2, Files, FolderPlus, Menu, Search as SearchIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import SidebarFile from "./EditorSidebarFile";
import SidebarFolder from "./EditorSidebarFolder";


type SidebarNavItem = "Menu" | "Explorer" | "Search"

export default function EditorSidebar() {
  const [activeSidebarItem, setActiveSidebarItem] = useState<SidebarNavItem>("Menu")
  const sidebarNavItems = [
    { name: "Menu", icon: <Menu /> },
    { name: "Explorer", icon: <Files /> },
    { name: "Search", icon: <SearchIcon /> }
  ]

  return (
    <div className="flex h-screen">
      <SidebarNav
        activeSidebarItem={activeSidebarItem}
        setActiveSidebarItem={setActiveSidebarItem}
        sidebarNavItems={sidebarNavItems}
      />

      {activeSidebarItem === "Explorer" && <Explorer />}
      {activeSidebarItem === "Search" && <Search />}
    </div>
  );
}

interface SidebarNavProps {
  activeSidebarItem: SidebarNavItem;
  setActiveSidebarItem: (item: SidebarNavItem) => void;
  sidebarNavItems: { name: string, icon: React.ReactNode }[];
}

const SidebarNav = ({ activeSidebarItem, setActiveSidebarItem, sidebarNavItems }: SidebarNavProps) => {
  const { open, setOpen, toggleSidebar } = useSidebar()

  const handleClick = (item: { name: string, icon: React.ReactNode }) => {
    if (item.name === activeSidebarItem) {
      toggleSidebar()
      localStorage.setItem("sidebar_open", open ? "true" : "false")
    }
    else {
      setActiveSidebarItem(item.name as SidebarNavItem)
      setOpen(true)
      localStorage.setItem("sidebar_open", "true")
    }
  }

  return (
    <div className="mt-12 w-14 flex flex-col items-center border-r-1  z-100 bg-background">
      {sidebarNavItems.map((item) => (
        <Tooltip key={item.name}>
          <TooltipTrigger asChild>
            <button
              key={item.name}
              onClick={() => handleClick(item)}
              className={`grid place-content-center hover:bg-foreground/10 w-14 h-14 cursor-pointer ${activeSidebarItem === item.name ? "bg-foreground/10" : ""}`}
              title={item.name}
            >
              {item.icon}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="z-100">
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
const Explorer = () => {
  const { fileTree } = useFilesStore();

  return (
    <Sidebar className="relative top-12 h-full w-64">
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between">
            <span>Explorer</span>{" "}
            <div className="flex gap-4">
              <AddFolderButton />
              <AddFileButton />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {fileTree.folders.map((fId) => (
                <SidebarMenuItem key={fId}>
                  <SidebarFolder folderId={fId} />
                </SidebarMenuItem>
              ))}
              {/* only display those files which are in root (cuz the rest are displayed in te folders) */}
              {fileTree.files.map((fId) => (
                <SidebarMenuItem key={fId}>
                  <SidebarFile fileId={fId} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

const Search = () => {
  return (
    <Sidebar className="relative top-12 h-full w-64">
      <SidebarContent className="bg-background">
        <div className="p-4">
          <Input type="text" placeholder="Search..." className="mb-4" />
          <div>
            {/* Search results would go here */}
            <p className="text-sm text-muted-foreground">No results found.</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

function AddFileButton() {
  const { createNewFile } = useFilesStore()
  const [open, setOpen] = useState(false)

  function handleCreateNewFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const fileName = formData.get("fileName") as string
    if (fileName) {
      createNewFile(fileName)
      setOpen(false)
    }
    e.currentTarget.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer">
          <Tooltip>
            <TooltipTrigger asChild>
              <FilePlus2 size={15} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new file</p>
            </TooltipContent>
          </Tooltip>
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New file</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <form onSubmit={handleCreateNewFile} className="flex flex-col gap-4">
          <Input
            type="text"
            name="fileName"
            placeholder="Enter file name"
          />
          <DialogFooter className="sm:justify-start">
            <Button type="submit" variant="default">
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


function AddFolderButton() {
  const { createNewFolder } = useFilesStore()
  const [open, setOpen] = useState(false)

  function handleCreateNewFolder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const folderName = formData.get("folderName") as string
    if (folderName) {
      createNewFolder(folderName)
      setOpen(false)
    }
    e.currentTarget.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer">
          <Tooltip>
            <TooltipTrigger asChild>
              <FolderPlus size={15} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new folder</p>
            </TooltipContent>
          </Tooltip>
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <form onSubmit={handleCreateNewFolder} className="flex flex-col gap-4">
          <Input
            type="text"
            name="folderName"
            placeholder="Enter folder name"
          />
          <DialogFooter className="sm:justify-start">
            <Button type="submit" variant="default">
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
