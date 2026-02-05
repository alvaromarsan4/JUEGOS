"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Evitar hidratación incorrecta
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-8 h-8" />; // Placeholder invisible

    const cycleTheme = () => {
        if (theme === 'system') setTheme('light');
        else if (theme === 'light') setTheme('dark');
        else setTheme('system');
    };

    const getIcon = () => {
        if (theme === 'light') return '☀️'; // Sol
        if (theme === 'dark') return '🌙';  // Luna
        return '🖥️'; // Sistema (Monitor)
    };

    return (
        <button
            onClick={cycleTheme}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all border border-border"
            title={`Tema actual: ${theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Oscuro'}. Click para cambiar.`}
        >
            <span className="text-xl leading-none">{getIcon()}</span>
        </button>
    );
}
