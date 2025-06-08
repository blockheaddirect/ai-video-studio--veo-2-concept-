// Context for centralized state management
import React, { createContext, useContext, useState } from 'react';
import { MediaAsset, StoryboardItem } from '../shared/types';

export type VideoStudioContextType = {
  mediaAssets: MediaAsset[];
  setMediaAssets: React.Dispatch<React.SetStateAction<MediaAsset[]>>;
  storyboard: StoryboardItem[];
  setStoryboard: React.Dispatch<React.SetStateAction<StoryboardItem[]>>;
  currentTopic: string;
  setCurrentTopic: (topic: string) => void;
};

const VideoStudioContext = createContext<VideoStudioContextType | null>(null);

export const VideoStudioProvider = ({ children }) => {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [storyboard, setStoryboard] = useState<StoryboardItem[]>([]);
  const [currentTopic, setCurrentTopic] = useState('');

  return (
    <VideoStudioContext.Provider value={{ mediaAssets, setMediaAssets, storyboard, setStoryboard, currentTopic, setCurrentTopic }}>
      {children}
    </VideoStudioContext.Provider>
  );
};

export const useVideoStudio = () => useContext(VideoStudioContext);

export const updateCurrentTopic = (context, newTopic) => {
  if (context.currentTopic !== newTopic) {
    context.setCurrentTopic(newTopic);
  }
};
