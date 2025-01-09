// src/app/SlideItem/slideOperations.ts
import { Slide } from "../types";

/**
 * Recursively update a slide’s text by its ID
 */
export function updateSlideText(
  slides: Slide[],
  slideId: string,
  newText: string
): Slide[] {
  return slides.map((s) => {
    if (s.id === slideId) {
      return { ...s, text: newText };
    }
    return { ...s, children: updateSlideText(s.children, slideId, newText) };
  });
}

/**
 * Recursively find a parent and add a new child slide
 */
export function addChildSlide(
  slides: Slide[],
  parentId: string,
  newSlideId: string,
  setLastAdded: (id: string) => void
): Slide[] {
  return slides.map((s) => {
    setLastAdded(newSlideId)
    if (s.id === parentId) {
      const newChild: Slide = {
        id: newSlideId,
        text: "",
        parentId: parentId,
        children: [],
      };
      return { ...s, children: [...s.children, newChild] };
    }
    return { ...s, children: addChildSlide(s.children, parentId, newSlideId, setLastAdded) };
  });
}

/**
 * Recursively delete a slide by its ID
 */
export function deleteSlide(slides: Slide[], slideIdToDelete: string): Slide[] {
  return slides
    .map((s) => {
      if (s.id === slideIdToDelete) {
        // Filter out this slide by returning null
        return null;
      }
      // Otherwise, keep searching in its children
      return { ...s, children: deleteSlide(s.children, slideIdToDelete) };
    })
    .filter((s) => s !== null) as Slide[];
}

/**
 * Find the parent slide and add a new sibling
 */
export function addSiblingSlide(
  slides: Slide[],
  siblingId: string,
  newSlideId: string,
  isRootSibling: boolean,
  setLastAdded: (id: string) => void
): Slide[] {
  // If it’s a root sibling, just add at the top level
  if (isRootSibling) {
    setLastAdded(newSlideId)
    return [
      ...slides,
      {
        id: newSlideId,
        text: "",
        parentId: null,
        children: [],
      },
    ];
  }

  // Otherwise, find the sibling’s parent
  return slides.map((s) => {
    if (s.id === siblingId) {
      return s; // not the parent itself
    }
    if (s.children.some((child) => child.id === siblingId)) {
      // We found the parent
      setLastAdded(newSlideId)
      const newSibling: Slide = {
        id: newSlideId,
        text: "",
        parentId: s.id,
        children: [],
      };
      return {
        ...s,
        children: [...s.children, newSibling],
      };
    }
    // Keep searching down the tree
    return {
      ...s,
      children: addSiblingSlide(s.children, siblingId, newSlideId, false, setLastAdded),
    };
  });
}

