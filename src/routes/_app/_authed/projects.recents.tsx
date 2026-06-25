import { PreviousUploadCard } from "@/components/PreviousUploadCard";
import { useUploads } from "@/lib/query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, Button, Spinner } from "@heroui/react";
import * as m from "@/paraglide/messages";
import { ArrowLeft, History } from "lucide-react";
import { getUploadedImagesFn } from "@/lib/bg-remover";

export const Route = createFileRoute("/_app/_authed/projects/recents")({
  loader: ({ context: { queryClient, user } }) => {
    if (!user) return null;
    return queryClient.ensureQueryData({
      queryKey: ["uploads"],
      queryFn: getUploadedImagesFn,
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useUploads();

  return (
    <div className="flex flex-col h-full p-6 gap-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-row items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/projects">
            <Button
              isIconOnly
              variant="secondary"
              size="sm"
              className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full"
            >
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <History className="text-accent animate-pulse" size={20} />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {m.projects_recentTitle()}
            </h1>
          </div>
        </div>
      </div>

      {/* Grid or Empty State */}
      <div className="flex flex-col flex-1 min-h-0">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 animate-pulse">
            <Spinner size="lg" color="accent" />
            <span className="text-xs font-semibold text-muted-foreground">Cargando imágenes recientes...</span>
          </div>
        ) : data && data.length > 0 ? (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-6 animate-fade-in">
              {data.map((entry) => (
                <PreviousUploadCard
                  name={entry.name}
                  initialSignedUrl={entry.signedUrl}
                  key={entry.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="flex-1 border border-dashed border-border/80 bg-card/20 flex flex-col items-center justify-center p-6 text-center text-muted-foreground rounded-2xl shadow-xs">
            <Card.Content className="flex flex-col items-center justify-center gap-3 max-w-sm">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-1">
                <History size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">{m.projects_noUploadsTitle()}</p>
                <p className="text-xs text-muted-foreground">{m.projects_noUploadsDesc()}</p>
              </div>
              <Link to="/projects" className="mt-2">
                <Button size="sm" variant="primary" className="cursor-pointer font-semibold rounded-xl">
                  {m.projects_backToUploader()}
                </Button>
              </Link>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
}
