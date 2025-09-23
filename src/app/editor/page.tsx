"use client"

import EditorComponent from "@/components/Editor";
import useFilesStore from "@/store/files.store";
import { useEffect } from "react";

export default function Home() {

  // load and store files 
  // need to set these in top level components otherwise they cause problem
  // setting it in sidebar as files are actually used there ... ?? idk doenst work there
  const { files, folders, fileTree } = useFilesStore();

  useEffect(() => {
    const savedFiles = localStorage.getItem("files");
    const savedFolders = localStorage.getItem("folders");
    const savedFileTree = localStorage.getItem("fileTree");
    if (savedFiles) {
      const files = JSON.parse(savedFiles);
      useFilesStore.setState({ files });
    }
    if (savedFolders) {
      const folders = JSON.parse(savedFolders);
      useFilesStore.setState({ folders });
    }
    if (savedFileTree) {
      const fileTree = JSON.parse(savedFileTree);
      useFilesStore.setState({ fileTree });
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
    localStorage.setItem("folders", JSON.stringify(folders));
    localStorage.setItem("fileTree", JSON.stringify(fileTree));
  }, [files, fileTree, folders])

  return (
    <>
      <EditorComponent />
    </>
  );
}
