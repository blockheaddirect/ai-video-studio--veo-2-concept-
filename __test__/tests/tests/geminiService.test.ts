import { analyzeMedia } from '../../../services/geminiService';

describe('geminiService', () => {
  it('should analyze media correctly', async () => {
    const mockMedia = { id: '123', type: 'image', url: 'http://example.com/image.jpg' };

    const result = await analyzeMedia(mockMedia);

    expect(result).toEqual({ insights: 'Sample insights' }); // Adjust based on actual implementation
  });

  it('should throw an error for unsupported media type', async () => {
    const mockMedia = { id: '123', type: 'unsupported', url: 'http://example.com/unsupported.jpg' };

    await expect(analyzeMedia(mockMedia)).rejects.toThrow('Unsupported media type');
  });
});
