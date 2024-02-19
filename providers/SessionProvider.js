"use client"
import { createContext, useContext, useState } from "react";

export const SessionContext = createContext({
    username: null,
    trust: null,
    setUsername: () => {},
    setTrust: () => {},
});

export function SessionProvider({ children }) {
    const [username, setUsername] = useState(null);
    const [trust, setTrust] = useState(null)

    return (
        <SessionContext.Provider
            value={{
                username,
                trust,
                setUsername,
                setTrust,
            }}
        >
            {children}
        </SessionContext.Provider>
    )
}