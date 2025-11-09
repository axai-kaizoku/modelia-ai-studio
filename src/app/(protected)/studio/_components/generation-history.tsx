"use client";

import { Loader2 } from "lucide-react";

interface GenerationItem {
  id: string;
  originalImage: string;
  prompt: string;
  style: string;
  resultImage: string;
  timestamp: Date;
}

interface GenerationHistoryProps {
  items: GenerationItem[];
  onRestore: (item: GenerationItem) => void;
  isLoading: boolean;
}

export default function GenerationHistory({ items, onRestore, isLoading }: GenerationHistoryProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Generations</h3>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
          {/* <p className="text-sm text-muted-foreground">Generating...</p> */}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground font-medium">No generations yet</p>
          <p className="text-xs text-muted-foreground mt-1">Generate your first image to see it here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <button key={item.id} onClick={() => onRestore(item)} className="w-full text-left group cursor-pointer">
              <div className="relative h-20 rounded-lg overflow-hidden bg-input/50 border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                <img
                  src={item.resultImage || "/placeholder.svg"}
                  alt="History thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold">
                    Restore
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">{item.prompt}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
