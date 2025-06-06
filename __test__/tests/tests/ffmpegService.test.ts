import { processVideo } from '../../../services/ffmpegService';
import { StoryboardItem, MediaAsset } from '../../../types';

describe('ffmpegService', () => {
  it('should process video correctly', async () => {
    const mockFFmpeg = {
      run: jest.fn(),
      loaded: true,
      on: jest.fn(),
      off: jest.fn(),
      load: jest.fn(),
      exec: jest.fn(),
      ffprobe: jest.fn(),
      terminate: jest.fn(),
      writeFile: jest.fn(),
      mount: jest.fn(),
      unmount: jest.fn(),
      readFile: jest.fn(),
      deleteFile: jest.fn(),
      rename: jest.fn(),
      createDir: jest.fn(),
      listDir: jest.fn(),
      deleteDir: jest.fn(),
      // Mock private property
      '#private': {},
    };

    const mockStoryboard: StoryboardItem[] = [
      {
        id: '1',
        assetId: 'a1',
        duration: 5,
        textOverlays: [],
        filter: null,
        aiFeatures: {
          backgroundRemoved: false,
          enhancedQuality: false,
          relit: false,
          flickerRemoved: false,
        },
      },
    ];

    const mockMediaAssets: MediaAsset[] = [
      { id: 'a1', type: 'image', src: 'image1.png', prompt: 'Test image', origin: 'uploaded' },
    ];

    const result = await processVideo(mockFFmpeg as any, mockStoryboard, mockMediaAssets);

    expect(result).toBe(true); // Adjust based on actual implementation
  });

  it('should throw an error for invalid input', async () => {
    const mockFFmpeg = {
      run: jest.fn(),
      loaded: true,
      on: jest.fn(),
      off: jest.fn(),
      load: jest.fn(),
      exec: jest.fn(),
      ffprobe: jest.fn(),
      terminate: jest.fn(),
      writeFile: jest.fn(),
      mount: jest.fn(),
      unmount: jest.fn(),
      readFile: jest.fn(),
      deleteFile: jest.fn(),
      rename: jest.fn(),
      createDir: jest.fn(),
      listDir: jest.fn(),
      deleteDir: jest.fn(),
      // Mock private property
      '#private': {},
    };

    const mockStoryboard: StoryboardItem[] = [];
    const mockMediaAssets: MediaAsset[] = [];

    await expect(processVideo(mockFFmpeg as any, mockStoryboard, mockMediaAssets)).rejects.toThrow('Invalid input');
  });
});
