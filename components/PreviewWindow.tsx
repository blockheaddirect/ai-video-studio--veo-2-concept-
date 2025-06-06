
import React from 'react';
import { StoryboardItem, MediaAsset, TextOverlay } from '../types';
import { DEFAULT_PLACEHOLDER_IMAGE } from '../constants';

interface PreviewWindowProps {
  selectedItem: StoryboardItem | null;
  mediaAsset: MediaAsset | null;
}

export const PreviewWindow: React.FC<PreviewWindowProps> = ({ selectedItem, mediaAsset }) => {
  let assetSrc = mediaAsset?.src || DEFAULT_PLACEHOLDER_IMAGE;

  if (mediaAsset && selectedItem?.aiFeatures) {
    // Precedence: Relit > Background Removed > Enhanced Quality > Original Source
    if (selectedItem.aiFeatures.relit && mediaAsset.relitSrc) {
      assetSrc = mediaAsset.relitSrc;
    } else if (selectedItem.aiFeatures.backgroundRemoved && mediaAsset.backgroundRemovedSrc) {
      assetSrc = mediaAsset.backgroundRemovedSrc;
    } else if (selectedItem.aiFeatures.enhancedQuality && mediaAsset.enhancedQualitySrc) {
      assetSrc = mediaAsset.enhancedQualitySrc;
    }
    // If no AI features with dedicated Src are active, assetSrc remains mediaAsset.src (set initially)
  }

  const filterStyle = selectedItem?.filter ? { filter: selectedItem.filter } : {};

  const renderTextOverlay = (overlay: TextOverlay) => (
    <div
      key={overlay.id}
      className="absolute pointer-events-none select-none"
      style={{
        left: `${overlay.position.x}%`,
        top: `${overlay.position.y}%`,
        transform: 'translate(-50%, -50%)', // Center the text, adjust if needed
        fontSize: `${overlay.fontSize}px`,
        color: overlay.color,
        fontFamily: overlay.fontFamily,
        textShadow: '1px 1px 2px rgba(0,0,0,0.7)', // Basic shadow for readability
        whiteSpace: 'pre-wrap', // Preserve newlines
        textAlign: 'center',
      }}
    >
      {overlay.text}
    </div>
  );

  return (
    <div className="w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden relative flex items-center justify-center">
      {selectedItem && mediaAsset ? (
        <>
          <img
            src={assetSrc}
            alt={mediaAsset.prompt || "Video preview"}
            className="w-full h-full object-contain"
            style={filterStyle}
          />
          {selectedItem.textOverlays.map(renderTextOverlay)}
        </>
      ) : (
        <div className="text-center text-text-muted p-8">
          <h3 className="text-2xl font-semibold mb-2">AI Video Studio</h3>
          <p>Select a scene from the storyboard or generate a new one to begin editing.</p>
          <img src={DEFAULT_PLACEHOLDER_IMAGE} alt="Placeholder" className="mt-4 w-full max-w-md mx-auto opacity-30 rounded-md"/>
        </div>
      )}
       {selectedItem?.aiFeatures?.autoCaptionsText && (
          <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 text-white p-2 rounded text-sm text-center">
            {selectedItem.aiFeatures.autoCaptionsText}
          </div>
        )}
      {selectedItem?.audioSrc && (
        <audio src={selectedItem.audioSrc} controls autoPlay className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/2 opacity-80 hover:opacity-100 transition-opacity duration-300 z-10 rounded-lg shadow-lg" />
      )}
    </div>
  );
};
