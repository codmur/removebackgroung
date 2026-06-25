import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import { UploadCloud } from "lucide-react";
import * as m from "@/paraglide/messages";
import { ImageUploader } from "@/components/ImageUploader";

export function QuickUploadButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          size="sm"
          className="bg-accent text-accent-foreground font-bold shadow-xs flex items-center gap-1.5 hover:scale-105 transition-transform duration-200 cursor-pointer"
        >
          <UploadCloud size={16} />
          <span>{m.uploader_navButton()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent placement="bottom" className="p-4 w-[320px] bg-card border border-border shadow-lg rounded-2xl">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-sm font-bold text-foreground">{m.uploader_popoverTitle()}</span>
            <span className="text-xs text-muted-foreground">{m.uploader_popoverSubtitle()}</span>
          </div>
          <ImageUploader compact onUploadSuccess={() => setIsOpen(false)} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
