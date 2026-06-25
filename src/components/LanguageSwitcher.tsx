import { getLocale, setLocale, type Locale } from "@/paraglide/runtime";
import { useRouter } from "@tanstack/react-router";

const FLAG: Record<Locale, string> = { en: "🇬🇧", es: "🇪🇸" };
const LABEL: Record<Locale, string> = { en: "EN", es: "ES" };

/**
 * Compact language toggle button: shows current locale flag + code,
 * switches to the other language on click.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = getLocale() as Locale;
  const router = useRouter();

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "es" : "en";
    setLocale(newLocale);
    try {
      localStorage.setItem("locale", newLocale);
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    } catch (_) {}
    router.invalidate();
  };

  return (
    <button
      onClick={toggleLocale}
      title={locale === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
        "text-xs font-semibold tracking-wide",
        "border border-border/60 bg-card/40 hover:bg-card/80",
        "text-muted-foreground hover:text-foreground",
        "transition-all duration-200 cursor-pointer select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="text-base leading-none">{FLAG[locale]}</span>
      <span>{LABEL[locale]}</span>
    </button>
  );
}
