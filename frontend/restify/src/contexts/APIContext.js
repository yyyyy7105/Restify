import { createContext, useState } from "react";

export const APIContext = createContext({
    currentURL: "",
    setCurrentURL: () => { },
    fullName: "",
    setFullName: () => { },
});

export function useAPIContext() {
    const [fullName, setFullName] = useState("");
    const [currentURL, setCurrentURL] = useState("/");

    return {
        fullName,
        setFullName,
        currentURL,
        setCurrentURL,
    };
}