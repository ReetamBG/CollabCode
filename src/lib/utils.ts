import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
      