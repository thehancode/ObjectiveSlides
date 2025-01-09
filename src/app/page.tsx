// src/app/page.tsx
"use client";
import React, { useState } from "react";
import { SlideProvider, useSlides } from "./SlideContext";
import SlideItem from "./SlideItem";
import { FaLock, FaUnlock } from "react-icons/fa";

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

      <div className="fixed top-4 right-4">
        <button
          className="border px-4 py-2 rounded shadow-lg"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <FaUnlock aria-label="unlocked" />
          ) : (
            <FaLock aria-label="locked" />
          )}
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

