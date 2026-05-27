"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageCompareSliderProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

/**
 * ImageCompareSlider — drag/slide to compare two images (Before / After).
 * Used both in the TipTap editor NodeView and in public TiptapContent rendering.
 */
export default function ImageCompareSlider({
  before,
  after,
  beforeLabel = "Trước",
  afterLabel = "Sau",
  className,
}: ImageCompareSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl select-none bg-gray-200",
        className
      )}
      style={{ aspectRatio: "16 / 9" }}
    >
      {/* After image — full background (right side) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={afterLabel}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before image — clipped to left side */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt={beforeLabel}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Divider line + handle — pointer-events-none so range input captures events */}
      <div
        className="absolute inset-y-0 z-10 pointer-events-none"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Vertical white line */}
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white drop-shadow-lg" />
        {/* Circle handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center gap-0.5">
          <svg
            viewBox="0 0 20 20"
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="7,5 3,10 7,15" />
            <polyline points="13,5 17,10 13,15" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 z-10 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 z-10 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none backdrop-blur-sm">
        {afterLabel}
      </span>

      {/* Invisible range input — captures all mouse/touch interaction */}
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        style={{ margin: 0, padding: 0 }}
        aria-label="Trượt để so sánh ảnh trước và sau"
      />
    </div>
  );
}
