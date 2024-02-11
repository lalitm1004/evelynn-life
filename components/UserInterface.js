"use client"
import { useState, useEffect } from "react"

import { Terminal } from "@/providers/fonts";

export default function UserInterface({ basePath }) {

  const defaultCursor = "_";

  const [display, setDisplay] = useState(">");
  const [path, setPath] = useState(basePath);
  const [cursor, setCursor] = useState(defaultCursor)

  useEffect(() => {
    const handleCommand = (syntax) => {
      const syntaxSplit = syntax.split(" ");
      const command = syntaxSplit[0];
      const args = syntaxSplit.slice(1);

      if (syntax === "") {
        return;
      }

      else if (command.toLowerCase() === "clear") {
        setDisplay(">");
      }

      else if (command.toLowerCase() === "go") {
        if (path == basePath) {
          setDisplay((prevDisplay) => `${prevDisplay}\nevelynn: redirect redundant`);
        }
        else {
          const newWindow = window.open(path, "_blank", "noopener,noreferrer");
          if (newWindow) newWindow.opener = null;
          setDisplay((prevDisplay) => `${prevDisplay}\nevelynn: redirect successful`)
        }
      }

      else if (command.toLowerCase() === "cd") {
        let targetPath;
        if (args.length === 0) {
          targetPath = "/";
        }

        else if (args[0] === "..") {
          const prevPath = path;
          const prevPathSplit = prevPath.split("/")
          const newPath = prevPathSplit.slice(0,prevPathSplit.length - 1).join("/")
          targetPath = (newPath.length === 0)? "/" : newPath
        }

        else {
          const prevPath = path;
          const formattedPath = args[0].replace(/^\/+|\/+$/g, "").replace(/\/+/g, '/');
          if (formattedPath === "..") {
            targetPath = "/";
          }
          else if (formattedPath === "") {
            targetPath = prevPath;
          }
          else {
            if (prevPath==="/") {
              targetPath = `${prevPath}${formattedPath}`;
            } else {
              targetPath = `${prevPath}/${formattedPath}`;
            }
          }
        }
        setPath(targetPath)
      }

      else {
        setDisplay((prevDisplay) => `${prevDisplay}\nevelynn: ${command}: command not found`)
      }
    }

    const handleKeyDown = (event) => {
      const key = event.key;
      if ([
        "Alt", "Escape", "Control", "Shift", "Meta", "Tab",
        "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
        "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
        "NumLock", "CapsLock",
        "Delete", "Pause",
        "AudioVolumeUp", "AudioVolumeDown",
        "\\",
      ].indexOf(key) !== -1) {
        return;
      }

      else if (key === "Enter") {
        const displaySplit = display.split(">")
        const syntax = displaySplit[displaySplit.length - 1].trim();

        handleCommand(syntax);
        if (!(syntax.toLowerCase().startsWith("clear"))) setDisplay((prevDisplay) => `${prevDisplay}\n>`);
      }

      else if (key === "Backspace") {
        setDisplay((prevDisplay) => {
          const prevLen = prevDisplay.length;
          if (prevDisplay[prevLen - 2] + prevDisplay[prevLen - 1] === "\n>" || prevLen === 1) {
            return `${prevDisplay}`;
          } else {
            return `${prevDisplay.slice(0, prevLen-1)}`;
          }
        });
      }

      else {
        setDisplay((prevDisplay) => `${prevDisplay}${key}`)
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  })

  // Scroll Effect
  useEffect(() => {
    const terminal = document.getElementById("terminal");
    terminal.scrollTo({top: document.body.scrollHeight, behavior:"smooth"});
  }, [display])

  // Cursor Effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCursor((prevCursor) => (prevCursor === defaultCursor ? "" : defaultCursor));
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`${Terminal.className} user-interface h-screen flex flex-col justify-end`}>
      <div id="terminal" className="overflow-y-auto">
        <pre className={Terminal.className}>
          {display}{cursor}
        </pre>
      </div>
      <hr />
      <div className="">
        <p className={`path`}>{path}</p>
      </div>
    </div>
  );
}