import { ChevronDown, ChevronRight } from 'lucide-react'
import React, { FormEvent, useState } from 'react'
import useFilesStore, { Folder } from "@/store/files.store"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './ui/context-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem } from '@/components/ui/sidebar'
import SidebarFile from './EditorSidebarFile'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,  } from './ui/alert-dialog'
import { RiFolderFill, RiFolderOpenFill } from "react-icons/ri";

const SidebarFolder = ({ folderId }: { folderId: string }) => {
  const [expandFolder, setExpandFolder] = useState(false)
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [showRenameFolderDialog, setShowRenameFolderDialog] = useState(false)
  const [deleteFolderAlertOpen, setDeleteFolderAlertOpen] = useState(false)

  const { folders } = useFilesStore()
  const folder = folders.find(f => f.id === folderId)!

  return (
    <>
      <Collapsible open={expandFolder} onOpenChange={setExpandFolder} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton >
            {/* folder */}
            <ContextMenu>
              <ContextMenuTrigger className='w-full cursor-pointer'>
                <div className="select-none flex gap-2 items-center">
                  {expandFolder ? <RiFolderOpenFill color="#fbbf24" size={18} /> : <RiFolderFill color="#fbbf24" size={18} />}
                  {folder.name}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => setShowNewFileDialog(true)}>New file...</ContextMenuItem>
                <ContextMenuItem onClick={() => setShowNewFolderDialog(true)}>New folder...</ContextMenuItem>
                <ContextMenuItem onClick={() => setDeleteFolderAlertOpen(true)}>Delete</ContextMenuItem>
                <ContextMenuItem onClick={() => setShowRenameFolderDialog(true)}>Rename...</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            {expandFolder ? <ChevronDown /> : <ChevronRight />}
          </SidebarMenuButton >
        </CollapsibleTrigger>
        <CollapsibleContent>
          {/* recursive folder structure */}
          {folder.folders.map((fId) => (
            <SidebarMenuSub className="pr-0 mr-0" key={fId}>
              <SidebarMenuSubItem >
                <SidebarFolder key={fId} folderId={fId} />
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          ))}
          {folder.files.map((fId) => (
            <SidebarMenuSub className="pr-0 mr-0" key={fId}>
              <SidebarMenuSubItem>
                <SidebarFile fileId={fId} />
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          ))}
        </CollapsibleContent>
      </Collapsible>
      {/* recursive folder structure */}

      <AddFileDialog parentFolder={folder} open={showNewFileDialog} setOpen={setShowNewFileDialog} />
      <AddFolderDialog parentFolder={folder} open={showNewFolderDialog} setOpen={setShowNewFolderDialog} />
      <DeleteFolderAlert open={deleteFolderAlertOpen} setOpen={setDeleteFolderAlertOpen} folderId={folder.id} />
      <RenameFolderDialog folderId={folder.id} open={showRenameFolderDialog} setOpen={setShowRenameFolderDialog} />
    </>
  )
}

interface AddDialogProps {
  open: boolean,
  setOpen: (open: boolean) => void,
  parentFolder?: Folder
}

const AddFileDialog = ({ open, setOpen, parentFolder }: AddDialogProps) => {
  const { createNewFile } = useFilesStore()

  function handleCreateNewFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const fileName = formData.get("fileName") as string
    if (fileName) {
      createNewFile(fileName, parentFolder)
      setOpen(false)
    }
    e.currentTarget.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

const AddFolderDialog = ({ open, setOpen, parentFolder }: AddDialogProps) => {
  const { createNewFolder } = useFilesStore()

  function handleCreateNewFolder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const folderName = formData.get("folderName") as string
    if (folderName) {
      createNewFolder(folderName, parentFolder)
      setOpen(false)
    }
    e.currentTarget.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

const RenameFolderDialog = ({ open, setOpen, folderId }: { open: boolean, setOpen: (open: boolean) => void, folderId: string }) => {
  const { renameFolder } = useFilesStore()

  function handleRenameFolder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const folderName = formData.get("folderName") as string
    if (folderName) {
      renameFolder(folderId, folderName)
      setOpen(false)
    }
    e.currentTarget.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename folder</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <form onSubmit={handleRenameFolder} className="flex flex-col gap-4">
          <Input
            type="text"
            name="folderName"
            placeholder="Enter folder name"
          />
          <DialogFooter className="sm:justify-start">
            <Button type="submit" variant="default">
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const DeleteFolderAlert = ({ open, setOpen, folderId }: { open: boolean, setOpen: (open: boolean) => void, folderId: string }) => {
  const { deleteFolder } = useFilesStore()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your folder
            and remove all its contents.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteFolder(folderId)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SidebarFolder