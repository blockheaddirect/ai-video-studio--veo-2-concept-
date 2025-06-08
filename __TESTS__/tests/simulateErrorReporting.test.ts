import { simulateErrorReporting } from '../../utils/errorHandler';

describe('simulateErrorReporting', () => {
  it('should simulate error reporting and return success message', async () => {
    const error = new Error('Test error');
    const result = await simulateErrorReporting(error);

    expect(result).toBe('Error reported successfully');
  });

  it('should log the error details', async () => {
    const error = new Error('Test error');
    const consoleSpy = jest.spyOn(console, 'log');

    await simulateErrorReporting(error);

    expect(consoleSpy).toHaveBeenCalledWith('Simulating error reporting:', error);
    consoleSpy.mockRestore();
  });
});
