import React, { FormEvent, useState } from 'react'
import useFilesStore from "@/store/files.store"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { SidebarMenuButton } from './ui/sidebar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { AlertDialogHeader, AlertDialogFooter } from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getFileIconFromExtension } from '@/lib/utils';

const SidebarFile = ({ fileId }: { fileId: string }) => {
  const { setCurrentFile, currentFile, addFileToOpenedEditors } = useFilesStore();

  const [showRenameFileDialog, setShowRenameFileDialog] = useState(false)
  const [deleteFileAlertOpen, setDeleteFileAlertOpen] = useState(false)

  const { files } = useFilesStore()
  const file = files.find(f => f.id === fileId)!

  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const {icon: Icon, color} = getFileIconFromExtension(fileExt || "");

  return (
    <>
      <SidebarMenuButton 
      className={`cursor-pointer ${file.id === currentFile?.id ? 'bg-muted' : ''}`}
       onClick={
        () => {
          setCurrentFile(file)
          addFileToOpenedEditors(file)
        }

      }
       >
        <ContextMenu>
          <ContextMenuTrigger className='w-full'>
            <div className="select-none cursor-pointer flex gap-2 items-center">
              <Icon color={color} size={15} />
              {file.name}
              </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => setDeleteFileAlertOpen(true)}>Delete</ContextMenuItem>
            <ContextMenuItem onClick={() => setShowRenameFileDialog(true)}>Rename...</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </SidebarMenuButton>

      <RenameFileDialog open={showRenameFileDialog} setOpen={setShowRenameFileDialog} fileId={file.id} />
      <DeleteFileAlert open={deleteFileAlertOpen} setOpen={setDeleteFileAlertOpen} fileId={file.id} />
    </>
  )
}


const RenameFileDialog = ({ open, setOpen, fileId }: { open: boolean, setOpen: (open: boolean) => void, fileId: string }) => {
  const { renameFile } = useFilesStore()

  function handleRenameFile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const fileName = formData.get("fileName") as string
    if (fileName) {
      renameFile(fileId, fileName)
      setOpen(false)
    }
    e.currentTarget.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
          <DialogDescription className="hidden" />
        </DialogHeader>
        <form onSubmit={handleRenameFile} className="flex flex-col gap-4">
          <Input
            type="text"
            name="fileName"
            placeholder="Enter file name"
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

const DeleteFileAlert = ({ open, setOpen, fileId }: { open: boolean, setOpen: (open: boolean) => void, fileId: string }) => {
  const { deleteFile } = useFilesStore()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your file
            and remove all its contents.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteFile(fileId)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


export default SidebarFile