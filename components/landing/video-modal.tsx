"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

export function VideoModal({ isOpen, onClose, videoId }: VideoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen) {
      el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [isOpen]);

  function handleClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  function handleCancel(e: React.SyntheticEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleClick}
      onCancel={handleCancel}
      className="video-modal-backdrop"
      aria-label="Intro video"
    >
      <div className="video-modal-inner">
        <button onClick={onClose} className="video-modal-close" aria-label="Close video">
          <X className="size-5" />
        </button>
        <div className="video-modal-frame">
          {isOpen && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="Intro video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          )}
        </div>
      </div>
    </dialog>
  );
}
