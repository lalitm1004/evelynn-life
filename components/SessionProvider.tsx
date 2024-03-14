"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface ISessionContext {
  username: string | null;
  trust: number | null;
  statusOnLoad: string;
  changeUsername: (newUsername: string | null) => void;
  changeTrust: (changeInTrust: number | null) => void;
}

const initialSessionContext: ISessionContext = {
  username: null,
  trust: null,
  statusOnLoad: "unauthenticated",
  changeUsername: () => {},
  changeTrust: () => {},
};

const SessionContext = createContext<ISessionContext>(initialSessionContext);

export const useSession = () => useContext(SessionContext);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [trust, setTrust] = useState<number | null>(null);
  const [statusOnLoad, setStatusOnLoad] = useState<string>("loading");

  useEffect(() => {

    if (!(localStorage.getItem("username") && localStorage.getItem("trust"))) {
      setStatusOnLoad("unauthenticated");
    } else if (new Date().getTime() - Number(localStorage.getItem("set-at")) > 21600000) {
      setStatusOnLoad("unauthenticated");
      setUsername(null);
      setTrust(null);
      localStorage.removeItem("username");
      localStorage.removeItem("trust");
      localStorage.removeItem("set-at");
    } else {
      setStatusOnLoad("authenticated");
      setUsername(localStorage.getItem("username"));
      setTrust(Number(localStorage.getItem("trust")));
    }
  }, [])

  const changeUsername = (newUsername: string | null) => {
    setUsername(newUsername);
    if (newUsername !== null) {
      localStorage.setItem("username", newUsername);
      localStorage.setItem("set-at", `${new Date().getTime()}`);
    }
    else {
      localStorage.removeItem("set-at");
      localStorage.removeItem("username");
    } 
  }

  const changeTrust = (changeInTrust: number | null) => {
    if (changeInTrust !== null) {
      setTrust(prev => {
        if (prev !== null) {
          localStorage.setItem("trust", String(prev + changeInTrust));

          (async () => {
            const postData = {
              username: username,
              changeInTrust: changeInTrust,
            }

            if (username) await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/trust`, postData);
          })();

          return prev + changeInTrust;
        }
        localStorage.setItem("trust", String(changeInTrust));
        return changeInTrust;
      });
    } else {
      setTrust(changeInTrust);
      localStorage.removeItem("trust");
    }
  }

  return (
    <SessionContext.Provider
      value={{
        username,
        trust,
        statusOnLoad,
        changeUsername,
        changeTrust,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}