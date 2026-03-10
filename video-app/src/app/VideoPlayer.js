"use client"
import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ stream, muted = false, title = "Stream" }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Crucial: Manually attaching the MediaStream to the video element
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      videoRef.current.play().catch(error => {
      console.error("Autoplay was prevented:", error);
    });
    }
  }, [stream]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-mono mb-1 text-gray-400 uppercase tracking-widest">
        {title}
      </span>
      <div className="relative overflow-hidden rounded-lg border-2 border-slate-700 bg-black shadow-xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="w-[300px] h-[200px] object-cover"
        />
        {/* Visual indicator for muted state */}
        {muted && (
          <div className="absolute bottom-2 right-2 bg-red-600 p-1 rounded-full">
             <span className="text-[10px] text-white font-bold">MUTED</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;