import { LoginOrSignUp } from "@/components/LoginOrSignUp";
import { getUserFn } from "@/lib/auth";
import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { Sidebar, Navbar } from "@heroui-pro/react";
import { BookOpen, FolderOpen, LogOut, UploadCloud, History } from "lucide-react";
import * as m from "@/paraglide/messages";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuickUploadButton } from "@/components/layout/QuickUploadButton";

export const Route = createFileRoute("/_app/_authed")({
  component: RouteComponent,
  beforeLoad: async () => {
    try {
      const { user } = await getUserFn();
      return { isLoggedIn: !!user?.email, user };
    } catch (_) {
      return { isLoggedIn: false, user: null };
    }
  },
});

function RouteComponent() {
  const { isLoggedIn, user } = Route.useRouteContext();
  const router = useRouter();

  if (!isLoggedIn) return <LoginOrSignUp />;

  return (
    <Sidebar.Provider>
      <Sidebar className="group">
        <Sidebar.Header className="flex flex-row items-center gap-2 px-3 py-3 group/header group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0">
          <img
            src="/logo.webp"
            alt="BGR Logo"
            className="h-8 w-auto rounded-lg shadow-xs group-hover/header:rotate-3 transition-transform duration-200 shrink-0"
          />
          <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent font-extrabold text-base tracking-tight group-data-[state=collapsed]:hidden truncate">
            BgRemover
          </span>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.Menu aria-label="Navigation" defaultExpandedKeys={["projects-parent"]}>
              <Sidebar.MenuItem
                href="/guide"
                id="guide"
                isCurrent={router.state.location.pathname === "/guide"}
                textValue={m.sidebar_guide()}
              >
                <Sidebar.MenuIcon>
                  <BookOpen size={16} />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>{m.sidebar_guide()}</Sidebar.MenuLabel>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem
                id="projects-parent"
                textValue={m.sidebar_projects()}
              >
                <Sidebar.MenuIcon>
                  <FolderOpen size={16} />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>{m.sidebar_projects()}</Sidebar.MenuLabel>
                <Sidebar.MenuTrigger />
                <Sidebar.Submenu>
                  <Sidebar.MenuItem
                    href="/projects"
                    id="projects"
                    isCurrent={router.state.location.pathname === "/projects" || router.state.location.pathname === "/projects/"}
                    textValue={m.uploader_navButton()}
                  >
                    <Sidebar.MenuIcon>
                      <UploadCloud size={16} />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>{m.uploader_navButton()}</Sidebar.MenuLabel>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem
                    href="/projects/recents"
                    id="projects-recents"
                    isCurrent={router.state.location.pathname === "/projects/recents" || (router.state.location.pathname.startsWith("/projects/") && router.state.location.pathname !== "/projects" && router.state.location.pathname !== "/projects/")}
                    textValue={m.sidebar_recents()}
                  >
                    <Sidebar.MenuIcon>
                      <History size={16} />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>{m.sidebar_recents()}</Sidebar.MenuLabel>
                  </Sidebar.MenuItem>
                </Sidebar.Submenu>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer className="flex flex-col gap-2 p-4 border-t border-border">
          <div className="flex flex-col gap-0.5 truncate group-data-[state=collapsed]:hidden mb-1">
            <span className="text-xs text-muted-foreground truncate">
              {m.sidebar_loggedInAs()}
            </span>
            <span className="text-sm font-medium truncate">{user?.email}</span>
          </div>
          <Sidebar.Menu aria-label="Footer actions">
            <Sidebar.MenuItem
              href="/logout"
              id="logout"
              textValue={m.sidebar_logout()}
              tooltipProps={{ content: m.sidebar_logout(), delay: 0 }}
            >
              <Sidebar.MenuIcon>
                <LogOut size={16} className="text-danger" />
              </Sidebar.MenuIcon>
              <Sidebar.MenuLabel className="text-danger">{m.sidebar_logout()}</Sidebar.MenuLabel>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Footer>
        <Sidebar.Rail />
      </Sidebar>

      <Sidebar.Mobile>
        <Sidebar.Header className="flex flex-row items-center gap-2 px-4 py-3 group">
          <img
            src="/logo.webp"
            alt="BGR Logo"
            className="h-8 w-auto rounded-lg shadow-xs group-hover:rotate-3 transition-transform duration-200 shrink-0"
          />
          <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent font-extrabold text-base tracking-tight">
            BgRemover
          </span>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.Menu aria-label="Navigation" defaultExpandedKeys={["projects-mobile-parent"]}>
              <Sidebar.MenuItem
                href="/guide"
                id="guide-mobile"
                isCurrent={router.state.location.pathname === "/guide"}
                textValue={m.sidebar_guide()}
              >
                <Sidebar.MenuIcon>
                  <BookOpen size={16} />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>{m.sidebar_guide()}</Sidebar.MenuLabel>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem
                id="projects-mobile-parent"
                textValue={m.sidebar_projects()}
              >
                <Sidebar.MenuIcon>
                  <FolderOpen size={16} />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>{m.sidebar_projects()}</Sidebar.MenuLabel>
                <Sidebar.MenuTrigger />
                <Sidebar.Submenu>
                  <Sidebar.MenuItem
                    href="/projects"
                    id="projects-mobile"
                    isCurrent={router.state.location.pathname === "/projects" || router.state.location.pathname === "/projects/"}
                    textValue={m.uploader_navButton()}
                  >
                    <Sidebar.MenuIcon>
                      <UploadCloud size={16} />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>{m.uploader_navButton()}</Sidebar.MenuLabel>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem
                    href="/projects/recents"
                    id="projects-recents-mobile"
                    isCurrent={router.state.location.pathname === "/projects/recents" || (router.state.location.pathname.startsWith("/projects/") && router.state.location.pathname !== "/projects" && router.state.location.pathname !== "/projects/")}
                    textValue={m.sidebar_recents()}
                  >
                    <Sidebar.MenuIcon>
                      <History size={16} />
                    </Sidebar.MenuIcon>
                    <Sidebar.MenuLabel>{m.sidebar_recents()}</Sidebar.MenuLabel>
                  </Sidebar.MenuItem>
                </Sidebar.Submenu>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem
                href="/logout"
                id="logout-mobile"
                textValue={m.sidebar_logout()}
              >
                <Sidebar.MenuIcon>
                  <LogOut size={16} className="text-danger" />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel className="text-danger">{m.sidebar_logout()}</Sidebar.MenuLabel>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar.Mobile>

      <Sidebar.Main className="flex flex-col h-full overflow-hidden">
        <Navbar maxWidth="full" className="border-b border-border bg-card shrink-0">
          <Navbar.Header className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Sidebar.Trigger />
            </div>

            <div className="flex justify-center flex-1 max-w-[200px] md:max-w-xs mx-auto">
              <QuickUploadButton />
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </Navbar.Header>
        </Navbar>
        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </Sidebar.Main>
    </Sidebar.Provider>
  );
}
