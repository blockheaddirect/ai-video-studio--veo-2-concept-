import { updateCurrentTopic } from '../../../App';

describe('updateCurrentTopic', () => {
  it('should update the topic based on storyboard and media assets', () => {
    const storyboard = [
      { id: '1', assetId: 'a1', duration: 5, textOverlays: [], filter: null, aiFeatures: {} },
    ];
    const mediaAssets = [
      { id: 'a1', type: 'image', src: 'test.jpg', keywords: ['landscape'], origin: 'uploaded' },
    ];

    const setCurrentTopic = jest.fn();

    updateCurrentTopic(storyboard, mediaAssets, setCurrentTopic);

    expect(setCurrentTopic).toHaveBeenCalledWith('landscape');
  });
});
