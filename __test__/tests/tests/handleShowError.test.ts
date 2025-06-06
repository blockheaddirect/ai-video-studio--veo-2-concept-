import { handleShowError } from '../../../App';
describe('handleShowError', () => {
  it('should display an error message and clear it after timeout', () => {
    jest.useFakeTimers();

    const setErrorMessage = jest.fn();
    handleShowError(setErrorMessage, 'Test error message');

    expect(setErrorMessage).toHaveBeenCalledWith('Test error message');

    jest.advanceTimersByTime(7000);
    expect(setErrorMessage).toHaveBeenCalledWith(null);

    jest.useRealTimers();
  });

  it('should not call setErrorMessage if no message is provided', () => {
    jest.useFakeTimers();

    const setErrorMessage = jest.fn();
    // @ts-expect-error: Testing with missing message argument
    handleShowError(setErrorMessage);

    expect(setErrorMessage).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('should handle multiple error messages in quick succession', () => {
    jest.useFakeTimers();

    const setErrorMessage = jest.fn();
    handleShowError(setErrorMessage, 'First error');
    handleShowError(setErrorMessage, 'Second error');

    expect(setErrorMessage).toHaveBeenCalledWith('First error');
    expect(setErrorMessage).toHaveBeenCalledWith('Second error');

    jest.advanceTimersByTime(7000);
    expect(setErrorMessage).toHaveBeenCalledWith(null);

    jest.useRealTimers();
  });
});

    jest.useRealTimers();
  });
});
