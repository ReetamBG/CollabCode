"use client"

import Editor from "@/components/Editor";
import useFilesStore from "@/store/files.store";
import { useEffect } from "react";

export default function Home() {

  // load and store files 
  // need to set these in top level components otherwise they cause problem
  // setting it in sidebar as files are actually used there ... ?? idk doenst work there
  const { files } = useFilesStore();

  useEffect(() => {
    const savedFiles = localStorage.getItem("files");
    if (savedFiles) {
      const files = JSON.parse(savedFiles);
      useFilesStore.setState({ files });
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
  }, [files])

  return (
    <>
      <Editor />
    </>
  );
}
