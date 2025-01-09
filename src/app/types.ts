export interface Slide {
  id: string;
  text: string;
  parentId: string | null; // null if it's the root
  parent: Slide | null;    // Reference to the parent slide
  children: Slide[];
}
