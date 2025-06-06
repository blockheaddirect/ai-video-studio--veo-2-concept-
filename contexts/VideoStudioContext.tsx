// Context for centralized state management
import React, { createContext, useContext, useState } from 'react';

const VideoStudioContext = createContext(null);

export const VideoStudioProvider = ({ children }) => {
  const [mediaAssets, setMediaAssets] = useState([]);
  const [storyboard, setStoryboard] = useState([]);

  return (
    <VideoStudioContext.Provider value={{ mediaAssets, setMediaAssets, storyboard, setStoryboard }}>
      {children}
    </VideoStudioContext.Provider>
  );
};

export const useVideoStudio = () => useContext(VideoStudioContext);
