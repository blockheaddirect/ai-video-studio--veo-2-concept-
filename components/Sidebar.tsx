
import React, { useState, useRef } from 'react';
import { ActiveTool, FilterOption, StoryboardItem, TextOverlay, MediaAsset } from '../types';
import { Button } from './Button';
import { MediaBin } from './MediaBin';
import { 
  SparklesIcon, PencilSquareIcon, EyeDropperIcon, MagicWandIcon, SpeakerWaveIcon, 
  DocumentTextIcon, FilmIcon, AVAILABLE_FONTS, FILTER_OPTIONS, UploadCloudIcon
} from '../constants';

interface SidebarProps {
  activeTool: ActiveTool | null;
  setActiveTool: (tool: ActiveTool | null) => void;
  onGenerateVideo: (prompt: string) => void;
  onImageUpload: (file: File, keywords: string[]) => void; // New handler
  isLoading: boolean;
  mediaAssets: MediaAsset[];
  onAddToStoryboard: (assetId: string) => void;
  onDeleteAsset: (assetId: string) => void;
  selectedItem: StoryboardItem | null;
  onUpdateSelectedItemText: (overlays: TextOverlay[]) => void;
  onUpdateSelectedItemFilter: (filter: string | null) => void;
  onUpdateSelectedItemAIFeature: <K extends keyof StoryboardItem['aiFeatures']>(feature: K, value: StoryboardItem['aiFeatures'][K]) => void;
  onGenerateCaptions: () => void;
  onGenerateTTS: () => void;
  onExportVideo: () => void;
}

