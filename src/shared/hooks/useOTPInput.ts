import { useState, useRef, useEffect, useCallback } from 'react';
import { Keyboard, TextInput } from 'react-native';
import {
  extractOTPDigits,
  isOTPComplete,
  getOTPFromClipboard,
} from '@/shared/utils/helpers';
import type { UseOTPInputOptions, UseOTPInputReturn } from '@/shared/types';

export function useOTPInput({
  length,
  onComplete,
  onChange,
  autoFocus = true,
  disabled = false,
}: UseOTPInputOptions): UseOTPInputReturn {
  const [otp, setOTP] = useState<string[]>(() => Array(length).fill(''));
  const inputRefs = useRef<Array<TextInput | null>>(Array(length).fill(null));
  const clipboardConsumed = useRef(false);

  useEffect(() => {
    if (!autoFocus) return;
    const id = setTimeout(() => inputRefs.current[0]?.focus(), 150);
    return () => clearTimeout(id);
  }, [autoFocus]);

  const applyDigits = useCallback(
    (digits: string[], startIndex: number) => {
      setOTP((prev) => {
        const next = [...prev];
        digits.forEach((d, i) => {
          const slot = startIndex + i;
          if (slot < length) next[slot] = d;
        });

        onChange?.(next.join(''));

        if (isOTPComplete(next)) {
          onComplete(next.join(''));
          Keyboard.dismiss();
        } else {
          const nextEmpty = next.findIndex((s) => s === '');
          if (nextEmpty !== -1) {
            requestAnimationFrame(() => inputRefs.current[nextEmpty]?.focus());
          }
        }

        return next;
      });
    },
    [length, onChange, onComplete],
  );

  useEffect(() => {
    const tryAutoFill = async () => {
      const digits = await getOTPFromClipboard(length);
      if (digits.length === length) {
        clipboardConsumed.current = true;
        applyDigits(digits, 0);
      }
    };

    tryAutoFill();
  }, [length, applyDigits]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      if (disabled) return;

      if (text.length > 1) {
        const digits = extractOTPDigits(text, length - index);
        if (digits.length > 0) applyDigits(digits, index);
        return;
      }

      if (text !== '' && !/^\d$/.test(text)) return;

      setOTP((prev) => {
        const next = [...prev];
        next[index] = text;

        onChange?.(next.join(''));

        if (text !== '' && isOTPComplete(next)) {
          onComplete(next.join(''));
          Keyboard.dismiss();
        } else if (text !== '' && index < length - 1) {
          requestAnimationFrame(() => inputRefs.current[index + 1]?.focus());
        }

        return next;
      });
    },
    [disabled, length, applyDigits, onChange, onComplete],
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (disabled || key !== 'Backspace') return;

      setOTP((prev) => {
        const next = [...prev];

        if (prev[index] !== '') {
          next[index] = '';
        } else if (index > 0) {
          next[index - 1] = '';
          requestAnimationFrame(() => inputRefs.current[index - 1]?.focus());
        }

        onChange?.(next.join(''));
        return next;
      });
    },
    [disabled, onChange],
  );

  const handleFocus = useCallback(
    async (index: number) => {
      if (disabled || index !== 0 || clipboardConsumed.current) return;

      const digits = await getOTPFromClipboard(length);
      if (digits.length === length) {
        clipboardConsumed.current = true;
        applyDigits(digits, 0);
      }
    },
    [disabled, length, applyDigits],
  );

  return { otp, inputRefs, handleChange, handleKeyPress, handleFocus };
}
