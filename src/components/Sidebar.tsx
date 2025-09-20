"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useFilesStore from "@/store/files.store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilePlus2 } from "lucide-react";
import { FormEvent  } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";


export default function AppSidebar() {
  const { files, setCurrentFile } = useFilesStore();


  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between">
            <span>Explorer</span>{" "}
            <AddFileButton />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {files.map((f) => (
                <SidebarMenuItem key={f.name}>
                  <SidebarMenuButton asChild onClick={() => setCurrentFile(f)}>
                    {/* <a href={item.url}> */}
                    {/* <item.icon /> */}
                    <span className="select-none cursor-pointer">{f.name}</span>
                    {/* </a> */}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// function TooltipElement({
//   title,
//   description,
// }: {
//   title: ReactNode;
//   description: string;
// }) {
//   return (
//     <Tooltip>
//       <TooltipTrigger asChild>{title}</TooltipTrigger>
//       <TooltipContent>
//         <p>{description}</p>
//       </TooltipContent>
//     </Tooltip>
//   );
// }

function AddFileButton() {
  const { createNewFile } = useFilesStore()

  function handleCreateNewFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const fileName = formData.get("fileName") as string
    if (fileName) {
      createNewFile(fileName)
    }
    e.currentTarget.reset()
  }

  return (
    <Dialog>
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
            <DialogClose asChild>
              <Button type="submit" variant="secondary">
                Add
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


function AddFolderButton() {
  const { createNewFile } = useFilesStore()

  function handleCreateNewFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const fileName = formData.get("fileName") as string
    if (fileName) {
      createNewFile(fileName)
    }
    e.currentTarget.reset()
  }

  return (
    <Dialog>
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
            <DialogClose asChild>
              <Button type="submit" variant="secondary">
                Add
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
