// src/app/SlideItem.tsx
"use client";

import React, { useState } from "react";
import { Slide } from "./types";
import { useSlides } from "./SlideContext";
import { v4 as uuidv4 } from "uuid"; // for unique ids

interface SlideItemProps {
  slide: Slide;
  isEditing: boolean;
}

/**
 * SlideItem component:
 *  - Displays a single slide
 *  - In editing mode, it has an <textarea> or <input> for the text
 *  - Clicking bottom border => addChild()
 *  - Clicking right border => addSibling()
 */
const SlideItem: React.FC<SlideItemProps> = ({ slide, isEditing }) => {
  const { setSlides } = useSlides();

  const [text, setText] = useState(slide.text);

  // Update this slide's text in the global slides state
  const handleTextChange = (newText: string) => {
    setText(newText);
    setSlides((prev) =>
      updateSlideText(prev, slide.id, newText)
    );
  };

  // Creates a new "child" slide
  const addChild = () => {
    const newId = uuidv4();
    setSlides((prev) => addChildSlide(prev, slide.id, newId));
  };

  // Creates a new "sibling" slide
  const addSibling = () => {
    if (!slide.parentId) {
      // If there's no parent, treat this as "root" -> just add more root slides?
      const newId = uuidv4();
      setSlides((prev) => addSiblingSlide(prev, slide.id, newId, true));
    } else {
      const newId = uuidv4();
      setSlides((prev) => addSiblingSlide(prev, slide.id, newId, false));
    }
  };

  return (
    <div className="border border-red-400 relative flex flex-row justify-start items-start">
      <div className="flex flex-col justify-start relative">
        <div className="flex items-center justify-center w-full h-48">
          <textarea
            className="w-64  text-center text-3xl p-2 bg-transparent rounded focus:outline-none resize-y overflow-hidden"
            value={text}
            readOnly={!isEditing}
            onChange={(e) => handleTextChange(e.target.value)}
          />
        </div>


        {/* Invisible clickable bottom border with fixed height */}
        <div
          className="absolute bottom-0 left-0 w-full h-4 cursor-pointer hover:bg-gray-300"
          onClick={isEditing ? addSibling : undefined}
        ></div>

        {/* Invisible clickable right border with fixed width */}
        <div
          className="absolute right-0 top-0 h-full w-4 cursor-pointer hover:bg-gray-300"
          onClick={isEditing ? addChild : undefined}
        ></div>

        {/* Invisible clickable top border with fixed height */}
        <div
          className="absolute top-0 left-0 w-full h-4 cursor-pointer hover:bg-gray-300"
          onClick={isEditing ? addChild : undefined}
        ></div>
      </div>

      <div className="flex flex-col">
        {slide.children && slide.children.length > 0 && (
          <div className="flex flex-col  border-l pl-4">
            {slide.children.map((child) => (
              <SlideItem key={child.id} slide={child} isEditing={isEditing} />
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default SlideItem;

/**
 * Helper functions to manipulate the slides array
 */

// Recursively find the target slide by id and update its text
function updateSlideText(slides: Slide[], slideId: string, newText: string): Slide[] {
  return slides.map((s) => {
    if (s.id === slideId) {
      return { ...s, text: newText };
    }
    return { ...s, children: updateSlideText(s.children, slideId, newText) };
  });
}

// Recursively find the parent slide, add a new child
function addChildSlide(slides: Slide[], parentId: string, newSlideId: string): Slide[] {
  return slides.map((s) => {
    if (s.id === parentId) {
      const newChild: Slide = {
        id: newSlideId,
        text: "New child slide",
        parentId: parentId,
        children: [],
      };
      return { ...s, children: [...s.children, newChild] };
    }
    // otherwise keep searching in children
    return { ...s, children: addChildSlide(s.children, parentId, newSlideId) };
  });
}

// Add a sibling: we need to find the parent, then insert a new slide in the parent's children
function addSiblingSlide(
  slides: Slide[],
  siblingId: string,
  newSlideId: string,
  isRootSibling: boolean
): Slide[] {
  // If it’s a root sibling, just push to the top level
  if (isRootSibling) {
    return [
      ...slides,
      {
        id: newSlideId,
        text: "New root sibling slide",
        parentId: null,
        children: [],
      },
    ];
  }

  // Otherwise, find the sibling’s parent
  return slides.map((s) => {
    if (s.id === siblingId) {
      // not the parent, but the sibling itself
      return s;
    }
    if (s.children.some((child) => child.id === siblingId)) {
      // We found the parent
      const newSibling: Slide = {
        id: newSlideId,
        text: "New sibling slide",
        parentId: s.id,
        children: [],
      };
      return {
        ...s,
        children: [
          ...s.children,
          newSibling,
        ],
      };
    }
    // else keep searching
    return {
      ...s,
      children: addSiblingSlide(s.children, siblingId, newSlideId, false),
    };
  });
}

