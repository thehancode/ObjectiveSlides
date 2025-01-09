// src/app/SlideItem/SlideChildren.tsx
"use client";

import React from "react";
import { Slide } from "../types";
import SlideItemContainer from "./SlideItemContainer";

interface SlideChildrenProps {
  childrenSlides: Slide[];
  isEditing: boolean;
}

/**
 * Renders a list of child slides recursively,
 * each child uses the SlideItemContainer
 */
const SlideChildren: React.FC<SlideChildrenProps> = ({
  childrenSlides,
  isEditing,
}) => {
  return (
    <>
      {childrenSlides.map((child) => (
        <SlideItemContainer key={child.id} slide={child} isEditing={isEditing} />
      ))}
    </>
  );
};

export default SlideChildren;

