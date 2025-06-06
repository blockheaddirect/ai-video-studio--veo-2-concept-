
import React from 'react';
import { MediaAsset } from '../types';
import { Button } from './Button';
import { PlusCircleIcon, UploadCloudIcon, SparklesIcon } from '../constants'; // Added SparklesIcon

interface MediaBinProps {
  assets: MediaAsset[];
  onAddToStoryboard: (assetId: string) => void;
  onDeleteAsset: (assetId: string) => void;
}

export const MediaBin: React.FC<MediaBinProps> = ({ assets, onAddToStoryboard, onDeleteAsset }) => {
  if (assets.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <p>Your generated or uploaded media will appear here.</p>
        <p className="text-sm">Use "Generate Scene" or "Upload Image" to add media.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assets.map((asset) => (
        <div key={asset.id} className="bg-surface-alt p-3 rounded-lg shadow flex items-start space-x-3">
          <img src={asset.src} alt={asset.prompt || asset.filename} className="w-20 h-12 object-cover rounded flex-shrink-0" />
          <div className="flex-grow min-w-0"> {/* Added min-w-0 for better truncation */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text truncate flex-grow" title={asset.prompt || asset.filename}>
                {asset.origin === 'uploaded' && <UploadCloudIcon className="w-4 h-4 mr-1.5 inline-block text-sky-400" title="Uploaded"/>}
                {asset.origin === 'generated' && <SparklesIcon className="w-4 h-4 mr-1.5 inline-block text-purple-400" title="AI Generated"/>}
                {asset.filename || asset.prompt || "Untitled Asset"}
              </p>
              <Button size="sm" variant="ghost" onClick={() => onAddToStoryboard(asset.id)} title="Add to Storyboard" className="ml-2 flex-shrink-0 p-1">
                 <PlusCircleIcon className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-text-muted capitalize">
              {asset.origin} {asset.type}
            </p>
            {asset.keywords && asset.keywords.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {asset.keywords.map(keyword => (
                  <span key={keyword} className="px-1.5 py-0.5 text-xs bg-slate-600 text-slate-300 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
           {/* <Button size="sm" variant="danger" onClick={() => onDeleteAsset(asset.id)} title="Delete Asset">
             <TrashIcon className="w-5 h-5" />
          </Button> // Add TrashIcon to constants if needed and uncomment to enable delete */ }
        </div>
      ))}
    </div>
  );
};
