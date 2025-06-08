import { updateCurrentTopic } from '../../client/App';

// Explicitly set JSX option
/** @jsxImportSource react */

describe('updateCurrentTopic', () => {
  it('should update the current topic correctly', () => {
    const mockStoryboard = [
      {
        id: '1',
        assetId: '1',
        duration: 10,
        textOverlays: [],
        filter: undefined, // Updated to match StoryboardItem type
        aiFeatures: {
          backgroundRemoved: false,
          enhancedQuality: false,
          relit: false,
          flickerRemoved: false,
        },
      },
      {
        id: '2',
        assetId: '2',
        duration: 15,
        textOverlays: [],
        filter: undefined, // Updated to match StoryboardItem type
        aiFeatures: {
          backgroundRemoved: false,
          enhancedQuality: false,
          relit: false,
          flickerRemoved: false,
        },
      },
    ];

    const mockMediaAssets = [
      {
        id: '1',
        type: 'image',
        src: 'image1.jpg',
        prompt: 'A beautiful sunset',
        origin: 'uploaded',
        keywords: ['sunset', 'beautiful'],
      },
      {
        id: '2',
        type: 'image',
        src: 'image2.jpg',
        prompt: 'A snowy mountain',
        origin: 'generated',
        keywords: ['snow', 'mountain'],
      },
    ];

    const mockSetCurrentTopic = jest.fn();

    updateCurrentTopic(mockStoryboard, mockMediaAssets, mockSetCurrentTopic);

    expect(mockSetCurrentTopic).toHaveBeenCalledWith('sunset, beautiful, snow, mountain');
  });

  it('should not update if the topic is unchanged', () => {
    const mockStoryboard = [
      {
        id: '1',
        assetId: '1',
        duration: 10,
        textOverlays: [],
        filter: undefined, // Updated to match StoryboardItem type
        aiFeatures: {
          backgroundRemoved: false,
          enhancedQuality: false,
          relit: false,
          flickerRemoved: false,
        },
      },
    ];

    const mockMediaAssets = [
      {
        id: '1',
        type: 'image',
        src: 'data:image/png;base64,...',
        prompt: 'Uploaded image',
        origin: 'uploaded',
        keywords: [],
      },
    ];

    const mockSetCurrentTopic = jest.fn();

    updateCurrentTopic(mockStoryboard, mockMediaAssets, mockSetCurrentTopic);

    expect(mockSetCurrentTopic).toHaveBeenCalledWith('Uploaded image');
  });
});