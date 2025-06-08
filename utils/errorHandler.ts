// Utility for centralized error handling

export const handleShowError = (setErrorMessage: (message: string | null) => void, message: string): void => {
  setErrorMessage(message);
  setTimeout(() => setErrorMessage(null), 7000);
};

export const logError = (error: Error): void => {
  console.error('Error logged:', error);
};

export const categorizeError = (error: Error): string => {
  if (error.message.includes('Network')) {
    return 'Network Error';
  } else if (error.message.includes('Validation')) {
    return 'Validation Error';
  }
  return 'General Error';
};

export const handleGlobalError = (error: Error): void => {
  logError(error);
  alert('An unexpected error occurred. Please try again later.');
};

export const retryOperation = async (operation: () => Promise<any>, retries = 3): Promise<any> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      if (attempt === retries) {
        throw error;
      }
    }
  }
};

export const reportError = async (error: Error): Promise<void> => {
  // Simulate reporting error to an external monitoring service
  console.log('Reporting error:', error);
};

export const simulateErrorReporting = async (error: Error): Promise<string> => {
  // Simulate sending error details to an external service
  console.log('Simulating error reporting:', error);
  return 'Error reported successfully';
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
