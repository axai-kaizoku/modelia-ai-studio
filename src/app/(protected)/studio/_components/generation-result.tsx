"use client";

import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GenerationItem {
  id: string;
  originalImage: string;
  prompt: string;
  style: string;
  resultImage: string;
  timestamp: Date;
}

interface GenerationResultProps {
  result: GenerationItem;
}

export default function GenerationResult({ result }: GenerationResultProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = result.resultImage;
    link.download = `ai-studio-${result.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(result.prompt);
    toast.success("Prompt copied to clipboard!");
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-in-up">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Generated Result</h3>

      <div className="space-y-4">
        {/* Result image */}
        <div className="relative w-full h-64 rounded-xl overflow-hidden bg-input/50 shadow-md">
          <img
            src={result.resultImage || "/placeholder.svg"}
            alt="Generated result"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Prompt</p>
            <p className="text-sm break-words text-foreground">{result.prompt}</p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Style:</span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">
              {result.style}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-4">
          <Button
            onClick={handleDownload}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground h-10 rounded-lg text-sm font-semibold cursor-pointer transition-all hover:shadow-lg"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button
            onClick={handleCopyPrompt}
            variant="outline"
            className="border-border hover:bg-card h-10 rounded-lg text-sm font-semibold cursor-pointer bg-transparent transition-all"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
}
