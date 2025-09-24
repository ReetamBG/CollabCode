"use client"

import { Editor } from "@monaco-editor/react";
import useFilesStore from "@/store/files.store";
import { X } from "lucide-react";
import { getFileIconFromExtension } from "@/lib/utils";

export default function EditorComponent() {
  const { currentFile, updateCurrentFile } = useFilesStore();

  if (!currentFile) {
    return <div className="w-full h-dvh grid place-content-center">Choose a file</div>
  }
  return (
    <>
      <EditorTabs />
      <Editor
        className=""
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

const EditorTabs = () => {
  const { currentFile, openedEditors, setCurrentFile, removeFileFromOpenedEditors } = useFilesStore();

  return (
    <div className="flex items-center">
      {openedEditors.map((file) => {
        const fileExt = file.name.split(".").pop()?.toLowerCase();
        const { icon: Icon, color } = getFileIconFromExtension(fileExt || "");
        return (
          <div
            key={file.id}
            onClick={() => setCurrentFile(file)}
            className={`px-2 py-2 border-r-2 cursor-pointer flex items-center justify-between gap-1  min-w-30 ${currentFile?.id === file.id ? "bg-foreground/8" : ""
              }`}
          >
            <span className="text-sm flex items-center gap-2"><Icon color={color} size={12} />{file.name}</span>  
            <button onClick={(e)=> {
              e.stopPropagation();   // prevents the click event from bubbling up to the parent div reopening the tab
              removeFileFromOpenedEditors(file);
            }} className="cursor-pointer hover:bg-foreground/20 p-1 rounded-full"><X size={10} /></button>
          </div>
        )
      })}
    </div>
  );
}