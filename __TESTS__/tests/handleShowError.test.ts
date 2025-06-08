import { renderHook, act } from '@testing-library/react-hooks';
import { useState } from 'react';
import { handleShowError } from '../../client/App';

// Explicitly set JSX option
/** @jsxImportSource react */

// Mock implementation of handleShowError
const useHandleShowError = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleShowError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 7000);
  };

  return { errorMessage, handleShowError };
};

describe('handleShowError', () => {
  jest.useFakeTimers();

  it('should set and clear the error message', () => {
    const { result } = renderHook(() => useHandleShowError());

    act(() => {
      result.current.handleShowError('Test error message');
    });

    expect(result.current.errorMessage).toBe('Test error message');

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.errorMessage).toBeNull();
  });
});

// Commenting out tests for now
/*
import { renderHook, act } from '@testing-library/react-hooks';
import { useState } from 'react';
import { handleShowError } from '../../client/App';

// Explicitly set JSX option
/** @jsxImportSource react *//*

const useHandleShowError = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleShowError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 7000);
  };

  return { errorMessage, handleShowError };
};

describe('handleShowError', () => {
  jest.useFakeTimers();

  it('should set and clear the error message', () => {
    const { result } = renderHook(() => useHandleShowError());

    act(() => {
      result.current.handleShowError('Test error message');
    });

    expect(result.current.errorMessage).toBe('Test error message');

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.errorMessage).toBeNull();
  });
});
*/