const ToolButton: React.FC<{icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void}> = ({ icon, label, isActive, onClick}) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full p-3 rounded-lg transition-colors
            ${isActive ? 'bg-primary text-primary-text' : 'bg-surface-alt hover:bg-slate-600 text-text-muted hover:text-text'}`}
        title={label}
    >
        <span className="w-6 h-6 mb-1">{icon}</span>
        <span className="text-xs">{label}</span>
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  activeTool, setActiveTool, onGenerateVideo, onImageUpload, isLoading,
  mediaAssets, onAddToStoryboard, onDeleteAsset, selectedItem,
  onUpdateSelectedItemText, onUpdateSelectedItemFilter, onUpdateSelectedItemAIFeature,
  onGenerateCaptions,
  onGenerateTTS,
  onExportVideo,
}) => {
  const [generatePrompt, setGeneratePrompt] = useState<string>('');
  const [currentTextOverlay, setCurrentTextOverlay] = useState<Partial<TextOverlay>>({ text: '', fontSize: 24, color: '#FFFFFF', fontFamily: 'Arial', position: {x: 50, y: 50}});
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadKeywords, setUploadKeywords] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToolToggle = (tool: ActiveTool) => {
    setActiveTool(activeTool === tool ? null : tool);
  };
  
  const handleAddTextOverlay = () => {
    if (!selectedItem || !currentTextOverlay.text) return;
    const newOverlay: TextOverlay = {
      id: Date.now().toString(),
      text: currentTextOverlay.text || "New Text",
      fontSize: currentTextOverlay.fontSize || 24,
      color: currentTextOverlay.color || '#FFFFFF',
      fontFamily: currentTextOverlay.fontFamily || 'Arial',
      position: currentTextOverlay.position || { x: 50, y: 50 },
    };
    onUpdateSelectedItemText([...selectedItem.textOverlays, newOverlay]);
    setCurrentTextOverlay({ text: '', fontSize: 24, color: '#FFFFFF', fontFamily: 'Arial', position: {x: 50, y: 50}});
  };

  const handleRemoveTextOverlay = (id: string) => {
    if (!selectedItem) return;
    onUpdateSelectedItemText(selectedItem.textOverlays.filter(o => o.id !== id));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadImage = () => {
    if (selectedFile) {
      const keywordsArray = uploadKeywords.split(',').map(k => k.trim()).filter(k => k);
      onImageUpload(selectedFile, keywordsArray);
      setSelectedFile(null);
      setUploadKeywords('');
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  };
  
  const renderGenerateTool = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text">Generate Scene</h3>
      <textarea
        value={generatePrompt}
        onChange={(e) => setGeneratePrompt(e.target.value)}
        placeholder="e.g., A futuristic cityscape at sunset, neon lights"
        className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:ring-primary focus:border-primary text-sm h-24 resize-none"
      />
      <Button onClick={() => { if(generatePrompt.trim()) onGenerateVideo(generatePrompt); }} isLoading={isLoading} disabled={isLoading || !generatePrompt.trim()} className="w-full">
        <SparklesIcon className="w-5 h-5 mr-2" /> Generate
      </Button>
    </div>
  );

  const renderUploadTool = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text">Upload Image</h3>
      <div>
        <label htmlFor="imageUpload" className="block text-sm font-medium text-text-muted mb-1">Select Image</label>
        <input 
          type="file" 
          id="imageUpload" 
          accept="image/*" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-text hover:file:bg-primary-hover"
        />
      </div>
      {selectedFile && (
        <div className="space-y-3 p-3 bg-slate-700 rounded-md">
          <p className="text-sm text-text-muted">Selected: {selectedFile.name}</p>
          <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="max-h-32 rounded-md object-contain mx-auto"/>
          <div>
            <label htmlFor="uploadKeywords" className="block text-sm font-medium text-text-muted mb-1">Keywords (comma-separated)</label>
            <input
              type="text"
              id="uploadKeywords"
              value={uploadKeywords}
              onChange={(e) => setUploadKeywords(e.target.value)}
              placeholder="e.g., nature, mountain, sunset"
              className="w-full p-2 rounded-md bg-slate-600 border border-slate-500 focus:ring-primary focus:border-primary text-sm"
            />
          </div>
          <Button onClick={handleUploadImage} isLoading={isLoading} disabled={isLoading} className="w-full">
            <UploadCloudIcon className="w-5 h-5 mr-2" /> Upload & Add to Bin
          </Button>
        </div>
      )}
    </div>
  );

  const renderTextTool = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text">Add Text Overlay</h3>
      {!selectedItem && <p className="text-sm text-text-muted">Select a scene from the storyboard to add text.</p>}
      {selectedItem && (
        <>
          <textarea
            value={currentTextOverlay.text}
            onChange={(e) => setCurrentTextOverlay(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Enter text for overlay"
            className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:ring-primary focus:border-primary text-sm h-20 resize-none"
          />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <label htmlFor="fontSize" className="block text-text-muted mb-1">Font Size</label>
              <input type="number" id="fontSize" value={currentTextOverlay.fontSize} onChange={e => setCurrentTextOverlay(p => ({...p, fontSize: parseInt(e.target.value,10)}))} className="w-full p-2 rounded bg-slate-700 border border-slate-600"/>
            </div>
            <div>
              <label htmlFor="fontColor" className="block text-text-muted mb-1">Color</label>
              <input type="color" id="fontColor" value={currentTextOverlay.color} onChange={e => setCurrentTextOverlay(p => ({...p, color: e.target.value}))} className="w-full p-1 rounded bg-slate-700 border border-slate-600 h-10"/>
            </div>
            <div>
                <label htmlFor="fontFamily" className="block text-text-muted mb-1">Font Family</label>
                <select 
                    id="fontFamily" 
                    value={currentTextOverlay.fontFamily} 
                    onChange={e => setCurrentTextOverlay(p => ({...p, fontFamily: e.target.value}))}
                    className="w-full p-2 rounded bg-slate-700 border border-slate-600 h-10 appearance-none"
                >
                    {AVAILABLE_FONTS.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="posX" className="block text-text-muted mb-1">Position X (%)</label>
                <input type="number" id="posX" min="0" max="100" value={currentTextOverlay.position?.x} onChange={e => setCurrentTextOverlay(p => ({...p, position: {...p.position!, x: parseInt(e.target.value,10)}}))} className="w-full p-2 rounded bg-slate-700 border border-slate-600"/>
            </div>
             <div>
                <label htmlFor="posY" className="block text-text-muted mb-1">Position Y (%)</label>
                <input type="number" id="posY" min="0" max="100" value={currentTextOverlay.position?.y} onChange={e => setCurrentTextOverlay(p => ({...p, position: {...p.position!, y: parseInt(e.target.value,10)}}))} className="w-full p-2 rounded bg-slate-700 border border-slate-600"/>
            </div>
          </div>
          <Button onClick={handleAddTextOverlay} disabled={!currentTextOverlay.text?.trim()} className="w-full">Add Overlay</Button>
          {selectedItem.textOverlays.length > 0 && <h4 className="text-md font-semibold mt-4">Existing Overlays:</h4>}
          {selectedItem.textOverlays.map(overlay => (
              <div key={overlay.id} className="text-xs p-2 bg-slate-700 rounded flex justify-between items-center">
                  <span className="truncate" title={overlay.text}>{overlay.text}</span>
                  <button onClick={() => handleRemoveTextOverlay(overlay.id)} className="text-red-400 hover:text-red-300">Remove</button>
              </div>
          ))}
        </>
      )}
    </div>
  );
  
  const renderFilterTool = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text">Apply Filter</h3>
      {!selectedItem && <p className="text-sm text-text-muted">Select a scene to apply filters.</p>}
      {selectedItem && (
        <div className="grid grid-cols-2 gap-2">
          {FILTER_OPTIONS.map((filter: FilterOption) => (
            <Button
              key={filter.name}
              variant={selectedItem.filter === filter.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onUpdateSelectedItemFilter(filter.value)}
              className="w-full"
            >
              {filter.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );

  const renderAITools = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text">AI Enhancements</h3>
      {!selectedItem && <p className="text-sm text-text-muted">Select a scene to use AI tools.</p>}
      {selectedItem && (
        <div className="space-y-3">
          <Button onClick={onGenerateCaptions} isLoading={isLoading} className="w-full justify-start" variant="ghost">
            <DocumentTextIcon className="w-5 h-5 mr-2"/> Auto Captions
          </Button>
           {selectedItem.aiFeatures.autoCaptionsText && <p className="text-xs p-2 bg-slate-700 rounded">{selectedItem.aiFeatures.autoCaptionsText}</p>}
          
          <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
            <label htmlFor="bgRemoval" className="text-sm flex items-center"><MagicWandIcon className="w-5 h-5 mr-2 text-purple-400"/> Background Removal</label>
            <input type="checkbox" id="bgRemoval" className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary" 
              checked={selectedItem.aiFeatures.backgroundRemoved}
              onChange={e => onUpdateSelectedItemAIFeature('backgroundRemoved', e.target.checked)} />
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
            <label htmlFor="enhanceQuality" className="text-sm flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-cyan-400"/> AI Enhance Quality
            </label>
            <input
              type="checkbox"
              id="enhanceQuality"
              className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary"
              checked={selectedItem.aiFeatures.enhancedQuality}
              disabled={selectedItem.aiFeatures.isEnhancingQuality}
              onChange={e => onUpdateSelectedItemAIFeature('enhancedQuality', e.target.checked)}
            />
          </div>
           <div className="flex items-center justify-between p-2 bg-slate-700 rounded">
            <label htmlFor="relight" className="text-sm flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-yellow-400"/> Relight Scene</label>
            <input type="checkbox" id="relight" className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary" 
              checked={selectedItem.aiFeatures.relit}
              onChange={e => onUpdateSelectedItemAIFeature('relit', e.target.checked)} />
          </div>
        </div>
      )}
    </div>
  );

  const renderAudioTools = () => (
     <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text">Audio Tools</h3>
      {!selectedItem && <p className="text-sm text-text-muted">Select a scene to manage audio.</p>}
      {selectedItem && (
        <div className="space-y-3">
           <Button
            onClick={onGenerateTTS}
            isLoading={isLoading || selectedItem.aiFeatures.isGeneratingTTS}
            disabled={!selectedItem || (!selectedItem.textOverlays.some(t => t.text.trim()) && !selectedItem.aiFeatures.autoCaptionsText?.trim()) || (selectedItem.aiFeatures.isGeneratingTTS)}
            className="w-full justify-start"
            variant="ghost"
            title={selectedItem.audioSrc ? "Re-generate audio for the current text" : "Generate audio for the current text"}
           >
            <SpeakerWaveIcon className="w-5 h-5 mr-2"/>
            {selectedItem.audioSrc ? "Re-generate Audio from Text" : "Generate Audio from Text"}
          </Button>
          {selectedItem.aiFeatures.textToSpeechText && !selectedItem.audioSrc && /* Show simulation text only if no real audio */ (
            <p className="text-xs p-2 bg-slate-700 rounded">Source Text: {selectedItem.aiFeatures.textToSpeechText}</p>
          )}
          {/* Potentially show a message if audioSrc exists, e.g., "Audio generated." */}
        </div>
      )}
    </div>
  );


  return (
    <div className="w-96 bg-surface text-text flex flex-col h-full border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-2xl font-bold flex items-center">
            <FilmIcon className="w-8 h-8 mr-2 text-primary"/> AI Video Studio
        </h2>
      </div>

      <div className="grid grid-cols-5 gap-1 p-2 border-b border-border">
          <ToolButton icon={<SparklesIcon/>} label="Generate" isActive={activeTool === ActiveTool.GENERATE} onClick={() => handleToolToggle(ActiveTool.GENERATE)} />
          <ToolButton icon={<PencilSquareIcon/>} label="Text" isActive={activeTool === ActiveTool.TEXT} onClick={() => handleToolToggle(ActiveTool.TEXT)} />
          <ToolButton icon={<EyeDropperIcon/>} label="Filters" isActive={activeTool === ActiveTool.FILTER} onClick={() => handleToolToggle(ActiveTool.FILTER)} />
          <ToolButton icon={<MagicWandIcon/>} label="AI Tools" isActive={activeTool === ActiveTool.AI_ENHANCE} onClick={() => handleToolToggle(ActiveTool.AI_ENHANCE)} />
          <ToolButton icon={<SpeakerWaveIcon/>} label="Audio" isActive={activeTool === ActiveTool.AUDIO} onClick={() => handleToolToggle(ActiveTool.AUDIO)} />
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto">
        {activeTool === ActiveTool.GENERATE && renderGenerateTool()}
        {activeTool === ActiveTool.TEXT && renderTextTool()}
        {activeTool === ActiveTool.FILTER && renderFilterTool()}
        {activeTool === ActiveTool.AI_ENHANCE && renderAITools()}
        {activeTool === ActiveTool.AUDIO && renderAudioTools()}

        {activeTool === null && (
           <div className="space-y-6 mt-4">
                <div>
                  {renderUploadTool()}
                </div>
                <hr className="border-slate-600"/>
                <div>
                    <h3 className="text-lg font-semibold text-text mb-3">Media Bin</h3>
                    <MediaBin assets={mediaAssets} onAddToStoryboard={onAddToStoryboard} onDeleteAsset={onDeleteAsset} />
                </div>
           </div>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <Button
          onClick={onExportVideo}
          isLoading={isLoading} // Assuming global isLoading can be used for export indication
          disabled={isLoading || mediaAssets.length === 0} // Simple disable if no assets (storyboard check might be better in App.tsx)
          className="w-full"
          variant="success"
        >
          <FilmIcon className="w-5 h-5 mr-2" /> Export Video
        </Button>
      </div>
    </div>
  );
};
