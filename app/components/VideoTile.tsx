"use client";

import { useEffect, useRef } from "react";

interface VideoTileProps {
  stream: MediaStream;
  muted?: boolean;
  label?: string;
}

export default function VideoTile({ stream, muted = false, label }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-white/10 group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={`w-full h-full object-cover ${muted ? 'mirror-mode' : ''}`}
      />
      
      {label && (
        <div className="absolute bottom-4 left-4 glass-dark px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-wide">{label}</span>
          {!muted && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
        </div>
      )}

      <style jsx>{`
        .mirror-mode {
          transform: scaleX(-1);
        }
        .glass-dark {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
}
