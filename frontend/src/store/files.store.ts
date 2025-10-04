"use client"

import { create } from 'zustand'
// import * as monaco from 'monaco-editor';   // causes some problem with nextjs build. have to manually map file extensions to languages
import { getLanguageFromExtension } from '@/lib/utils';   // using this manual mapping instead for now
import { v4 as uuidv4 } from 'uuid';

export interface File {
  id: string;
  name: string;
  language: string;
  value: string;
  parentFolder?: string;
}

export interface Folder {
  id: string;
  name: string;
  files: string[];    // file ids
  folders: string[];  // folder ids
  parentFolder?: string;
}

// only needed for the sidebar file tree view. updation and all is done in the files and folders array
export interface FileTree {
  files: string[];    // file ids
  folders: string[];  // folder ids
}

type Store = {
  fileTree: FileTree;
  files: File[];
  folders: Folder[];
  openedEditors: File[];
  currentFile: File | null;
  setCurrentFile: (file: File) => void;
  addFileToOpenedEditors: (file: File) => void;
  removeFileFromOpenedEditors: (file: File) => void;
  updateCurrentFile: (value: string) => void;
  createNewFile: (fileName: string, parentFolder?: Folder) => void;
  createNewFolder: (folderName: string, parentFolder?: Folder) => void;
  deleteFile: (fileId: string) => void;
  deleteFolder: (folderId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  renameFolder: (folderId: string, newName: string) => void;
}

const useFilesStore = create<Store>()((set, get) => ({
  fileTree: { files: [], folders: [] },
  files: [],
  folders: [],
  openedEditors: [],
  currentFile: null,

  setCurrentFile: (file: File) => set(() => ({ currentFile: file })),

  addFileToOpenedEditors: (file: File) => {
    const exists = get().openedEditors.find(f => f.id === file.id);
    if (!exists) {
      set(state => ({ openedEditors: [...state.openedEditors, file] }));
    }
  },

  removeFileFromOpenedEditors: (file: File) => {
    const currentOpenedEditors = get().openedEditors;
    const updatedOpenedEditors = currentOpenedEditors.filter(f => f.id !== file.id);
    set(() => ({ openedEditors: updatedOpenedEditors }));

    // if current file is closed, handle the currentFile update
    if (get().currentFile?.id === file.id) {
      // if there are still opened editors, set currentFile to the last one
      if (updatedOpenedEditors.length > 0) {
        set({ currentFile: updatedOpenedEditors[updatedOpenedEditors.length - 1] });
      }
      // if no open editors left, set currentFile to null
      else {
        set({ currentFile: null });
      }
    }
  },

  updateCurrentFile: (value: string) => {
    // update currentFile 
    set(state => {
      if (!state.currentFile) return {};
      return { currentFile: { ...state.currentFile, value } };
    });

    // update the files list with the new currentFile
    set(state => ({
      files: state.files.map(f => f.id === state.currentFile?.id ? { ...f, value } : f)
    }))
  },

  createNewFile: (fileName: string, parentFolder?: Folder) => {
    if (!fileName) return
    if (get().files.find(f => f.name === fileName)) {
      alert("File with this name already exists")
      return
    }

    const ext = fileName.split(".").pop()?.toLowerCase();
    let language = "plaintext";
    if (ext) {
      // const association = monaco.languages.getLanguages();
      // language = association.find(l => l.extensions?.includes(`.${ext}`))?.id || "plaintext";
      // above code causes some problem with nextjs build. have to manually map file extensions to languages
      language = getLanguageFromExtension(ext);
    }

    const newFile: File = {
      id: uuidv4(),
      name: fileName,
      language,
      value: "",
      parentFolder: parentFolder ? parentFolder.id : undefined
    };

    if (parentFolder) {
      // Ensure file name unique inside the folder
      if (parentFolder.files.find(fId => get().files.find(f => f.id === fId)?.name === fileName)) {
        alert("File with this name already exists in this folder");
        return;
      }

      // update folder structure
      parentFolder.files.push(newFile.id);
      set(state => ({ folders: [...state.folders] }));  // trigger rerender
    } else {
      // Root-level file
      // ensure file name unique in root
      if (get().files.find(f => f.name === fileName)) {
        alert("File with this name already exists at root");
        return;
      }
      // add it to fileTree (if a file is inside a folder its handled there recursively so no need to handle it here)
      set(state => ({ fileTree: { ...state.fileTree, files: [...state.fileTree.files, newFile.id] } }));
    }

    // update files array
    set(state => ({ files: [...state.files, newFile] }));

    if (!get().currentFile) {
      set({ currentFile: newFile, openedEditors: [newFile] });
    }
  },

  createNewFolder: (folderName: string, parentFolder?: Folder) => {
    if (!folderName) return

    console.log("Creating folders")

    const newFolder: Folder = {
      id: uuidv4(),
      name: folderName,
      files: [],
      folders: [],
      parentFolder: parentFolder ? parentFolder.id : undefined
    }

    if (parentFolder) {
      // ensure folder name unique inside the parent folder
      if (parentFolder.folders.find(fId => get().folders.find(f => f.id === fId)?.name === folderName)) {
        alert("Folder with this name already exists in this folder");
        return;
      }
      // Add to parent folder
      parentFolder.folders.push(newFolder.id);
      set(state => ({ folders: [...state.folders] }));  // trigger rerender
    } else {
      // top-level folder
      // ensure folder name unique in root
      if (get().folders.find(f => f.name === folderName)) {
        alert("Folder with this name already exists in root");
        return;
      }
      // add it to fileTree (if a folder is inside a folder its handled there recursively so no need to handle it here)
      set(state => ({ fileTree: { ...state.fileTree, folders: [...state.fileTree.folders, newFolder.id] } }));
    }

    // update folders array
    set(state => ({ folders: [...state.folders, newFolder] }));
  },

  deleteFile: (fileId: string) => {
    const fileToDelete = get().files.find(f => f.id === fileId);
    if (!fileToDelete) {
      alert("File not found");
      return;
    }

    // remove from files
    set(state => ({ files: state.files.filter(f => f.id !== fileId) }));

    // remove from parent folder if any
    if (fileToDelete.parentFolder) {
      const parent = get().folders.find(f => f.id === fileToDelete.parentFolder);
      if (parent) {
        parent.files = parent.files.filter(fId => fId !== fileId);
        set(state => ({ folders: [...state.folders] }));  // trigger rerender
      }
    } else {
      // remove from root fileTree
      set(state => ({ fileTree: { ...state.fileTree, files: state.fileTree.files.filter(fId => fId !== fileId) } }));
    }

    // if the deleted file is the currentFile, set currentFile to null
    if (get().currentFile?.id === fileId) {
      set({ currentFile: null });
    }
  },

  deleteFolder: (folderId: string) => {
    const folderToDelete = get().folders.find(f => f.id === folderId);
    if (!folderToDelete) {
      alert("Folder not found");
      return;
    }

    // delete everything inside folder recursively
    const deleteFilesInFolder = (folder: Folder) => {
      folder.files.forEach(fileId => {
        const file = get().files.find(f => f.id === fileId);
        if (file && get().currentFile?.id === fileId) {
          set({ currentFile: null });
        }
      });
      set(state => ({ files: state.files.filter(f => !folder.files.includes(f.id)) }));
    };

    const deleteFoldersInFolder = (folder: Folder) => {
      folder.folders.forEach(subFolderId => {
        const subFolder = get().folders.find(f => f.id === subFolderId);
        if (subFolder) {
          deleteFilesInFolder(subFolder);
          deleteFoldersInFolder(subFolder);
        }
      });
    };

    deleteFilesInFolder(folderToDelete);
    deleteFoldersInFolder(folderToDelete);

    // remove from parent folder if any
    if (folderToDelete.parentFolder) {
      const parent = get().folders.find(f => f.id === folderToDelete.parentFolder);
      if (parent) {
        parent.folders = parent.folders.filter(fId => fId !== folderId);
        set(state => ({ folders: [...state.folders] }));
      }
    } else {
      // remove from root fileTree
      set(state => ({ fileTree: { ...state.fileTree, folders: state.fileTree.folders.filter(fId => fId !== folderId) } }));
    }

    // if the deleted folder is the parent of currentFile, set currentFile to null
    if (get().currentFile?.parentFolder === folderId) {
      set({ currentFile: null });
    }

    // finally delete the folder itself
    set(state => ({ folders: state.folders.filter(f => f.id !== folderId) }));
  },

  renameFile: (fileId: string, newName: string) => {
    if (!newName.trim()) return;

    const fileToRename = get().files.find(f => f.id === fileId);
    if (!fileToRename) {
      alert("File not found");
      return;
    }

    // Check for duplicate names in the same scope
    if (fileToRename.parentFolder) {
      const parent = get().folders.find(f => f.id === fileToRename.parentFolder);
      if (parent) {
        const siblingFiles = parent.files.map(fId => get().files.find(f => f.id === fId)).filter(f => f && f.id !== fileId);
        if (siblingFiles.some(f => f?.name === newName)) {
          alert("A file with this name already exists in this folder");
          return;
        }
      }
    } else {
      // Root level file
      const rootFiles = get().files.filter(f => !f.parentFolder && f.id !== fileId);
      if (rootFiles.some(f => f.name === newName)) {
        alert("A file with this name already exists at root level");
        return;
      }
    }

    // Update language based on new extension
    const ext = newName.split(".").pop()?.toLowerCase();
    let language = "plaintext";
    if (ext) {
      // const association = monaco.languages.getLanguages();
      // language = association.find(l => l.extensions?.includes(`.${ext}`))?.id || "plaintext";

      // above code causes some problem with nextjs build. have to manually map file extensions to languages
      language = getLanguageFromExtension(ext);
    }

    // Update file
    set(state => ({
      files: state.files.map(f =>
        f.id === fileId ? { ...f, name: newName, language } : f
      )
    }));

    // Update currentFile if it's the renamed file
    if (get().currentFile?.id === fileId) {
      set(state => ({
        currentFile: state.currentFile ? { ...state.currentFile, name: newName, language } : null
      }));
    }
  },

  renameFolder: (folderId: string, newName: string) => {
    if (!newName.trim()) return;

    const folderToRename = get().folders.find(f => f.id === folderId);
    if (!folderToRename) {
      alert("Folder not found");
      return;
    }

    // Check for duplicate names in the same scope
    if (folderToRename.parentFolder) {
      const parent = get().folders.find(f => f.id === folderToRename.parentFolder);
      if (parent) {
        const siblingFolders = parent.folders.map(fId => get().folders.find(f => f.id === fId)).filter(f => f && f.id !== folderId);
        if (siblingFolders.some(f => f?.name === newName)) {
          alert("A folder with this name already exists in this folder");
          return;
        }
      }
    } else {
      // Root level folder
      const rootFolders = get().folders.filter(f => !f.parentFolder && f.id !== folderId);
      if (rootFolders.some(f => f.name === newName)) {
        alert("A folder with this name already exists at root level");
        return;
      }
    }

    // Update folder
    set(state => ({
      folders: state.folders.map(f =>
        f.id === folderId ? { ...f, name: newName } : f
      )
    }));
  }
}))

export default useFilesStore
