// Hook for managing AI features
import { useCallback } from 'react';
import GeminiService from '../services/geminiService';

export const useAIFeatures = (mediaAssets, setMediaAssets, handleShowError) => {
  const removeBackground = useCallback(async (assetId, mediaAsset) => {
    try {
      const processedImageSrc = await GeminiService.removeBackgroundImage(mediaAsset.src);
      setMediaAssets(prevAssets =>
        prevAssets.map(asset =>
          asset.id === assetId ? { ...asset, backgroundRemovedSrc: processedImageSrc } : asset
        )
      );
    } catch (error) {
      handleShowError("Failed to remove background.");
    }
  }, [setMediaAssets, handleShowError]);

  return { removeBackground };
};
