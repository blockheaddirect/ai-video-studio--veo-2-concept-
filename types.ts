
export interface TextOverlay {
  id: string;
  text: string;
  fontSize: number;
  color: string;
  position: { x: number; y: number }; // 0-100 percentage
  fontFamily: string;
}

export interface MediaAsset {
  id: string;
  type: 'image'; // Represents a video clip/scene
  src: string; // base64 data URI or placeholder URL
  prompt: string; // For generated assets, or can be empty for uploads initially
  filename?: string; // e.g. "beach_sunset.png" or uploaded_image.jpg
  keywords?: string[];
  origin: 'generated' | 'uploaded';
}

export interface StoryboardItem {
  id: string;
  assetId: string; // Points to a MediaAsset
  duration: number; // Simulated duration in seconds
  textOverlays: TextOverlay[];
  filter: string | null; // CSS filter string
  aiFeatures: {
    autoCaptionsText?: string;
    textToSpeechText?: string;
    backgroundRemoved: boolean;
    stabilized: boolean;
    relit: boolean;
    flickerRemoved: boolean;
  };
}

export enum ActiveTool {
  GENERATE = 'GENERATE',
  TEXT = 'TEXT',
  FILTER = 'FILTER',
  AI_ENHANCE = 'AI_ENHANCE',
  AUDIO = 'AUDIO',
}

export interface FilterOption {
  name: string;
  value: string | null; // CSS filter value, null for 'None'
}
