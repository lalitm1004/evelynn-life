"use client";
import { useState, useEffect, useContext } from "react";

import { Terminal } from "@/providers/fonts";
import { SessionContext } from "@/providers/SessionProvider";
import axios from "axios";

export default function Home() {
  
  const {username, trust, setUsername, setTrust} = useContext(SessionContext)
  const [display, setDisplay] = useState(">");
  const [path, setPath] = useState("/");
  const [allowInput, setAllowInput] = useState(true);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  const [isMobile, setIsMobile] = useState(false);

  /* ---------------------------------------------------------------------------------------------------- */
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
  const appendToDisplay = (append) => {
    setDisplay((prevDisplay) => `${prevDisplay}${append}`);
  }

  const handleCommand = async (syntax) => {
    if (syntax == "") return;
    const commandList = [
      "clear", "login", "logout", "register", "go", "cd", "test", "createregcode"
    ]

    setAllowInput(false);
    const syntaxSplit = syntax.split(" ");
    const command = syntaxSplit[0];
    const args = syntaxSplit.slice(1);

    if (commandList.indexOf(command.toLowerCase()) === -1) {
      appendToDisplay(`\nevelynn: ${command}: command not found`)
    }

    else if (command.toLowerCase() === "test") {
      const string = `hello how are you`;
      appendToDisplay("\n")
      for (const letter of string) {
        appendToDisplay(letter);
        await new Promise(r => setTimeout(r, 30))
      }
    }

    else if (command.toLowerCase() === "clear") {
      setDisplay(">")
    }

    else if (command.toLowerCase() === "login") {
      const inputUsername = args[0];
      const inputPassword = args[1];

      console.log(inputUsername)
      console.log(inputPassword)

      if (username) {
        appendToDisplay("\nevelynn: login: login redundant")
      }

      else if (!(inputUsername && inputPassword)) {
        appendToDisplay("\nevelynn: login: Invalid arguments /login <username> <password>")
      } 

      else {
        const apiLogin = async () => {
          const postData = {
            username: inputUsername,
            password: inputPassword,
          }
          try {
            const response = await axios.post(BACKEND_URL + "/auth/login", postData);
            if (response.data["error"]) {
              appendToDisplay(`\nevelynn: login: ${response.data["error"]}`)
            } else {
              setUsername(response.data["username"])
              setTrust(response.data["trust"])
              appendToDisplay(`\nevelynn: login: ${response.data["username"]} logged in`)
            }
          } catch (error) {}
        }
        await apiLogin();
      }
    }

    else if (command.toLowerCase() === "logout") {
      if (username) {
        setUsername(null);
        setTrust(null);
        appendToDisplay("\nevelynn: logout: logged out");
      } else {
        appendToDisplay("\nevelynn: logout: logout redundant")
      }
    }

    else if (command.toLowerCase() === "register") {
      const inputRegistrationCode = args[0];
      const inputUsername = args[1];
      const inputPassword = args[2];
      const inputConfirmPassword = args[3];

      if (username) {
        appendToDisplay("\nevelynn: register: Already logged in")
      }

      else if (!(inputRegistrationCode && inputUsername && inputPassword && inputConfirmPassword)) {
        appendToDisplay("\nevelynn: register: Invalid arguments /register <registration code> <username> <password> <confirm password>")
      }

      else if (inputPassword != inputConfirmPassword) {
        appendToDisplay("\nevelynn: register: <password> does not match <confirm password>")
      }

      else {
        const apiRegister = async() => {
          const postData = {
            regcode: inputRegistrationCode,
            username: inputUsername,
            password: inputPassword,
          }
          try {
            const response = await axios.post(BACKEND_URL + "/auth/register", postData);
            if (response.data["error"]) {
              appendToDisplay(`\nevelynn: register: ${response.data["error"]}`)
            } else {
              setUsername(response.data["username"]);
              setTrust(response.data["trust"])
              appendToDisplay(`\nevelynn: register: ${response.data["username"]} has been registered`)
            }
          } catch (error) {}
        }
        await apiRegister();
      }
    }

    // ALl commands below this are protected behind a login
    else if (!username) {
      appendToDisplay("\nevelynn: login required")
    }

    else if (command.toLowerCase() === "createregcode") {
      const apiCreateRegCode = async () => {
        const postData = {
          username: username,
        }
        try {
          const response = await axios.post(BACKEND_URL + '/auth/createregcode', postData);
          if (response.data["error"]) {
            appendToDisplay(`\nevelynn: createregcode: ${response.data["error"]}`);
          } else {
            navigator.clipboard.writeText(response.data["regcode"])
            appendToDisplay(`\nevelynn: createregcode: created regcode ${response.data["regcode"]}. It has been copied to your clipboard`)
          }
        } catch (error) {}
      }
      if (args[0] === username) {
        await apiCreateRegCode();
      } else {
        appendToDisplay(`\nevelynn: createregcode: this will irreversibly reset your trust to zero. Run /createregcode ${username}`)
      }
    }

    else if (command.toLowerCase() === "go") {
      if (path == "/") {
        setDisplay((prevDisplay) => `${prevDisplay}\nevelynn: go: redirect redundant`);
      }
      else {
        const newWindow = window.open(path, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        setDisplay((prevDisplay) => `${prevDisplay}\nevelynn: go: redirect successful`)
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

    setAllowInput(true);
  }
  /* ---------------------------------------------------------------------------------------------------- */


  /* ---------------------------------------------------------------------------------------------------- */
  // Keydown handler
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
            <pre className={`${Terminal.className} text-wrap break-all`}>
              {display}{(displayCursor && allowInput) ? (defaultCursor) : ("")}
            </pre>
          </div>

          <hr />

          <div className="diagnostic flex justify-between items-center">
            <div className="path flex-grow  border-r-white border-r-2">
              <p>{path}</p>
            </div>
            <div className="user flex-shrink mx-2">
              <p>{(username) ? `${username}` : "not logged in"}</p>
            </div>
          </div>

        </div>
      </div>)}
    </main>
  );
}
