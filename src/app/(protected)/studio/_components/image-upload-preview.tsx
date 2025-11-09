"use client";

import type React from "react";

import { Upload, X } from "lucide-react";

interface ImageUploadPreviewProps {
  image: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export default function ImageUploadPreview({ image, onUpload, onClear }: ImageUploadPreviewProps) {
  return (
    <div>
      {!image ? (
        <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-primary/50 rounded-xl hover:border-primary/80 transition-all duration-300 cursor-pointer hover:bg-primary/5 group">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
              <Upload className="w-6 h-6 text-primary" data-testid="upload-icon" />
            </div>
            <p className="font-semibold text-foreground">Click to upload</p>
            <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
          </div>
          <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
        </label>
      ) : (
        <div className="relative group">
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-input/50 shadow-lg">
            <img src={image || "/placeholder.svg"} alt="Uploaded preview" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-2 rounded-lg bg-background/80 backdrop-blur border border-border hover:bg-background transition-all opacity-0 group-hover:opacity-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
