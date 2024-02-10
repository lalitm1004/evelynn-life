"use client"
import { useState, useEffect } from "react"

export default function UserInterface({ basePath }) {
  const [display, setDisplay] = useState(">");
  const [path, setPath] = useState(basePath);

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

      else if (command.toLowerCase() === "evelynn") {
        const newWindow = window.open("/evelynn", '_blank', "noopener,noreferrer")
        if (newWindow) newWindow.opener = null;
        setDisplay((prevDisplay) => `${prevDisplay}\nevelynn: redirect successful`)
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
          if (prevPath==="/") {
            targetPath = `${prevPath}${args[0].replace(/^\/+|\/+$/g, "")}`;
          } else {
            targetPath = `${prevPath}/${args[0].replace(/^\/+|\/+$/g, "")}`;
          }
        }
        console.log(targetPath)
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
        "AudioVolumeUp", "AudioVolumeDown"
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

  useEffect(() => {
    window.scrollTo({top: document.body.scrollHeight, behavior:"smooth"});
  }, [display])

  return (
    <div className="user-interface">
      <p className="path">{path}</p>
      <pre>
        {display}
      </pre>
    </div>
  );
}