import { MediaAsset, StoryboardItem, TextOverlay, ActiveTool } from '../shared/types';
import { DEFAULT_PLACEHOLDER_IMAGE, FilmIcon } from '../shared/constants';

export const handleShowError = (
  message: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setErrorMessage(message);
  setTimeout(() => setErrorMessage(null), 7000);
};

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

export const updateCurrentTopic = (
  storyboard: StoryboardItem[],
  mediaAssets: MediaAsset[],
  setCurrentTopic: React.Dispatch<React.SetStateAction<string | null>>
) => {
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

  setCurrentTopic(allKeywords.join(", "));
};
