"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Estado: 'light', 'dark', o 'system'
    const [theme, setTheme] = useState("system");

    // Al montar, leer de localStorage si existe
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Efecto para aplicar la clase 'dark' al documentElement
    useEffect(() => {
        const root = window.document.documentElement;

        // Función paramtrar si debe ser oscuro
        const applyTheme = (targetTheme) => {
            root.classList.remove("light", "dark");

            if (targetTheme === "system") {
                const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                if (systemPrefersDark) {
                    root.classList.add("dark");
                } else {
                    // No añadimos 'light' porque es el default en :root, pero podríamos si fuera necesario
                    // root.classList.add("light");
                }
            } else {
                root.classList.add(targetTheme);
            }
        };

        applyTheme(theme);

        // Guardar en localStorage
        if (theme !== "system") {
            localStorage.setItem("theme", theme);
        } else {
            localStorage.removeItem("theme");
        }

        // Listener para cambios en el sistema si estamos en modo 'system'
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = () => applyTheme("system");
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }

    }, [theme]);

    const value = {
        theme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
