"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { LogoutButton } from "@/components/common/logout-button";
import { Button, LoadingButton } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateImage, getAllGenerations } from "@/server/api/generate/actions";
import GenerationHistory from "./generation-history";
import GenerationResult from "./generation-result";
import ImageUploadPreview from "./image-upload-preview";
import { AnimatedThemeToggle } from "@/components/animated-theme-toggle";
import { env } from "@/env";

interface GenerationItem {
  id: string;
  originalImage: string;
  prompt: string;
  style: string;
  resultImage: string;
  timestamp: Date;
}

interface StudioPageProps {
  userEmail: string;
  token: string;
}

export default function StudioPage({ userEmail, token }: StudioPageProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("fashion");
  const [generationResult, setGenerationResult] = useState<GenerationItem | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    data: historyData,
    refetch: refetchHistory,
    isLoading,
  } = useQuery({
    queryKey: ["generations"],
    queryFn: getAllGenerations,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = fetch(`${env.NEXT_PUBLIC_BASEURL_API}/v1/generate`, {
        method: "POST",
        body: JSON.stringify({
          imageUpload: uploadedImage,
          prompt,
          style,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        signal: abortControllerRef?.current?.signal,
      });
      return (await res).json();
    },
    onSuccess: (data) => {
      // if (data.error || !data.data) {
      //   toast.error(data.message ?? "Generation failed");
      //   setRetryCount((prev) => prev + 1);
      //   return;
      // }
      console.log(data);

      const result: GenerationItem = {
        id: data.id,
        originalImage: uploadedImage ?? "",
        prompt: data.prompt,
        style: data.style,
        resultImage: data.imageUrl,
        timestamp: new Date(data.createdAt),
      };

      setGenerationResult(result);
      setRetryCount(0);
      toast.success("Image generated successfully!");
      refetchHistory();
    },
    onError: (error) => {
      console.error("Generation error:", error);
      toast.error("Failed to generate image. Please try again.");
      setRetryCount((prev) => prev + 1);
    },
  });

  const styles = [
    { value: "fashion", label: "👗 Fashion" },
    { value: "casual", label: "👕 Casual" },
    { value: "elegant", label: "✨ Elegant" },
    { value: "street", label: "🛹 Street Style" },
    { value: "minimalist", label: "⚪ Minimalist" },
  ];

  const history: GenerationItem[] =
    historyData?.data?.map((gen) => ({
      id: gen.id,
      originalImage: gen.originalImage,
      prompt: gen.prompt,
      style: gen.style,
      resultImage: gen.imageUrl,
      timestamp: new Date(gen.createdAt),
    })) ?? [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes

      if (file.size > maxSize) {
        toast.error("File size must be less than 10MB");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setGenerationResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !prompt.trim()) {
      toast.error("Please upload an image and enter a prompt");
      return;
    }

    setRetryCount(0);
    abortControllerRef.current = new AbortController();

    await generateMutation.mutateAsync({
      image: uploadedImage,
      prompt,
      style,
    });
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      handleGenerate();
    }
  };

  const handleAbort = () => {
    abortControllerRef.current?.abort();
    generateMutation.reset();
  };

  const handleRestoreGeneration = (item: GenerationItem) => {
    setUploadedImage(item.originalImage);
    setPrompt(item.prompt);
    setStyle(item.style);
    setGenerationResult(item);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-lg font-bold">✨</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AI Studio</h1>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatedThemeToggle />
            {/* <Button
              // onClick={onLogout}
              variant="outline"
              size="sm"
              className="border-border hover:bg-card rounded-lg cursor-pointer bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button> */}
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel - Input */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Upload section */}
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Upload Image</h2>
                <ImageUploadPreview
                  image={uploadedImage}
                  onUpload={handleImageUpload}
                  onClear={() => {
                    setUploadedImage(null);
                    setPrompt("");
                    setStyle("");
                  }}
                />
              </div>

              {/* Prompt section */}
              {uploadedImage && (
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm animate-slide-in-up">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Generation Settings</h2>

                  <div className="space-y-4">
                    {/* Prompt input */}
                    <div>
                      <label htmlFor="prompt-input" className="block text-sm font-medium mb-2 text-foreground">
                        Prompt
                      </label>
                      <Textarea
                        id="prompt-input"
                        placeholder="Describe the style, clothing, mood... be specific!"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full bg-input border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 h-24 transition-all"
                      />
                      <p className="text-xs text-muted-foreground mt-2">{prompt.length}/500 characters</p>
                    </div>

                    {/* Style dropdown */}
                    <div>
                      <label htmlFor="style-select" className="block text-sm font-medium mb-2 text-foreground">
                        Style
                      </label>
                      <Select onValueChange={(v) => setStyle(v)} defaultValue={style}>
                        <SelectTrigger id="style-select" className="w-full">
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                        <SelectContent>
                          {styles.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Generate button */}
                    {/* <Button
                      onClick={handleGenerate}
                      disabled={generateMutation.isPending || !prompt.trim()}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 text-primary-foreground h-12 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center"
                    >
                      {generateMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Generate Image
                        </>
                      )}
                    </Button> */}
                    <LoadingButton
                      loading={generateMutation.isPending}
                      onClick={handleGenerate}
                      disabled={generateMutation.isPending || !prompt.trim()}
                    >
                      Generate Image
                    </LoadingButton>

                    {/* Retry controls */}
                    {retryCount > 0 && retryCount < 3 && (
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 space-y-3 animate-slide-in">
                        <p className="text-sm text-destructive font-medium">
                          ⚠️ Model overloaded. Attempt {retryCount} of 3. Please retry.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleRetry}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-10 rounded-lg cursor-pointer transition-all"
                          >
                            Retry
                          </Button>
                          <Button
                            onClick={() => setRetryCount(0)}
                            variant="outline"
                            className="flex-1 border-border h-10 rounded-lg cursor-pointer bg-transparent hover:bg-card"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {retryCount >= 3 && (
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                        <p className="text-sm text-destructive font-medium">
                          ❌ Max retries reached. Please try again later.
                        </p>
                      </div>
                    )}

                    {/* Abort button */}
                    {generateMutation.isPending && (
                      <Button
                        onClick={handleAbort}
                        variant="outline"
                        className="w-full border-destructive/50 hover:bg-destructive/10 text-destructive h-10 rounded-lg cursor-pointer bg-transparent transition-all"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Abort Generation
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Result & History */}
          <div className="space-y-6">
            {/* Result */}
            {generationResult && (
              <div className="animate-slide-in">
                <GenerationResult result={generationResult} />
              </div>
            )}

            {/* History */}
            <GenerationHistory
              items={history}
              onRestore={handleRestoreGeneration}
              isLoading={isLoading || generateMutation.isPending}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
