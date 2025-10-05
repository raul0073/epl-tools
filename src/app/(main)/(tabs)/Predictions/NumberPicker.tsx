'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NumberPickerProps {
  value: number | null;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export const NumberPicker = ({ value, onChange, min = 0, max = 10 }: NumberPickerProps) => {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 10;
  const clamp = (v: number) => Math.max(safeMin, Math.min(safeMax, v));

  const [localValue, setLocalValue] = useState<number>(clamp(value ?? safeMin));

  // Sync from prop safely
  useEffect(() => {
    if (value != null && !isNaN(value)) {
      setLocalValue(clamp(value));
    }
  }, [value, safeMin, safeMax]);

  // Increment and decrement safely
  const increment = useCallback(() => {
    setLocalValue((prev) => {
      const next = clamp(prev + 1);
      onChange(next);
      return next;
    });
  }, [onChange, safeMin, safeMax]);

  const decrement = useCallback(() => {
    setLocalValue((prev) => {
      const next = clamp(prev - 1);
      onChange(next);
      return next;
    });
  }, [onChange, safeMin, safeMax]);

  // Wheel handler with safe preventDefault
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) increment();
    else decrement();
  }, [increment, decrement]);

  // Motion animation
  const getAnimation = useCallback(() => ({
    initial: { y: -4, opacity: 0.5 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 4, opacity: 0.5 },
    transition: { duration: 0.15, ease: 'easeOut' as const },
  }), []);

  return (
    <div
      className="flex items-center select-none w-fit justify-center"
      onWheel={handleWheel}
      role="spinbutton"
      aria-valuemin={safeMin}
      aria-valuemax={safeMax}
      aria-valuenow={localValue}
    >
      <Button size="icon" type="button" variant="ghost" className="rounded-full p-0" onClick={increment} aria-label="Increment">
        <ArrowUpCircleIcon className={cn('text-lime-600')} />
      </Button>

      <motion.div {...getAnimation()} key={localValue} className="min-w-[2rem] py-1 flex justify-center font-semibold text-lg text-center">
        {localValue}
      </motion.div>

      <Button size="icon" type="button" variant="ghost" className="rounded-full p-0" onClick={decrement} aria-label="Decrement">
        <ArrowDownCircleIcon className={cn('text-pink-700')} />
      </Button>
    </div>
  );
};
