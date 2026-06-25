import { useState } from "react";
import { useUploadImage } from "@/lib/query";
import { useNavigate } from "@tanstack/react-router";
import { FileCheck, FileWarning, UploadCloud } from "lucide-react";
import { Button, Spinner, Card, ProgressBar } from "@heroui/react";
import { DropZone } from "@heroui-pro/react";
import * as m from "@/paraglide/messages";

interface ImageUploaderProps {
  compact?: boolean;
  onUploadSuccess?: () => void;
}

export const ImageUploader = ({ compact = false, onUploadSuccess }: ImageUploaderProps) => {
  const { mutateAsync, status, error, reset } = useUploadImage();
  const navigate = useNavigate();

  // Local state to track file upload progress for UI polish
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const processAndUploadFile = async (file: File) => {
    setFileName(file.name);
    setUploadProgress(10);

    // Simulate upload progress interval while the mutation runs
    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 12 : prev));
    }, 150);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64 = await base64Promise;
      
      const name = await mutateAsync({
        data: {
          file: base64,
          contentType: file.type,
        },
      });

      clearInterval(interval);
      setUploadProgress(100);
      onUploadSuccess?.();

      // Navigate to the newly created project
      navigate({ to: "/projects/$name", params: { name } });
    } catch (err) {
      clearInterval(interval);
      setUploadProgress(0);
      console.error(err);
    }
  };

  const handleSelect = async (fileList: FileList) => {
    if (fileList && fileList.length > 0) {
      await processAndUploadFile(fileList[0]);
    }
  };

  const handleDrop = async (e: any) => {
    const dropped: File[] = [];
    if (e.items) {
      for (const item of e.items) {
        if (item.kind === "file" && item.getFile) {
          dropped.push(await item.getFile());
        }
      }
    }
    if (dropped.length > 0) {
      await processAndUploadFile(dropped[0]);
    }
  };

  return (
    <div className="w-full">
      {status === "idle" && (
        <DropZone className="w-full select-none">
          <DropZone.Area
            onDrop={handleDrop}
            className={
              compact
                ? "py-8 px-4 rounded-2xl border border-dashed border-border/80 bg-card/45 hover:bg-card/65 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer w-full text-center relative"
                : "aspect-video rounded-3xl border-2 border-dashed border-border/85 bg-card/45 hover:bg-card/65 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer w-full text-center relative"
            }
          >
            <DropZone.Icon className="pointer-events-none">
              <UploadCloud className="text-accent size-8 md:size-10 animate-pulse" />
            </DropZone.Icon>
            <DropZone.Label className={compact ? "text-xs font-bold text-foreground pointer-events-none" : "text-sm font-bold text-foreground pointer-events-none"}>
              {m.uploader_dragLabel()}
            </DropZone.Label>
            <DropZone.Description className="text-[10px] md:text-xs text-muted-foreground pointer-events-none">
              {m.uploader_dragDescription()}
            </DropZone.Description>
            <DropZone.Trigger className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </DropZone.Area>
          <DropZone.Input accept="image/*" onSelect={handleSelect} />
        </DropZone>
      )}

      {status === "pending" && (
        <Card className="flex flex-col items-center justify-center w-full border border-border/60 bg-card/60 p-6 text-center select-none rounded-2xl">
          <Card.Content className="flex flex-col items-center gap-3.5 w-full max-w-xs">
            <Spinner size="md" color="accent" />
            <div className="flex flex-col gap-1 w-full min-w-0">
              <span className="text-xs font-bold text-foreground truncate block">{fileName || "Image"}</span>
              <span className="text-[10px] text-muted-foreground block">{m.uploader_pendingSubtitle()}</span>
            </div>
            <ProgressBar value={uploadProgress} size="sm" color="accent" className="w-full" />
          </Card.Content>
        </Card>
      )}

      {status === "success" && (
        <Card className="flex flex-col items-center justify-center w-full border border-border/60 bg-card/60 p-6 text-center select-none rounded-2xl">
          <Card.Content className="flex flex-col items-center gap-2.5">
            <div className="p-2.5 rounded-full bg-success/15 text-success">
              <FileCheck className="size-8 animate-bounce" />
            </div>
            <span className="text-sm font-bold text-success">{m.uploader_successTitle()}</span>
            <span className="text-xs text-muted-foreground">{m.uploader_successSubtitle()}</span>
          </Card.Content>
        </Card>
      )}

      {status === "error" && (
        <Card className="flex flex-col items-center justify-center w-full border border-danger/40 bg-card/60 p-6 text-center select-none rounded-2xl">
          <Card.Content className="flex flex-col items-center gap-3 w-full">
            <div className="p-2.5 rounded-full bg-danger/15 text-danger">
              <FileWarning className="size-8" />
            </div>
            <span className="text-sm font-bold text-danger">{m.uploader_errorTitle()}</span>
            <pre className="text-[10px] text-muted-foreground bg-muted/80 p-3 rounded-xl max-w-full overflow-x-auto max-h-24 w-full text-left font-mono">
              {error?.message || "An unexpected error occurred"}
            </pre>
            <Button variant="danger" size="sm" onPress={reset} className="mt-1 font-semibold">
              {m.uploader_errorRetry()}
            </Button>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};
