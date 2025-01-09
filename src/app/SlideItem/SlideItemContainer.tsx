// src/app/SlideItem/SlideItemContainer.tsx
"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Slide } from "../types";
import { useSlides } from "../SlideContext";
import { useLastAdded } from "../LastAddedContext";
import {
  updateSlideText,
  addChildSlide,
  deleteSlide,
  addSiblingSlide,
} from "./slideOperations";
import SlideItemView from "./SlideItemView";
import SlideChildren from "./SlideChildren";

interface SlideItemContainerProps {
  slide: Slide;
  isEditing: boolean;
}

/**
 * This is the “smart” container component.
 * It knows about the global slides and how to modify them.
 * It passes the final data and event handlers down to SlideItemView (presentation).
 */
const SlideItemContainer: React.FC<SlideItemContainerProps> = ({
  slide,
  isEditing,
}) => {
  const { setSlides } = useSlides();
  const { lastAdded, setLastAdded } = useLastAdded();
  const [text, setText] = useState(slide.text);

  // Update this slide's text in the global slides state
  const handleTextChange = (newText: string) => {
    setText(newText);
    setSlides((prev) => updateSlideText(prev, slide.id, newText));
  };

  // Creates a new "child" slide
  const handleAddChild = () => {
    const newId = uuidv4();
    setSlides((prev) => addChildSlide(prev, slide.id, newId, setLastAdded));
  };

  // Creates a new sibling slide
  const handleAddSibling = () => {
    const newId = uuidv4();
    if (!slide.parentId) {
      // It's a root slide => add another root slide
      setSlides((prev) => addSiblingSlide(prev, slide.id, newId, true, setLastAdded));
    } else {
      // A normal sibling
      setSlides((prev) => addSiblingSlide(prev, slide.id, newId, false, setLastAdded));
    }
  };

  // Deletes the current slide node
  const handleDeleteNode = () => {
    setSlides((prev) => deleteSlide(prev, slide.id));
  };

  return (
    <SlideItemView
      text={text}
      isEditing={isEditing}
      isLastAdded={(lastAdded === slide.id)}
      hasChildren={slide.children.length > 0}
      onTextChange={handleTextChange}
      onAddChild={handleAddChild}
      onAddSibling={handleAddSibling}
      onDeleteNode={handleDeleteNode}
      childrenElements={
        <SlideChildren childrenSlides={slide.children} isEditing={isEditing} />
      }
    />
  );
};

export default SlideItemContainer;

