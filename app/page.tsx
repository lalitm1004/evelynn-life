"use client";
import { useSession } from "@/components/SessionProvider";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {

  const { username, trust, changeUsername, changeTrust} = useSession()

  const [currentLine, setCurrentLine] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<string>>([]);
  const [commandHistory, setCommandHistory] = useState<Array<string>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [path, setPath] = useState<Array<string>>([]);

  const cursor = "|";
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [displayCursor, setDisplayCursor] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {

    /* Helper Functions */
    const appendText = async (str: string) => {
      setChatHistory(prev => [...prev, str]);
    }

    const streamHelper = async (str: string) => {
      setChatHistory(prev => [...prev, ""]);
      for (const letter of str) {
        setChatHistory(prev => [...prev.slice(0, -1), prev[prev.length - 1] + letter])
        await new Promise(r => setTimeout(r, 30));
      }
    }

    const clearHelper = async (args:Array<string>) => {
      if (args.length > 0) { appendText("evelynn: createregcode: too many parameters"); return; }
      setChatHistory([]);
      setCommandHistory([]);
      setCurrentLine("");
      setCursorPosition(0);
      setHistoryIndex(0);
    }

    const cdHelper = async (args: Array<string>) => {

      if (args.length > 1) { appendText("evelynn: cd: too many arguments"); return; }
      if (args.length === 0) {setPath([]); return;};

      const targetPath = args[0]
      const targetPathSplit = targetPath.split("/");
      if (targetPath === ".") return;
      else if (/\.\./.test(targetPath)) setPath(prev => prev.slice(0, -1));
      else setPath(prev => [...prev, ...(targetPathSplit).filter(x => x !== "")]);
    }

    const goHelper = async (args:Array<string>) => {

      if (args.length > 0) { appendText("evelynn: go: too many parameters"); return; }

      if (path.length === 0) { appendText("evelynn: go: redirect redundant"); return; }

      const newWindow = window.open(`/${path.join("/")}`, "_blank", "noopener, noreferrer");
      if (newWindow) newWindow.opener = null;
      appendText("evelynn: go: redirect successfull");
    }

    const loginHelper = async (args: Array<string>) => {

      if (args.length > 2) { appendText("evelynn: login: too many arguments"); return; }

      if (username) { appendText("evelynn: login: already logged in"); return; }

      const inputUsername = args[0];
      const inputPassword = args[1];
      if (!(inputUsername && inputPassword)) { appendText("evelynn: login: syntax error: login <username> <password>"); return; }

      await (async () => {
        const postData = {
          username: inputUsername,
          password: inputPassword,
        };
        const response = await axios.post(`api/auth/login`, postData);
        if (response.data.error) {
          appendText(`evelynn: login: ${response.data.error}`);
          return;
        }
        changeUsername(response.data.username);
        changeTrust(response.data.trust);
        appendText(`evelynn: login: logged in as ${response.data.username}`);
      })();
    }

    const logoutHelper = async (args:Array<string>) => {

      if (args.length > 0) { appendText("evelynn: logout: too many parameters"); return; }

      clearHelper(args);
      setPath([]);
      changeUsername(null);
      changeTrust(null);
    }

    const registerHelper = async (args: Array<string>) => {

      if (args.length > 4) { appendText("evelynn: register: too many arguments"); return; }

      if (username) { appendText("evelynn: register: already logged in"); return; }

      const inputUsername = args[0];
      const inputRegcode = args[1]
      const inputPassword = args[2];
      const inputConfirmPassword = args[3];

      if (!(inputUsername && inputRegcode && inputPassword && inputConfirmPassword)) { appendText("evelynn: register: syntax error: register <username> <regcode> <password> <confirmpassword>"); return; }

      await (async () => {
        const postData = {
          username: inputUsername,
          regcode: inputRegcode,
          password: inputPassword,
        }
        const response = await axios.post(`api/auth/register`, postData);
        if (response.data.error) {
          appendText(`evelynn: register: ${response.data.error}`)
          return;
        }
        changeUsername(response.data.username);
        changeTrust(response.data.trust);
        appendText(`evelynn: register: registered and logged in as ${response.data.username}`);
      })();

    }

    const createRegCodeHelper = async (args:Array<string>) => {

      if (args.length > 1) { appendText("evelynn: createregcode: too many parameters"); return; }

      const confirmation = args[0]
      if (!confirmation) { appendText("evelynn: createregcode: you can create a maximum of 3 regcodes: createregcode --confirm"); return; }

      if (confirmation !== "--confirm") { appendText("evelynn: createregcode: invalid confirmation"); return; }

      await (async () => {
        const postData = {
          username: username
        }
        const response = await axios.post(`api/auth/create-reg-code`, postData);
        if (response.data.error) {
          appendText(`evelynn: createregcode: ${response.data.error}`);
          return;
        }
        localStorage.setItem("trust", `${Number(localStorage.getItem("trust")) - 1000}`)
        console.log(response.data);
      })()
    }

    const profileHelper = async(args:Array<string>) => {

      if (args.length > 0) { appendText("evelynn: profile: too many parameters"); return; }

      await (async () => {
        const postData = {
          username: username
        }
        const response = await axios.post(`api/user`, postData);
        if (response.data.error) {
          appendText(`evelynn: profile: ${response.data.error}`);
          return;
        }
        appendText(`--=${username}=--`);
        appendText(`[] trust: ${response.data.trust}`);
        appendText(`[] regcodes created: ${response.data.regcodes.length}`);
        appendText(`[] invited by: ${response.data.invitedBy.replace(" ", "").split("-")[0]}`);
        appendText(`[] created at: ${response.data.createdAt}`);
      })();
    }

    const trustHelper = async (args: Array<string>) => {
      if (username !== "walmartphilosopher") return;
      if (args.length !== 1) return;
      await (async () => {
        const postData = {
          username: username,
          newTrust: Number(args[0])
        }
        await axios.post(`api/user/trust/set`, postData);
        localStorage.setItem("trust", `${args[0]}`)
      })();
    }

    const listRegCodeHelper = async (args: Array<string>) => {
      if (args.length > 0) { appendText("evelynn: listregcodes: too many arguments"); return; }

      await (async () => {
        const postData = {
          username: username
        }
        const response = await axios.post(`api/user/reg-code`, postData)
        if (response.data.error) {
          appendText(`evelynn: listregcode: ${response.data.error}`);
        }
        if (response.data.regcodes.length === 0) {
          appendText(`evelynn: listregcode: no regcodes created yet`)
        } else {
          appendText(`--=${username}=--`)
          for (const regcode of response.data.regcodes) {
            appendText(`[] ${regcode.split("-")[0]} - ${regcode.split("-")[1]}`)
          }
        }
      })();
    }

    /* --------------- */

    const handleCommand = async (syntax: string) => {
      setLoading(true);
      if (syntax !== "") setCommandHistory(prev => [...prev, syntax]);
      const formattedSyntax = syntax.replace(/\s+/g, ' ').replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/').trim()
      const splitSyntax = formattedSyntax.split(" ");
      const command = splitSyntax[0];
      const args = splitSyntax.slice(1);

      const commandList = [
        "login", "logout", "register", "createregcode",
        "clear", "cd", "go",
        "profile", "help", "listregcode",

        "stream", "trust",
      ]

      if (command === "") {}

      else if (commandList.indexOf(command.toLowerCase()) === -1) await appendText(`evelynn: ${command}: command not found`);

      else if (command.toLowerCase() === "stream") await streamHelper("hello how are you?");

      else if (command.toLowerCase() === "clear") await clearHelper(args);

      else if (command.toLowerCase() === "login") await loginHelper(args);

      else if (command.toLowerCase() === "logout") await logoutHelper(args);

      else if (command.toLowerCase() === "register") await registerHelper(args);

      else if (!username) await appendText("evelynn: login required");

      else if (command.toLowerCase() === "createregcode") await createRegCodeHelper(args);

      else if (command.toLowerCase() === "listregcode") await listRegCodeHelper(args);

      else if (command.toLowerCase() === "cd") await cdHelper(args);

      else if (command.toLowerCase() === "go") await goHelper(args);

      else if (command.toLowerCase() === "profile") await profileHelper(args);


      else if (command.toLowerCase() === "trust") await trustHelper(args);

      setLoading(false);
    }

    const handleKeyDown = async (event: KeyboardEvent) => {

      const key = event.key;

      const ignoredKeys = [
        "Alt", "Escape", "Control", "Shift", "Meta", "Tab",
        "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
        "NumLock", "CapsLock",
        "Delete", "Pause",
        "AudioVolumeUp", "AudioVolumeDown",
        "\\", "\"", "'", "`", "<", ">", ","
      ];

      if (ignoredKeys.indexOf(key) === -1 && !loading) {
        setDisplayCursor(true);
        // Handle cursor movements
        if (key === "ArrowLeft") {
          if (currentLine.length !== 0 && cursorPosition != currentLine.length) setCursorPosition(prev => prev+1);
        } else if (key === "ArrowRight") {
          if (cursorPosition !== 0) setCursorPosition(prev => prev-1);
        }

        // Go back to previous commands
        else if (key === "ArrowUp") {
          if (commandHistory.length !== 0 && historyIndex != commandHistory.length) setHistoryIndex(prev => prev + 1);
        } else if (key === "ArrowDown") {
          if (historyIndex !== 0) setHistoryIndex(prev => prev - 1);
        }

        else if (key === "Enter") {
          setCurrentLine("");
          if (currentLine.toLowerCase() !== "clear") setChatHistory(prev => [...prev, currentLine]);
          await handleCommand(currentLine);
          setChatHistory(prev => [...prev, "{filler}"])
          setCursorPosition(0);
          setHistoryIndex(0);
        }

        else if (key === "Backspace") {
          const preCursor = currentLine.slice(0, currentLine.length - cursorPosition);
          const postCursor = currentLine.slice(currentLine.length - cursorPosition);
          setCurrentLine(`${preCursor.slice(0, preCursor.length - 1)}${postCursor}`)
        }

        else {
          setCurrentLine(prev => `${prev.slice(0, prev.length - cursorPosition)}${key}${prev.slice(prev.length - cursorPosition)}`)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentLine, cursorPosition, loading, historyIndex])

  // History
  useEffect(() => {
    setCurrentLine([...commandHistory, ""][commandHistory.length - historyIndex]);
    setCursorPosition(0);
  }, [historyIndex])

  // Cursor Blinking Effect
  useEffect(() => {
    const intervalId = setInterval(() => setDisplayCursor(prev => !prev), 500)
    return () => clearInterval(intervalId);
  }, []);

  // Scroll Effect
  useEffect(() => {
    const input = document.getElementById("input")!;
    input.scrollTo({top: document.body.scrollHeight, behavior:"smooth"});
  }, [chatHistory]);

  return (
    <div className={`h-screen w-screen font-terminal bg-life-black text-life-white overflow-x-hidden flex flex-col`}>
      <div id={`input`} className={`flex flex-grow flex-col justify-between overflow-y-scroll scrollbar-hide`}>
        <div className={`flex flex-grow flex-col h-max justify-end`}>
          {chatHistory.map((value, index)=> (
            ((value !== "{filler}") && <p key={index} className={`text-clip break-all`}>
              {!(commandHistory.indexOf(value) === -1) && ">"}
              {value}
            </p>)
          ))}
        </div>
        <div className={`flex flex-shrink text-wrap break-all`}>
          {!loading && <p>&gt;</p>}
          <p className={`text-clip break-words`}>{currentLine.slice(0, currentLine.length - cursorPosition)}{(displayCursor && !loading) && cursor}{currentLine.slice(currentLine.length - cursorPosition)}</p>
        </div>
      </div>

      <hr />

      <div id={`diagnostic`} className={`flex justify-between items-center`}>
        <div className={`path flex-grow border-r-white border-r-2`}>
          <p>
            /
            {path.map((value, index) => (
              <span key={index}>{value}/</span>
            ))}
          </p>
        </div>
        <div className={`user flex-shrink mx-2`}>
          <p>{username || "not logged in"}</p>
        </div>
      </div>

    </div>
  );
}
