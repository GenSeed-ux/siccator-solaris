import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Maximize2,
  Share2,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  media_type: string;
  media_url: string;
  thumbnail_url: string | null;
  location: string | null;
}

interface GalleryLightboxProps {
  items: MediaItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const GalleryLightbox = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const currentItem = items[currentIndex];

  const handlePrevious = useCallback(() => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : items.length - 1);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate(currentIndex < items.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, items.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrevious, handleNext, onClose]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: currentItem?.title,
        url: currentItem?.media_url,
      });
    }
  };

  const handleDownload = () => {
    if (currentItem) {
      const link = document.createElement("a");
      link.href = currentItem.media_url;
      link.download = currentItem.title || "download";
      link.click();
    }
  };

  if (!currentItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-background/95 backdrop-blur-xl border-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-background/80 to-transparent">
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} / {items.length}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Media Content */}
        <div className="flex items-center justify-center min-h-[70vh] p-12">
          {currentItem.media_type === "video" ? (
            <video
              src={currentItem.media_url}
              controls
              autoPlay
              className="max-w-full max-h-[70vh] rounded-lg"
            />
          ) : (
            <img
              src={currentItem.media_url}
              alt={currentItem.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
          <h3 className="text-xl font-bold text-foreground mb-1">
            {currentItem.title}
          </h3>
          {currentItem.description && (
            <p className="text-muted-foreground mb-2">{currentItem.description}</p>
          )}
          {currentItem.location && (
            <p className="text-sm text-primary">📍 {currentItem.location}</p>
          )}
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-background/80 rounded-lg backdrop-blur-sm max-w-[80%] overflow-x-auto">
          {items.slice(0, 10).map((item, index) => (
            <button
              key={item.id}
              onClick={() => onNavigate(index)}
              className={cn(
                "w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all",
                index === currentIndex
                  ? "border-primary scale-110"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              {item.media_type === "video" ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="w-4 h-4" />
                </div>
              ) : (
                <img
                  src={item.thumbnail_url || item.media_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryLightbox;
