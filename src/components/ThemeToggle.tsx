import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read current theme from DOM
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
    setMounted(true);
    
    // Observer to keep state synced if other scripts change the class
    const observer = new MutationObserver(() => {
      const currentlyDark = document.documentElement.classList.contains("dark");
      setThemeState(currentlyDark ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      title={mounted ? (theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode") : "Toggle theme"}
      aria-label="Toggle theme"
      className={[
        "inline-flex items-center justify-center p-2 rounded-lg",
        "border border-border/60 bg-card/40 hover:bg-card/80",
        "text-muted-foreground hover:text-foreground",
        "transition-all duration-200 cursor-pointer select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {!mounted || theme === "dark" ? (
        <Moon size={16} className="transition-transform duration-200 hover:-rotate-12" />
      ) : (
        <Sun size={16} className="transition-transform duration-200 hover:rotate-45" />
      )}
    </button>
  );
}
