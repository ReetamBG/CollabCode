"use client"

import { Editor  } from "@monaco-editor/react";
import useFilesStore from "@/store/files.store";

export default function EditorComponent() {
  const {currentFile, updateCurrentFile} = useFilesStore();

  if (!currentFile) {
    return <div>Choose a file</div>
  }
  return (
    <>
      {currentFile.name}
      <Editor
        height="100vh"
        defaultValue=""
        theme="vs-dark" 
        path={currentFile.name}
        language={currentFile.language}
        value={currentFile.value}
        onChange={value => updateCurrentFile(value || "")}
      />
    </>
  );
}