import { useState } from "react";
import { useImageUrl, useDeleteImage } from "@/lib/query";
import { Link } from "@tanstack/react-router";
import { Card, Button, Spinner } from "@heroui/react";
import { Trash2, AlertTriangle } from "lucide-react";
import * as m from "@/paraglide/messages";

type PreviousUploadCardProps = {
  name: string;
  initialSignedUrl?: string | null;
};

export const PreviousUploadCard = ({ name, initialSignedUrl }: PreviousUploadCardProps) => {
  const { data } = useImageUrl(name, initialSignedUrl);
  const { mutateAsync: deleteImage, isPending: isDeleting } = useDeleteImage();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteImage({ data: { name } });
    } catch (err) {
      console.error(err);
      alert(m.projects_deleteError());
      setShowConfirm(false);
    }
  };

  return (
    <Link to="/projects/$name" params={{ name }} className="block group">
      <Card className="relative overflow-hidden aspect-video transition-all duration-300 border border-border/60 group-hover:border-accent group-hover:shadow-lg group-hover:-translate-y-1">
        {data ? (
          <img
            src={data}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full animate-pulse bg-muted" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8 flex items-end pointer-events-none">
          <p className="text-xs font-semibold truncate text-white w-full" title={name}>
            {name}
          </p>
        </div>

        {/* Delete Button */}
        {!showConfirm && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              isIconOnly
              size="sm"
              color="danger"
              variant="flat"
              className="rounded-full shadow-md cursor-pointer bg-danger/80 text-white hover:bg-danger"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfirm(true);
              }}
              title={m.projects_deleteImage()}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}

        {/* Confirmation Overlay */}
        {showConfirm && (
          <div 
            className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-3 text-center z-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {isDeleting ? (
              <div className="flex flex-col items-center gap-2 text-accent">
                <Spinner size="md" color="current" />
                <span className="text-[10px] font-semibold">{m.projects_deleting()}</span>
              </div>
            ) : (
              <>
                <AlertTriangle className="text-danger mb-1" size={20} />
                <p className="text-[10px] font-bold mb-2 leading-tight text-foreground">{m.projects_deleteConfirmTitle()}</p>
                <div className="flex gap-2 mt-1 w-full max-w-[150px]">
                  <Button size="sm" variant="flat" className="flex-1 cursor-pointer text-[10px] h-6 min-h-6 px-0 bg-default-200" onClick={() => setShowConfirm(false)}>
                    {m.projects_cancel()}
                  </Button>
                  <Button size="sm" color="danger" variant="flat" className="flex-1 cursor-pointer text-[10px] h-6 min-h-6 px-0 bg-danger/20 text-danger hover:bg-danger hover:text-white" onClick={handleDelete}>
                    {m.projects_confirmDelete()}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Card>
    </Link>
  );
};
