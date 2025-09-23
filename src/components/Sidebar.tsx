"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useFilesStore from "@/store/files.store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilePlus2, FolderPlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import SidebarFile from "./SidebarFile";
import SidebarFolder from "./SidebarFolder";


export default function AppSidebar() {
  const { fileTree } = useFilesStore();

  return (
    <Sidebar>
      <SidebarContent>
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
  );
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
            <Button type="submit" variant="secondary">
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
            <Button type="submit" variant="secondary">
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
