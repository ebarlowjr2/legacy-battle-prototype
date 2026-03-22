import {useCallback, useEffect, useState} from 'react';
import { useTimeoutManager } from './useTimeoutManager';

/**
 *  The debounced function delays when invoking a callback function "cb" until after the delay
 * has elapsed since the last time the debounced function was invoked.
 *  @param {Function} cb - The callback function to be debounced.
 *  @param options for debounce configuration - delay in millisec
 *  @param {boolean} options.runImmediately {default=false} - If true, the function will be invoked immediately on the first call.
 * @param {number} options.delay - The delay in milliseconds
 *  @returns A debounced version of the function 'cb' with a cancel method
 *
 */

interface Options {
  delay?: number;
  runImmediately?: boolean;
}
type DebouncedFunction = {
  (this: unknown, ...args: unknown[]): void;
  cancel?: () => void;
};

export const useDebounceFunction = (
  cb: (...args: unknown[]) => void,
  options: Options,
): DebouncedFunction => {
  const {delay = 3000, runImmediately = false} = options;

  const {timeoutRef, setTimeout, clearTimeout} = useTimeoutManager();

  const debouncedFunction: DebouncedFunction = useCallback(
    (...args: unknown[]) => {
      clearTimeout();

      if (runImmediately && !timeoutRef.current) {
        cb(...args);
      }

      setTimeout(() => {
        cb(...args);
      }, delay);
    },
    [cb, delay, runImmediately, clearTimeout, setTimeout, timeoutRef],
  );

  debouncedFunction.cancel = () => {
    clearTimeout();
  };

  return debouncedFunction;
};

/**
 * useDebounce hook that returns a debounced value.
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounceFunction;
