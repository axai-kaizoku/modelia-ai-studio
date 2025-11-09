"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoginDialog } from "@/hooks/use-login-dialog";
import { AnimatedThemeToggle } from "@/components/animated-theme-toggle";
import ShinyButton from "@/components/ui/shiny-button";

export const LandingHero = () => {
  const { LoginDialogWithState, openDialog } = useLoginDialog();

  return (
    <>
      <LoginDialogWithState />

      <div className="relative w-full min-h-screen bg-background overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-40 animate-float" />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl opacity-40 animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-20 animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="absolute top-4 right-4 z-50">
          <AnimatedThemeToggle />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
          <div className="text-center max-w-3xl mx-auto animate-slide-in-up">
            {/* Logo/Brand */}
            <div
              className="mb-8 flex items-center justify-center gap-3 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-2xl font-bold">✨</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Studio
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-pretty text-foreground">
              Create stunning fashion images with AI
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty leading-relaxed">
              Upload your image, add a prompt, and let AI transform your vision into reality. Fast, powerful, and
              intuitive.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in h-14"
              style={{ animationDelay: "0.2s" }}
            >
              {/* <Button
                className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 text-primary-foreground px-8 py-6 text-lg rounded-full font-semibold transition-all duration-300 cursor-pointer"
                size="lg"
                onClick={openDialog}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button> */}
              <ShinyButton onClick={() => openDialog()}>Get Started</ShinyButton>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 pt-20 border-t border-border">
              {[
                {
                  title: "Lightning Fast",
                  description: "Get results in seconds with our optimized generation engine",
                  icon: "⚡",
                },
                {
                  title: "Premium Quality",
                  description: "Professional-grade AI models for stunning results",
                  icon: "🎨",
                },
                {
                  title: "Intuitive Design",
                  description: "Simple, elegant interface for all skill levels",
                  icon: "🚀",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-card hover:bg-card/80 backdrop-blur border border-border hover:border-primary/50 transition-all duration-300 animate-fade-in hover:shadow-lg"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
