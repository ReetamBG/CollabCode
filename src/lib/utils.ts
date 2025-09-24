import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { IconType } from "react-icons";
import { 
  SiJavascript, SiTypescript, SiReact, SiPython,  SiGo, SiRust, 
  SiPhp, SiRuby, SiC, SiCplusplus, SiHtml5, SiCss3, SiMarkdown 
} from "react-icons/si";
import { FiFile } from "react-icons/fi"; // generic file icon


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Manually map file extensions to Monaco Editor language identifiers
// This is a workaround for issues with Next.js build when importing monaco-editor
export function getLanguageFromExtension(ext: string): string {
  const map: Record<string, string> = {
    // JavaScript / TypeScript
    "js": "javascript",
    "mjs": "javascript",
    "cjs": "javascript",
    "ts": "typescript",
    "tsx": "typescript",
    "jsx": "javascript",

    // Python
    "py": "python",

    // Java
    "java": "java",

    // C / C++
    "c": "c",
    "h": "c",
    "cpp": "cpp",
    "hpp": "cpp",
    "cc": "cpp",
    "hh": "cpp",

    // Go
    "go": "go",

    // Rust
    "rs": "rust",

    // C#
    "cs": "csharp",

    // PHP
    "php": "php",

    // HTML / XML
    "html": "html",
    "htm": "html",
    "xhtml": "html",
    "xml": "xml",

    // CSS / SCSS / Less
    "css": "css",
    "scss": "scss",
    "less": "less",

    // JSON / YAML / TOML
    "json": "json",
    "jsonc": "jsonc",
    "yml": "yaml",
    "yaml": "yaml",
    "toml": "toml",

    // Shell / Batch
    "sh": "shell",
    "bash": "shell",
    "zsh": "shell",
    "bat": "bat",
    "cmd": "bat",

    // SQL
    "sql": "sql",

    // Markdown
    "md": "markdown",
    "markdown": "markdown",

    // Docker / Terraform
    "dockerfile": "dockerfile",
    "tf": "terraform",

    // Others
    "json5": "json",
    "ini": "ini",
    "graphql": "graphql",
    "r": "r",
    "dart": "dart",
    "swift": "swift",
    "kotlin": "kotlin",
    "scala": "scala",
    "perl": "perl",
    "pl": "perl",
    "rb": "ruby",
    "lua": "lua",
    "makefile": "makefile",
  };

  return map[ext.toLowerCase()] || "plaintext";
}

type IconWithColor = { icon: IconType; color: string };

export function getFileIconFromExtension(ext: string): IconWithColor {
  const map: Record<string, IconWithColor> = {
    js:   { icon: SiJavascript, color: "#F7DF1E" },
    ts:   { icon: SiTypescript, color: "#3178C6" },
    tsx:  { icon: SiReact,      color: "#61DAFB" },
    jsx:  { icon: SiReact,      color: "#61DAFB" },
    py:   { icon: SiPython,     color: "#3776AB" },
    // java: { icon: SiJava,       color: "#007396" },
    go:   { icon: SiGo,         color: "#00ADD8" },
    rs:   { icon: SiRust,       color: "#FF4B33" },
    php:  { icon: SiPhp,        color: "#777BB4" },
    rb:   { icon: SiRuby,       color: "#CC342D" },
    c:    { icon: SiC,          color: "#A8B9CC" },
    cpp:  { icon: SiCplusplus,  color: "#00599C" },
    html: { icon: SiHtml5,      color: "#E34F26" },
    css:  { icon: SiCss3,       color: "#1572B6" },
    scss: { icon: SiCss3,       color: "#CC6699" },
    md:   { icon: SiMarkdown,   color: "#000000" },
  };

  return map[ext.toLowerCase()] || { icon: FiFile, color: "#808080" };
}