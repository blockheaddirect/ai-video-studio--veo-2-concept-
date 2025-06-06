
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { PreviewWindow } from './components/PreviewWindow';
import { StoryboardLane } from './components/StoryboardLane';
import { MediaAsset, StoryboardItem, TextOverlay, ActiveTool } from './types';
import * as GeminiService from './services/geminiService';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DEFAULT_PLACEHOLDER_IMAGE, FilmIcon } from './constants'; // Added FilmIcon

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const App: React.FC = () => {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [storyboard, setStoryboard] = useState<StoryboardItem[]>([]);
  const [selectedStoryboardItemId, setSelectedStoryboardItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool | null>(ActiveTool.GENERATE);
  const [currentTopic, setCurrentTopic] = useState<string | null>("General");

  const updateCurrentTopic = useCallback(() => {
    if (storyboard.length === 0) {
      setCurrentTopic("General");
      return;
    }

    const allKeywords: string[] = [];
    storyboard.forEach(item => {
      const asset = mediaAssets.find(a => a.id === item.assetId);
      if (asset && asset.keywords) {
        allKeywords.push(...asset.keywords);
      }
    });

    if (allKeywords.length === 0 && mediaAssets.some(ma => ma.origin === 'generated' && storyboard.some(si => si.assetId === ma.id))) {
        setCurrentTopic("AI Generated Theme");
        return;
    }
    if (allKeywords.length === 0) {
        setCurrentTopic("Mixed Media");
        return;
    }


    const keywordFrequencies: Record<string, number> = {};
    allKeywords.forEach(keyword => {
      keywordFrequencies[keyword] = (keywordFrequencies[keyword] || 0) + 1;
    });

    const sortedKeywords = Object.entries(keywordFrequencies)
      .sort(([,a], [,b]) => b - a)
      .map(([keyword]) => keyword);

    if (sortedKeywords.length > 0) {
      // Take top 1-2 keywords to represent topic
      setCurrentTopic(sortedKeywords.slice(0, 2).join(', '));
    } else {
      setCurrentTopic("User Uploaded Theme"); // Fallback if storyboard has items but no keywords
    }
  }, [storyboard, mediaAssets]);


  useEffect(() => {
    const initialAssetId = generateId();
    const initialAsset: MediaAsset = {
      id: initialAssetId,
      type: 'image',
      src: DEFAULT_PLACEHOLDER_IMAGE,
      prompt: 'A beautiful landscape (placeholder)',
      filename: 'placeholder_scene.jpg',
      origin: 'generated', // Initial placeholder is 'generated'
      keywords: ['landscape', 'placeholder']
    };
    setMediaAssets([initialAsset]);

    const initialStoryboardItem: StoryboardItem = {
      id: generateId(),
      assetId: initialAssetId,
      duration: 5,
      textOverlays: [],
      filter: null,
      aiFeatures: { backgroundRemoved: false, stabilized: false, relit: false, flickerRemoved: false },
    };
    setStoryboard([initialStoryboardItem]);
    setSelectedStoryboardItemId(initialStoryboardItem.id);
  }, []);
  
  useEffect(() => {
    updateCurrentTopic();
  }, [storyboard, mediaAssets, updateCurrentTopic]);


  const handleShowError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 7000);
  };

  const handleGenerateVideo = useCallback(async (originalPrompt: string) => {
    if (!originalPrompt.trim()) {
      handleShowError("Prompt cannot be empty.");
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    
    const PROMPT_SPLIT_THRESHOLD_LENGTH = 180;
    const containsSceneKeywords = originalPrompt.toLowerCase().includes("act ") || originalPrompt.toLowerCase().includes("scene ");
    const generatedAssets: MediaAsset[] = [];

    try {
      let promptsToGenerate: string[] = [originalPrompt];
      if (originalPrompt.length > PROMPT_SPLIT_THRESHOLD_LENGTH || containsSceneKeywords) {
        setLoadingMessage("Analyzing long prompt and splitting into scenes...");
        const subPrompts = await GeminiService.splitLongPromptIntoSubPrompts(originalPrompt);
        if (subPrompts && subPrompts.length > 0) {
            promptsToGenerate = subPrompts;
        }
      }
      
      for (let i = 0; i < promptsToGenerate.length; i++) {
        const currentPrompt = promptsToGenerate[i];
        setLoadingMessage(promptsToGenerate.length > 1 ? `Generating scene ${i + 1} of ${promptsToGenerate.length}: "${currentPrompt.substring(0, 30)}..."` : "Generating your scene...");
        const imageSrc = await GeminiService.generateImage(currentPrompt);
        const newAsset: MediaAsset = {
          id: generateId(),
          type: 'image',
          src: imageSrc,
          prompt: currentPrompt,
          filename: `${currentPrompt.substring(0,15).replace(/\s/g, '_')}${promptsToGenerate.length > 1 ? `_pt${i+1}` : ''}.png`,
          origin: 'generated',
          keywords: ['ai-generated', ...currentPrompt.toLowerCase().split(' ').filter(w => w.length > 3 && !['the', 'and', 'with', 'into'].includes(w)).slice(0,2)] // Basic auto-keywords
        };
        generatedAssets.push(newAsset);
      }
      
      if (generatedAssets.length > 0) {
        setMediaAssets(prev => [...generatedAssets, ...prev]);
      } else {
        handleShowError("No scenes were generated. The prompt might have been too short or complex.");
      }

    } catch (error) {
      console.error("Generation failed:", error);
      const message = error instanceof Error ? error.message : "Failed to generate video scene(s).";
      handleShowError(`Error: ${message}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }, []);

  const handleImageUpload = useCallback(async (file: File, keywords: string[]) => {
    setIsLoading(true);
    setLoadingMessage("Uploading image...");
    setErrorMessage(null);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAsset: MediaAsset = {
          id: generateId(),
          type: 'image',
          src: reader.result as string,
          prompt: file.name, // Use filename as a default prompt-like field
          filename: file.name,
          origin: 'uploaded',
          keywords: keywords.length > 0 ? keywords : [file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, ' ').toLowerCase()], // Basic auto-keyword from filename
        };
        setMediaAssets(prev => [newAsset, ...prev]);
        setIsLoading(false);
        setLoadingMessage(null);
      };
      reader.onerror = () => {
        handleShowError("Failed to read image file.");
        setIsLoading(false);
        setLoadingMessage(null);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      handleShowError("Failed to upload image.");
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }, []);

  const handleAddToStoryboard = useCallback((assetId: string) => {
    const asset = mediaAssets.find(a => a.id === assetId);
    if (!asset) return;

    const newItem: StoryboardItem = {
      id: generateId(),
      assetId: asset.id,
      duration: 5,
      textOverlays: [],
      filter: null,
      aiFeatures: { backgroundRemoved: false, stabilized: false, relit: false, flickerRemoved: false }
    };
    setStoryboard(prev => [...prev, newItem]);
    setSelectedStoryboardItemId(newItem.id);
  }, [mediaAssets]);

  const handleDeleteAsset = useCallback((assetId: string) => {
    if (storyboard.some(item => item.assetId === assetId)) {
      handleShowError("Cannot delete asset: It's currently used in the storyboard. Remove from storyboard first.");
      return;
    }
    setMediaAssets(prev => prev.filter(asset => asset.id !== assetId));
  }, [storyboard]);

  const handleRemoveFromStoryboard = useCallback((itemId: string) => {
    setStoryboard(prev => {
      const newStoryboard = prev.filter(item => item.id !== itemId);
      if (selectedStoryboardItemId === itemId) {
        setSelectedStoryboardItemId(newStoryboard.length > 0 ? newStoryboard[0].id : null);
      }
      return newStoryboard;
    });
  }, [selectedStoryboardItemId]);

  const updateStoryboardItem = useCallback((itemId: string, updates: Partial<StoryboardItem>) => {
    setStoryboard(prev => 
      prev.map(item => item.id === itemId ? { ...item, ...updates } : item)
    );
  }, []);

  const handleUpdateSelectedItemText = useCallback((overlays: TextOverlay[]) => {
    if (selectedStoryboardItemId) {
      updateStoryboardItem(selectedStoryboardItemId, { textOverlays: overlays });
    }
  }, [selectedStoryboardItemId, updateStoryboardItem]);

  const handleUpdateSelectedItemFilter = useCallback((filter: string | null) => {
    if (selectedStoryboardItemId) {
      updateStoryboardItem(selectedStoryboardItemId, { filter });
    }
  }, [selectedStoryboardItemId, updateStoryboardItem]);

  const handleUpdateSelectedItemAIFeature = useCallback(<K extends keyof StoryboardItem['aiFeatures']>(
    feature: K, 
    value: StoryboardItem['aiFeatures'][K]
  ) => {
    if (selectedStoryboardItemId) {
      const currentItem = storyboard.find(item => item.id === selectedStoryboardItemId);
      if (currentItem) {
        updateStoryboardItem(selectedStoryboardItemId, { 
          aiFeatures: { ...currentItem.aiFeatures, [feature]: value }
        });
      }
    }
  }, [selectedStoryboardItemId, storyboard, updateStoryboardItem]);

  const handleGenerateCaptions = useCallback(async () => {
    if (!selectedStoryboardItemId) return;
    const currentItem = storyboard.find(item => item.id === selectedStoryboardItemId);
    const asset = mediaAssets.find(a => a.id === currentItem?.assetId);
    if (!currentItem || !asset) {
      handleShowError("No item selected or asset not found for captions.");
      return;
    }
    setIsLoading(true);
    setLoadingMessage("Generating captions...");
    setErrorMessage(null);
    try {
      const captions = await GeminiService.generateCaptionsFromPrompt(asset.prompt);
      handleUpdateSelectedItemAIFeature('autoCaptionsText', captions);
    } catch (error) {
       console.error("Caption generation failed:", error);
       handleShowError("Failed to generate captions.");
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }, [selectedStoryboardItemId, storyboard, mediaAssets, handleUpdateSelectedItemAIFeature]);

  const handleSimulateTTS = useCallback(async () => {
    if (!selectedStoryboardItemId) return;
     const currentItem = storyboard.find(item => item.id === selectedStoryboardItemId);
     if (!currentItem) return;

    const textToSpeak = currentItem.textOverlays.length > 0 
      ? currentItem.textOverlays[0].text 
      : "This scene has no text overlays to read.";

    if (!textToSpeak.trim()) {
        handleShowError("No text available in the selected scene for Text-to-Speech.");
        return;
    }

    setIsLoading(true);
    setLoadingMessage("Simulating Text-to-Speech...");
    setErrorMessage(null);
    try {
      const ttsConfirmation = await GeminiService.simulateTextToSpeech(textToSpeak);
      handleUpdateSelectedItemAIFeature('textToSpeechText', ttsConfirmation);
    } catch (error) {
       console.error("TTS simulation failed:", error);
       handleShowError("Failed to simulate Text-to-Speech.");
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }, [selectedStoryboardItemId, storyboard, handleUpdateSelectedItemAIFeature]);


  const currentSelectedItem = storyboard.find(item => item.id === selectedStoryboardItemId);
  const currentMediaAsset = mediaAssets.find(asset => asset.id === currentSelectedItem?.assetId);

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-background text-text">
      <Sidebar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onGenerateVideo={handleGenerateVideo}
        onImageUpload={handleImageUpload}
        isLoading={isLoading}
        mediaAssets={mediaAssets}
        onAddToStoryboard={handleAddToStoryboard}
        onDeleteAsset={handleDeleteAsset}
        selectedItem={currentSelectedItem || null}
        onUpdateSelectedItemText={handleUpdateSelectedItemText}
        onUpdateSelectedItemFilter={handleUpdateSelectedItemFilter}
        onUpdateSelectedItemAIFeature={handleUpdateSelectedItemAIFeature}
        onGenerateCaptions={handleGenerateCaptions}
        onSimulateTTS={handleSimulateTTS}
      />
      <main className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto relative">
        {isLoading && loadingMessage && (
          <div className="absolute inset-0 bg-background bg-opacity-80 flex items-center justify-center z-50">
            <LoadingSpinner text={loadingMessage} />
          </div>
        )}
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-text">Video Preview</h1>
            {currentTopic && (
                <div className="px-3 py-1 bg-primary text-primary-text text-sm rounded-full shadow">
                    Current Topic: <span className="font-semibold capitalize">{currentTopic}</span>
                </div>
            )}
        </div>
        <PreviewWindow 
          selectedItem={currentSelectedItem || null}
          mediaAsset={currentMediaAsset || null}
        />
        <div className="mt-auto"> {/* Push StoryboardLane towards bottom if content is less */}
             <h2 className="text-xl font-semibold text-text mb-2">Storyboard</h2>
            <StoryboardLane
              items={storyboard}
              mediaAssets={mediaAssets}
              selectedItemId={selectedStoryboardItemId}
              onSelectItem={setSelectedStoryboardItemId}
              onRemoveItem={handleRemoveFromStoryboard}
              onMoveItem={() => {}} 
            />
        </div>
      </main>
      {errorMessage && (
        <div className="absolute bottom-5 right-5 bg-red-600 text-white p-3 rounded-md shadow-lg z-[100]">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default App;
