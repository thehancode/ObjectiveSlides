export interface Slide {
  id: string;
  text: string;
  parentId: string | null; // null if it's the root
  children: Slide[];
}
