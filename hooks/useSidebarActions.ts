// Hook for sidebar-related actions
import { useCallback } from 'react';

export const useSidebarActions = (mediaAssets, setMediaAssets, storyboard, setStoryboard, handleShowError) => {
  const addToStoryboard = useCallback((assetId) => {
    const asset = mediaAssets.find(a => a.id === assetId);
    if (!asset) return;

    const newItem = {
      id: generateId(),
      assetId: asset.id,
      duration: 5,
      textOverlays: [],
      filter: null,
      aiFeatures: { backgroundRemoved: false, stabilized: false, relit: false, flickerRemoved: false }
    };
    setStoryboard(prev => [...prev, newItem]);
  }, [mediaAssets, setStoryboard]);

  return { addToStoryboard };
};
