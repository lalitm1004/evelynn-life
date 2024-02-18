"use client";
import { useState, useEffect } from "react";

import { Terminal } from "@/providers/fonts";

export default function Home() {

  /* ---------------------------------------------------------------------------------------------------- */
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia('(max-width: 767px)'); // Adjust the breakpoint as needed

    const handleMobileChange = (event) => {
      setIsMobile(event.matches);
    };

    mobileMediaQuery.addEventListener('change', handleMobileChange);
    setIsMobile(mobileMediaQuery.matches);

    return () => {
      mobileMediaQuery.removeEventListener('change', handleMobileChange);
    };
  }, [])
  /* ---------------------------------------------------------------------------------------------------- */


  /* ---------------------------------------------------------------------------------------------------- */
  const [display, setDisplay] = useState(">");
  const [path, setPath] = useState("/");
  const [allowInput, setAllowInput] = useState(true);

  const appendToDisplay = (append) => {
    setDisplay((prevDisplay) => `${prevDisplay}${append}`);
  }

  const handleCommand = async (syntax) => {
    if (syntax == "") return;

    setAllowInput(false);
    const syntaxSplit = syntax.split(" ");
    const command = syntaxSplit[0];
    const args = syntaxSplit.slice(1);


    if (command.toLowerCase() === "clear") {
      setDisplay(">")
    }

    else if (command.toLowerCase() === "go") {
      if (path == "/") {
        setDisplay((prevDisplay) => `${prevDisplay}\nevelynn: redirect redundant`);
      }
      else {
        const newWindow = window.open(path, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        setDisplay((prevDisplay) => `${prevDisplay}\nevelynn: redirect successful`)
      }
    }

    else if (command.toLowerCase() === "test") {
      appendToDisplay("tested");
      await new Promise(r => setTimeout(r, 2000));
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
        targetPath = (newPath.length === 0) ? "/" : newPath
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
      appendToDisplay(`\nevelynn: ${command}: command not found`)
    }
    setAllowInput(true);
  }
  /* ---------------------------------------------------------------------------------------------------- */


  /* ---------------------------------------------------------------------------------------------------- */
  const handleKeyDown = async (event) => {
    if (!allowInput) return;

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
      const displaySplit = display.split(">");
      const syntax = displaySplit[displaySplit.length - 1].trim()
      await handleCommand(syntax).then(() => {
        if (!(syntax.toLowerCase().startsWith("clear"))) {
          appendToDisplay("\n>");
        }
      });
    }

    else if (key === "Backspace") {
      setDisplay((prevDisplay) => {
        const prevLen = prevDisplay.length;
        if (prevDisplay[prevLen - 2] + prevDisplay[prevLen - 1] === "\n>" || prevLen === 1) {
          return prevDisplay;
        } else {
          return `${prevDisplay.slice(0, prevLen - 1)}`
        }
      })
    }

    else {
      appendToDisplay(key);
    }

  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  })
  /* ---------------------------------------------------------------------------------------------------- */


  /* ---------------------------------------------------------------------------------------------------- */
  // Scroll Effect
  useEffect(() => {
    const terminal = document.getElementById("terminal");
    terminal.scrollTo({top: document.body.scrollHeight, behavior:"smooth"});
  }, [display])
  /* ---------------------------------------------------------------------------------------------------- */


  /* ---------------------------------------------------------------------------------------------------- */
  // Cursor Effect
  const [displayCursor, setDisplayCursor] = useState(true);
  const defaultCursor = "|"

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayCursor((prevDisplay) => !prevDisplay);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);
  /* ---------------------------------------------------------------------------------------------------- */


  return (
    <main>
      {isMobile ? (
        <div className={`${Terminal.className} min-h-screen flex justify-center items-center`}>
          <p>Mobile devices are not supported...</p>
        </div>
      ) : (
      <div className="min-h-screen ">
        <div className={`${Terminal.className} user-interface h-screen flex flex-col justify-end`}>

          <div id="terminal" className="overflow-y-auto">
            <pre className={Terminal.className}>
              {display}{(displayCursor && allowInput) ? (defaultCursor) : ("")}
            </pre>
          </div>

          <hr />

          <div className="diagnostic flex justify-between items-center">
            <div className="path flex-grow  border-r-white border-r-2">
              <p>{path}</p>
            </div>
            <div className="user flex-shrink mx-2">
              <p>not logged in</p>
            </div>
          </div>

        </div>
      </div>)}
    </main>
  );
}
