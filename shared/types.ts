export type MediaAsset = {
  id: string;
  type: 'image' | 'video';
  src: string;
  prompt?: string;
  origin: 'uploaded' | 'generated';
  keywords?: string[];
};

export type StoryboardItem = {
  id: string;
  assetId: string;
  duration: number;
  textOverlays?: TextOverlay[];
  filter?: string;
  aiFeatures?: string[];
};

export type TextOverlay = {
  text: string;
  position: { x: number; y: number };
  fontSize: number;
  color: string;
};

export type ActiveTool = 'GENERATE' | 'EDIT' | 'EXPORT';

export type FilterOption = {
  name: string;
  value: string;
};
