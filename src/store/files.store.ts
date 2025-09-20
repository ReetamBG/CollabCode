"use client"

import { create } from 'zustand'
import * as monaco from 'monaco-editor';

export interface File {
  name: string;
  language: string;
  value: string;
}

type Store = {
  files: File[]
  currentFile: File | null
  setCurrentFile: (file: File) => void
  updateCurrentFile: (value: string) => void
  createNewFile: (fileName: string) => void
}


const useFilesStore = create<Store>()((set, get) => ({
  files: [],
  currentFile: null,

  setCurrentFile: (file: File) => set(() => ({ currentFile: file })),

  updateCurrentFile: (value: string) => {
    // update currentFile
    set(state => {
      if (!state.currentFile) return {};
      return { currentFile: {...state.currentFile, value } };
    });
    // update the files list with the new currentFile
    set(state => ({
      files: state.files.map(f => f.name === state.currentFile?.name ? { ...f, value } : f)
    }))
  },

  createNewFile: (fileName: string) => {
    if (!fileName) return
    if (get().files.find(f => f.name === fileName)) {
      alert("File with this name already exists")
      return
    }

    const ext = fileName.split(".").pop()?.toLowerCase();
    let language = "plaintext";
    if (ext) {
      const association = monaco.languages.getLanguages();
      language = association.find(l => l.extensions?.includes(`.${ext}`))?.id || "plaintext";
    }

    console.log(language)

    const newFile: File = {
      name: fileName,
      language,
      value: "",
    };

    set(state => ({
      files: [...state.files, newFile],
    }));
  }

  // deleteFilVe: (file) => {
    
  // }
}))

export default useFilesStore
