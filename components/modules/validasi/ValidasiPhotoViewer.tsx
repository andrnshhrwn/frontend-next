"use client";

import { useEffect, useState } from "react";
import { Camera, ZoomIn } from "lucide-react";
import { getValidasiImageUrl } from "@/services/validasiService";

interface ValidasiPhotoViewerProps {
  label: string;
  path: string | null;
  onPreview: (label: string, imageUrl: string) => void;
}

export default function ValidasiPhotoViewer({
  label,
  path,
  onPreview,
}: ValidasiPhotoViewerProps) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = getValidasiImageUrl(path);

  useEffect(() => {
    setImageError(false);
  }, [path]);

  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </p>

      {imageUrl && !imageError ? (
        <button
          type="button"
          onClick={() => onPreview(label, imageUrl)}
          className="group block w-full text-left"
          aria-label={`Perbesar ${label}`}
        >
          <div className="relative">
            <img
              src={imageUrl}
              alt={label}
              onError={() => setImageError(true)}
              className="aspect-4/3 w-full object-contain rounded-lg border border-slate-200 bg-slate-50"
            />

            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 group-hover:bg-black/30 transition-colors">
              <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <span className="text-[10px] text-pdam-primary mt-1 block">
            Klik untuk memperbesar foto
          </span>
        </button>
      ) : (
        <div className="aspect-4/3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-1 text-slate-400">
          <Camera className="w-6 h-6" />
          <span className="text-[10px]">
            {path ? "Foto tidak dapat dimuat" : "Foto tidak tersedia"}
          </span>
        </div>
      )}
    </div>
  );
}
