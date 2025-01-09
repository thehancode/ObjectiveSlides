// src/app/page.tsx
"use client";
import React, { useState } from "react";
import { SlideProvider, useSlides } from "./SlideContext";
import SlideItem from "./SlideItem";

export default function Home() {
  return (
    <SlideProvider>
      <MainView />
    </SlideProvider>
  );
}

function MainView() {
  const { slides } = useSlides();
  const [isEditing, setIsEditing] = useState(true);

  return (
    <div className="min-h-screen p-4">
      <div className="mb-4">
        <button
          className="mr-2 border px-4 py-2"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Switch to View Mode" : "Switch to Edit Mode"}
        </button>
      </div>

      <div className="flex flex-wrap flex-col items-start">
        {slides.map((slide) => (
          <SlideItem key={slide.id} slide={slide} isEditing={isEditing} />
        ))}
      </div>
    </div>
  );
}

