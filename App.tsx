import React, { useState, useEffect, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Sidebar } from './client/components/Sidebar';
import { PreviewWindow } from './client/components/PreviewWindow';
import { StoryboardLane } from './client/components/StoryboardLane';
import { MediaAsset, StoryboardItem, TextOverlay, ActiveTool } from './types';
import * as GeminiService from './shared/services/geminiService';
import { LoadingSpinner } from './client/components/LoadingSpinner';
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

  const handleUpdateSelectedItemAIFeature = useCallback(async <K extends keyof StoryboardItem['aiFeatures']>(
    feature: K, 
    value: StoryboardItem['aiFeatures'][K]
  ) => {
    if (selectedStoryboardItemId) {
      const currentItem = storyboard.find(item => item.id === selectedStoryboardItemId);
      if (!currentItem) return;

      const assetId = currentItem.assetId;
      const mediaAsset = mediaAssets.find(asset => asset.id === assetId);

      if (!mediaAsset) {
        handleShowError("Media asset not found for AI feature.");
        return;
      }

      // Optimistically update UI for features not requiring async calls or specific logic first
      if (feature !== 'backgroundRemoved' && feature !== 'relit' && feature !== 'enhancedQuality') {
        updateStoryboardItem(selectedStoryboardItemId, {
          aiFeatures: { ...currentItem.aiFeatures, [feature]: value }
        });
        return;
      }

      if (feature === 'backgroundRemoved') {
        if (value === true) { // backgroundRemoved is being enabled
          updateStoryboardItem(selectedStoryboardItemId, {
            aiFeatures: { ...currentItem.aiFeatures, backgroundRemoved: true, isBackgroundRemoving: true }
          });
          if (mediaAsset.backgroundRemovedSrc) { // Use existing if available
            updateStoryboardItem(selectedStoryboardItemId, {
              aiFeatures: { ...currentItem.aiFeatures, backgroundRemoved: true, isBackgroundRemoving: false }
            });
            return;
          }
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
        } else { // backgroundRemoved is being disabled
          updateStoryboardItem(selectedStoryboardItemId, {
            aiFeatures: { ...currentItem.aiFeatures, backgroundRemoved: false, isBackgroundRemoving: false }
          });
        }
      } else if (feature === 'relit') {
        if (value === true) { // relit is being enabled
          updateStoryboardItem(selectedStoryboardItemId, {
            aiFeatures: { ...currentItem.aiFeatures, relit: true, isRelighting: true }
          });

          const imageSourceForRelight = (currentItem.aiFeatures.backgroundRemoved && mediaAsset.backgroundRemovedSrc)
            ? mediaAsset.backgroundRemovedSrc
            : mediaAsset.src;

          // TODO: Add logic to check if relitSrc already exists for the *current* base image (src vs backgroundRemovedSrc)
          // This is a simplified check, assuming we always re-generate if toggled.
          // A more robust check would involve storing which base was used for the existing relitSrc.
          if (mediaAsset.relitSrc && !currentItem.aiFeatures.backgroundRemoved) { // Basic check: if relitSrc exists and we are not using backgroundRemoved
             updateStoryboardItem(selectedStoryboardItemId, {
               aiFeatures: { ...currentItem.aiFeatures, relit: true, isRelighting: false }
             });
             return;
          }

          try {
            const processedImageSrc = await GeminiService.relightImage(imageSourceForRelight);
            setMediaAssets(prevAssets =>
              prevAssets.map(asset =>
                asset.id === assetId ? { ...asset, relitSrc: processedImageSrc } : asset
              )
            );
            updateStoryboardItem(selectedStoryboardItemId, {
              aiFeatures: { ...currentItem.aiFeatures, relit: true, isRelighting: false }
            });
          } catch (error) {
            console.error("Relighting failed:", error);
            handleShowError(error instanceof Error ? error.message : "Failed to relight image.");
            updateStoryboardItem(selectedStoryboardItemId, { // Revert
              aiFeatures: { ...currentItem.aiFeatures, relit: false, isRelighting: false }
            });
          }
        } else { // relit is being disabled
          updateStoryboardItem(selectedStoryboardItemId, {
            aiFeatures: { ...currentItem.aiFeatures, relit: false, isRelighting: false }
          });
        }
      } else if (feature === 'enhancedQuality') {
        if (value === true) {
          updateStoryboardItem(selectedStoryboardItemId, {
            aiFeatures: { ...currentItem.aiFeatures, enhancedQuality: true, isEnhancingQuality: true }
          });
          if (mediaAsset.enhancedQualitySrc) { // Use existing if available
            updateStoryboardItem(selectedStoryboardItemId, {
              aiFeatures: { ...currentItem.aiFeatures, enhancedQuality: true, isEnhancingQuality: false }
            });
            return;
          }
          try {
            // Enhance quality should always use the original source image
            const processedImageSrc = await GeminiService.enhanceImageQuality(mediaAsset.src);
            setMediaAssets(prevAssets =>
              prevAssets.map(asset =>
                asset.id === assetId ? { ...asset, enhancedQualitySrc: processedImageSrc } : asset
              )
            );
            updateStoryboardItem(selectedStoryboardItemId, {
              aiFeatures: { ...currentItem.aiFeatures, enhancedQuality: true, isEnhancingQuality: false }
            });
            // Note: If other features like relit or backgroundRemoved were active,
            // their results might now be visually inconsistent as they were based on the non-enhanced source.
            // A more advanced implementation might clear other AI-generated srcs or re-trigger their processing.
            // For this subtask, we are keeping it simple: enhance works on original src.
          } catch (error) {
            console.error("Enhance quality failed:", error);
            handleShowError(error instanceof Error ? error.message : "Failed to enhance image quality.");
            updateStoryboardItem(selectedStoryboardItemId, { // Revert
              aiFeatures: { ...currentItem.aiFeatures, enhancedQuality: false, isEnhancingQuality: false }
            });
          }
        } else { // enhancedQuality is being disabled
          updateStoryboardItem(selectedStoryboardItemId, {
            aiFeatures: { ...currentItem.aiFeatures, enhancedQuality: false, isEnhancingQuality: false }
          });
          // Note: Similar to above, if other effects were based on the enhanced version,
          // they ideally should be cleared or re-processed.
        }
      }
    }
  }, [selectedStoryboardItemId, storyboard, mediaAssets, updateStoryboardItem, handleShowError]);

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

  const handleGenerateTTS = useCallback(async () => {
    if (!selectedStoryboardItemId) return;
    const currentItem = storyboard.find(item => item.id === selectedStoryboardItemId);
    if (!currentItem) return;

    let textToSpeak = currentItem.textOverlays.map(t => t.text).join(' ');
    if (!textToSpeak.trim() && currentItem.aiFeatures.autoCaptionsText) {
      textToSpeak = currentItem.aiFeatures.autoCaptionsText;
    }

    if (!textToSpeak.trim()) {
      handleShowError("No text available in the selected scene for Text-to-Speech.");
      return;
    }

    updateStoryboardItem(selectedStoryboardItemId, {
      aiFeatures: { ...currentItem.aiFeatures, isGeneratingTTS: true, textToSpeechText: textToSpeak } // Store source text
    });
    setIsLoading(true); // Use global loading for now
    setLoadingMessage("Generating audio...");
    setErrorMessage(null);

    try {
      const audioDataUrl = await GeminiService.generateSpeechAudio(textToSpeak);
      updateStoryboardItem(selectedStoryboardItemId, {
        audioSrc: audioDataUrl,
        aiFeatures: { ...currentItem.aiFeatures, isGeneratingTTS: false, textToSpeechText: textToSpeak } // Persist source text
      });
    } catch (error) {
      console.error("TTS generation failed:", error);
      handleShowError(error instanceof Error ? error.message : "Failed to generate audio.");
      updateStoryboardItem(selectedStoryboardItemId, { // Revert on failure
        aiFeatures: { ...currentItem.aiFeatures, isGeneratingTTS: false }
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }, [selectedStoryboardItemId, storyboard, updateStoryboardItem, handleShowError]);

  const handleExportVideo = async () => {
    if (storyboard.length === 0) {
      handleShowError("Storyboard is empty. Add some scenes to export.");
      return;
    }
    setIsLoading(true);
    setLoadingMessage("Initializing video export...");
    setErrorMessage(null);

    const ffmpeg = new FFmpeg();

    ffmpeg.on('log', ({ message }) => {
      // console.log(message); // Optional: for more detailed logs
      // Try to extract progress percentage if available
      const progressMatch = message.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);
      if (progressMatch && progressMatch[1]) {
        // This is a simple way to show activity, not a true percentage
        setLoadingMessage(`Exporting video... Processing time: ${progressMatch[1]}`);
      }
    });

    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });

      setLoadingMessage("Preparing video assets...");
      const inputFiles: string[] = [];
      const filterComplexParts: string[] = [];
      const concatInputs: string[] = [];
      let hasAudioOverall = false;

      for (let i = 0; i < storyboard.length; i++) {
        const item = storyboard[i];
        const asset = mediaAssets.find(a => a.id === item.assetId);
        if (!asset) continue;

        let imageSrc = asset.src;
        if (item.aiFeatures.relit && asset.relitSrc) {
          imageSrc = asset.relitSrc;
        } else if (item.aiFeatures.backgroundRemoved && asset.backgroundRemovedSrc) {
          imageSrc = asset.backgroundRemovedSrc;
        }

        const imageFileName = `img${i}.png`; // Assuming PNG for simplicity, could be dynamic
        await ffmpeg.writeFile(imageFileName, await fetchFile(imageSrc));
        inputFiles.push('-i', imageFileName);

        // Video part for filter_complex
        // Ensures each image is displayed for its specific duration.
        // Scale to a common resolution e.g. 1280x720, use sar for aspect ratio.
        // Force fps to ensure smooth concat.
        filterComplexParts.push(`[${i}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=25,trim=duration=${item.duration}[v${i}];`);

        if (item.audioSrc) {
          const audioFileName = `audio${i}.wav`; // Assuming WAV from TTS
          await ffmpeg.writeFile(audioFileName, await fetchFile(item.audioSrc));
          inputFiles.push('-i', audioFileName);
          // If audio is shorter than video, loop it. If longer, it will be cut by concat.
          // This part is tricky. A simpler approach might be to just map it and let concat handle duration.
          // For now, let's assume concat handles it or audio is shorter/equal to video duration.
          concatInputs.push(`[v${i}][${storyboard.length + inputFiles.filter(f => f.startsWith('audio')).length -1 }:a]`);
          hasAudioOverall = true;
        } else {
          // If no audio for this segment, use anullsrc for concat
          concatInputs.push(`[v${i}][anull${i}]`);
          filterComplexParts.push(`anullsrc=channel_layout=stereo:sample_rate=44100[anull${i}];`);
        }
      }

      if (storyboard.length === 0) {
        handleShowError("No valid items in storyboard to export.");
        setIsLoading(false);
        return;
      }

      const filterComplexCommand = filterComplexParts.join('') + concatInputs.join('') + `concat=n=${storyboard.length}:v=1:a=1[outv][outa]`;

      const commandArgs = [
        ...inputFiles,
        '-filter_complex', filterComplexCommand,
        '-map', '[outv]',
      ];

      if (hasAudioOverall) {
        commandArgs.push('-map', '[outa]', '-c:a', 'aac', '-b:a', '192k');
      } else {
        // If no audio at all, FFmpeg might complain if -map "[outa]" is used without a source for it.
        // However, our anullsrc should provide silent audio tracks.
         commandArgs.push('-map', '[outa]', '-c:a', 'aac', '-b:a', '192k'); // Still map outa, anullsrc provides silent stream
      }

      commandArgs.push(
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-pix_fmt', 'yuv420p',
        'output.mp4'
      );

      setLoadingMessage("Transcoding video... This may take a while.");
      console.log("FFmpeg command:", commandArgs.join(' ')); // For debugging
      await ffmpeg.exec(...commandArgs);

      setLoadingMessage("Finalizing video...");
      const data = await ffmpeg.readFile('output.mp4');

      const blob = new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai_video_export.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLoadingMessage("Video export complete!");

      // Cleanup
      for(let i = 0; i< storyboard.length; i++) {
        try {
          await ffmpeg.deleteFile(`img${i}.png`);
          if(storyboard[i].audioSrc) await ffmpeg.deleteFile(`audio${i}.wav`);
        } catch (e) { console.warn("Error deleting temp file", e); }
      }
      await ffmpeg.deleteFile('output.mp4');


    } catch (error) {
      console.error("Export failed:", error);
      handleShowError(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      if (ffmpeg.loaded) {
         // ffmpeg.terminate(); // Consider if you want to terminate or keep loaded for next export
      }
      setIsLoading(false);
      setLoadingMessage(null);
    }
  };

  const handleMoveStoryboardItem = (startIndex: number, endIndex: number) => {
    setStoryboard(prevStoryboard => {
      const newStoryboard = Array.from(prevStoryboard);
      const [movedItem] = newStoryboard.splice(startIndex, 1);
      newStoryboard.splice(endIndex, 0, movedItem);
      return newStoryboard;
    });
  };

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
        onGenerateTTS={handleGenerateTTS}
        onExportVideo={handleExportVideo}
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
              onMoveItem={handleMoveStoryboardItem}
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

export const handleShowError = (message: string, setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  setErrorMessage(message);
  setTimeout(() => setErrorMessage(null), 7000);
};

export const updateCurrentTopic = (storyboard: StoryboardItem[], mediaAssets: MediaAsset[], setCurrentTopic: React.Dispatch<React.SetStateAction<string | null>>) => {
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
    setCurrentTopic(sortedKeywords.slice(0, 2).join(', '));
  } else {
    setCurrentTopic("User Uploaded Theme");
  }
};

export default App;
