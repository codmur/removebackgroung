import * as React from "react";
import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router";
import { getUserFn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/paraglide/runtime";
import * as m from "@/paraglide/messages";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async () => {
    try {
      const { user } = await getUserFn();
      return { user };
    } catch (_) {
      return { user: null };
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "BGR – AI Background Remover",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/webp",
        href: "/favicon.webp",
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
});

function PublicHeader() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="sticky top-0 z-50 w-full px-6 pt-4 pointer-events-none">
      <header className="max-w-6xl mx-auto flex flex-col px-6 py-2.5 border border-border/80 bg-card/75 backdrop-blur-xl rounded-2xl shadow-xl pointer-events-auto transition-all duration-300">
        <div className="flex items-center justify-between w-full">
          {/* Logo and Desktop Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold flex items-center gap-2 select-none group" onClick={() => setIsOpen(false)}>
              <img
                src="/logo.webp"
                alt="BGR Logo"
                className="block dark:hidden h-8 w-auto rounded-lg shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0"
              />
              <img
                src="/logo-black.jpg"
                alt="BGR Logo"
                className="hidden dark:block h-8 w-auto rounded-lg shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0"
              />
              <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent font-extrabold tracking-tight text-lg">
                BgRemover
              </span>
            </Link>
           
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              className="bg-accent text-accent-foreground font-bold hover:scale-105 shadow-md shadow-accent/15 transition-transform duration-200 rounded-full px-4 cursor-pointer"
            >
              <Link to="/projects">{m.nav_getStarted()}</Link>
            </Button>
          </div>

          {/* Mobile Right Side Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground cursor-pointer rounded-full hover:bg-accent/5"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="flex md:hidden flex-col gap-4 mt-4 pt-4 border-t border-border/45 animate-fade-in pointer-events-auto">
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                hash="demo"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-muted-foreground hover:text-accent hover:bg-accent/5 rounded-xl px-4 py-2.5 transition-all duration-200"
              >
                {m.nav_demo()}
              </Link>
              <Link
                to="/"
                hash="features"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-muted-foreground hover:text-accent hover:bg-accent/5 rounded-xl px-4 py-2.5 transition-all duration-200"
              >
                {m.nav_features()}
              </Link>
            </nav>
            <div className="flex items-center justify-between px-4">
              <span className="text-xs text-muted-foreground font-semibold">Idioma</span>
              <LanguageSwitcher />
            </div>
            <Button
              asChild
              size="sm"
              className="bg-accent text-accent-foreground font-bold hover:scale-[1.02] shadow-md shadow-accent/15 transition-all duration-200 rounded-xl w-full cursor-pointer py-5"
            >
              <Link to="/projects" onClick={() => setIsOpen(false)}>{m.nav_getStarted()}</Link>
            </Button>
          </div>
        )}
      </header>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { user } = Route.useRouteContext();

  // Ensure the theme is not stripped by React when router.invalidate() re-renders the <html> tag
  React.useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  });

  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const saved = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = saved || (prefersDark ? 'dark' : 'light');
                document.documentElement.classList.add(theme);
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground flex flex-col" suppressHydrationWarning>
        {user ? (
          children
        ) : (
          <>
            <PublicHeader />
            <main className="flex-1">{children}</main>
          </>
        )}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
}