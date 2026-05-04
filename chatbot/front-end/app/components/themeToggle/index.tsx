"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`rounded-full border p-1  w-[3.2rem] bg-secondary text-primary dark:bg-zinc-800 ${theme === "dark"? 'flex justify-end':'flex justify-start' }`}
    >
      {theme === "dark" ? <Sun  size={20}/> : <Moon size={20} />}
    </button>
  );
}