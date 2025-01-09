// src/app/SlideItem/SlideItemView.tsx
"use client";

import React, { useEffect, useRef } from 'react';

interface SlideItemViewProps {
  text: string;
  isEditing: boolean;
  isLastAdded: boolean;
  hasChildren: boolean;
  onTextChange: (newText: string) => void;
  onAddSibling?: () => void;
  onAddChild?: () => void;
  onDeleteNode?: () => void;
  childrenElements?: React.ReactNode;
}

const SlideItemView: React.FC<SlideItemViewProps> = ({
  text,
  isEditing,
  isLastAdded,
  hasChildren,
  onTextChange,
  onAddSibling,
  onAddChild,
  onDeleteNode,
  childrenElements,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus the textarea if the item is the last added
    if (isLastAdded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLastAdded]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isEditing) return;

    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent default tab behavior (focus shifting)
      if (onAddChild) {
        onAddChild();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default space behavior in certain cases
      if (onAddSibling) {
        onAddSibling();
      }
    }
  };

  return (
    <div
      className={`border border-red-400 relative flex flex-row justify-start items-start overflow-x-auto ${isLastAdded ? 'bg-blue-500' : ''
        }`}
    >
      <div className="flex flex-col justify-start relative">
        <div className="flex items-center justify-center w-full h-48">
          <textarea
            ref={textareaRef}
            className="w-64 text-center text-3xl p-2 bg-transparent rounded focus:outline-none resize-y overflow-hidden"
            value={text}
            readOnly={!isEditing}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Invisible clickable bottom border with fixed height */}
        <div
          className="absolute bottom-0 left-0 w-full h-4 cursor-pointer hover:bg-gray-300"
          onClick={isEditing ? onAddSibling : undefined}
        ></div>

        {/* Invisible clickable right border with fixed width */}
        <div
          className="absolute right-0 top-0 h-full w-4 cursor-pointer hover:bg-gray-300"
          onClick={isEditing ? onAddChild : undefined}
        ></div>

        {/* Invisible clickable top border with fixed height */}
        {!hasChildren && (
          <div
            className="absolute top-0 left-0 w-full h-4 cursor-pointer hover:bg-gray-300"
            onClick={isEditing ? onDeleteNode : undefined}
          ></div>
        )}
      </div>

      {/* Child slides */}
      <div className="flex flex-col">
        {childrenElements && (
          <div className="flex flex-col border-l pl-4">{childrenElements}</div>
        )}
      </div>
    </div>
  );
};

export default SlideItemView;

