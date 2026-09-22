"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { VideoModal } from "@/components/landing/video-modal";

const VIDEO_ID = "rgoP3fIWIpc";

/** Isolated client island — keeps Hero as a pure Server Component. */
export function VideoCta() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={buttonStyles({ variant: "ghost" }) + " text-white"}
        id="hero-watch-intro"
      >
        <span className="grid size-7 place-items-center rounded-full border border-amber/60 text-amber">
          <Play className="size-3.5 fill-current" aria-hidden="true" />
        </span>
        Watch the intro
      </button>
      <VideoModal isOpen={open} onClose={() => setOpen(false)} videoId={VIDEO_ID} />
    </>
  );
}
