import React from 'react';
import { handleShowError } from '../../../App';

describe('handleShowError', () => {
  let setErrorMessage: jest.Mock;

  beforeEach(() => {
    setErrorMessage = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should display an error message and clear it after timeout', () => {
    handleShowError.call({ setErrorMessage }, 'Test error message');

    expect(setErrorMessage).toHaveBeenCalledWith('Test error message');

    jest.advanceTimersByTime(7000);
    expect(setErrorMessage).toHaveBeenCalledWith(null);
  });

  it('should not call setErrorMessage if no message is provided', () => {
    handleShowError.call({ setErrorMessage }, '');

    expect(setErrorMessage).not.toHaveBeenCalled();
  });

  it('should handle multiple error messages in quick succession', () => {
    handleShowError.call({ setErrorMessage }, 'First error');
    handleShowError.call({ setErrorMessage }, 'Second error');

    expect(setErrorMessage).toHaveBeenCalledWith('First error');
    expect(setErrorMessage).toHaveBeenCalledWith('Second error');

    jest.advanceTimersByTime(7000);
    expect(setErrorMessage).toHaveBeenCalledWith(null);
  });
});
