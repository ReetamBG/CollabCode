"use client"

import EditorComponent from "@/components/Editor";
import useFilesStore from "@/store/files.store";
import { useEffect } from "react";

export default function Home() {

  // load and store files 
  // need to set these in top level components otherwise they cause problem
  // setting it in sidebar as files are actually used there ... ?? idk doenst work there
  const { files, folders, fileTree, openedEditors, currentFile } = useFilesStore();

  useEffect(() => {
    const savedFiles = localStorage.getItem("files");
    const savedFolders = localStorage.getItem("folders");
    const savedFileTree = localStorage.getItem("fileTree");
    const currentFile = localStorage.getItem("currentFile");
    const openedEditors = localStorage.getItem("openedEditors");
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
    if (openedEditors) {
      const openedEditorsParsed = JSON.parse(openedEditors);
      useFilesStore.setState({ openedEditors: openedEditorsParsed });
    }
    if (currentFile) {
      const currentFileParsed = JSON.parse(currentFile);
      useFilesStore.setState({ currentFile: currentFileParsed });
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
    localStorage.setItem("folders", JSON.stringify(folders));
    localStorage.setItem("fileTree", JSON.stringify(fileTree));
    localStorage.setItem("openedEditors", JSON.stringify(openedEditors));
    localStorage.setItem("currentFile", JSON.stringify(currentFile));
  }, [files, fileTree, folders, openedEditors, currentFile])

  return (
    <>
      <EditorComponent />
    </>
  );
}
