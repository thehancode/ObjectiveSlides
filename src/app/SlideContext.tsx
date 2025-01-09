// src/app/SlideContext.tsx
"use client"; // We need client components for useState, useContext, etc.

import React, { createContext, useContext, useState } from "react";
import { Slide } from "./types";

interface SlideContextType {
  slides: Slide[];
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
}

const SlideContext = createContext<SlideContextType | undefined>(undefined);

export function SlideProvider({ children }: { children: React.ReactNode }) {
  // For simplicity, let’s define an initial root slide
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: "root",
      text: "Your first slide!",
      parentId: null,
      children: [],
    },
  ]);

  return (
    <SlideContext.Provider value={{ slides, setSlides }}>
      {children}
    </SlideContext.Provider>
  );
}

export function useSlides() {
  const context = useContext(SlideContext);
  if (!context) {
    throw new Error("useSlides must be used within a SlideProvider");
  }
  console.log("<<", context.slides);

  return context;
}

