"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { VideoModal } from "@/components/landing/video-modal";

const VIDEO_ID = "NUKsbpLJecw";

/** Isolated client island — keeps InstructorBlock a pure Server Component. */
export function InstructorVideo({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative aspect-video w-full overflow-hidden border-2 border-navy-900 bg-navy-900"
        aria-label={`Play video: ${name}`}
      >
        <Image
          src={`https://img.youtube.com/vi/${VIDEO_ID}/hqdefault.jpg`}
          alt={name}
          fill
          sizes="(min-width: 768px) 420px, 100vw"
          className="object-cover object-center"
        />
        <span className="absolute inset-0 grid place-items-center bg-navy-900/30 transition-colors group-hover:bg-navy-900/50">
          <span className="grid size-16 place-items-center rounded-full border border-amber/60 bg-navy-900/60 text-amber">
            <Play className="size-6 fill-current" aria-hidden="true" />
          </span>
        </span>
      </button>
      <VideoModal isOpen={open} onClose={() => setOpen(false)} videoId={VIDEO_ID} />
    </>
  );
}
