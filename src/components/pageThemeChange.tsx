import { useState, useEffect } from "react";
import { get_theme, remove_theme, save_theme} from "./localStorage";

export const ChangeTheme = () => {
    const [isDark, setIsDark] = useState(() => {
        const data = get_theme()
        if(data == 'dark' || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)){
            return data;
        }
    })

    useEffect(() => {
        if(isDark == 'dark'){
            document.documentElement.classList.add('dark');
            save_theme('dark')
        } else {
            document.documentElement.classList.remove("dark");
            remove_theme()
        }
    }, [isDark])

    return {isDark, toggleDarkMode: () => setIsDark((prev: string) => {
        if(prev == "dark"){
            return null
        } else {
            return 'dark'
        }
    })};
}