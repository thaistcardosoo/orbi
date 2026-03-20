import { useState } from "react";
import { X } from "lucide-react";
import type { TeamVideo } from "@workspace/api-client-react";

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /embed\/([^?&/]+)/,
    /[?&]v=([^?&/]+)/,
    /youtu\.be\/([^?&/]+)/,
    /watch\?v=([^?&/]+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

interface TeamVideoCardProps {
  video: TeamVideo;
}

export function TeamVideoCard({ video }: TeamVideoCardProps) {
  const [open, setOpen] = useState(false);

  const videoId = extractYouTubeId(video.url);
  const thumbnailUrl = video.thumbnail
    ? video.thumbnail
    : videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;

  return (
    <>
      <button
        type="button"
        className="group relative w-full aspect-video rounded-xl overflow-hidden bg-foreground/90 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={() => setOpen(true)}
        data-testid="team-video-card"
        aria-label={`Assistir vídeo de ${video.name}`}
      >
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={`${video.name} — ${video.role}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
            <svg
              className="w-5 h-5 text-foreground ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
          <p className="text-white font-semibold text-sm leading-tight">{video.name}</p>
          <p className="text-white/70 text-xs mt-0.5 leading-tight">{video.role}</p>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={(() => {
                try {
                  const u = new URL(video.url);
                  u.searchParams.set("autoplay", "1");
                  return u.toString();
                } catch {
                  return `${video.url}?autoplay=1`;
                }
              })()}
              title={`${video.name} — ${video.role}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              type="button"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              onClick={() => setOpen(false)}
              aria-label="Fechar vídeo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
