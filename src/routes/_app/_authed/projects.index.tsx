import { ImageUploader } from "@/components/ImageUploader";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@heroui/react";
import * as m from "@/paraglide/messages";
import { History } from "lucide-react";

export const Route = createFileRoute("/_app/_authed/projects/")({
  component: RouteComponent,
});

function RouteComponent() {

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-6 gap-6 justify-center">
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full gap-8">
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            {m.sidebar_workspace()}
          </h1>
          <p className="text-sm text-muted-foreground">
            {m.uploader_popoverSubtitle()}
          </p>
        </div>

        <div className="shrink-0">
          <ImageUploader />
        </div>

        <div className="flex flex-row items-center justify-center mt-2">
          <Link to="/projects/recents">
            <Button
              variant="secondary"
              className="flex items-center gap-2 font-semibold text-sm cursor-pointer py-5 px-6 rounded-xl hover:scale-105 transition-all duration-200"
            >
              <History size={16} className="text-accent" />
              <span>{m.projects_viewRecents()}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

