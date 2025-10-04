import { useEffect, useState } from 'react';
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
  const [localValue, setLocalValue] = useState<number>(value ?? 0);

  // Sync from prop
  useEffect(() => {
    if (value !== null && value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const increment = () => {
    setLocalValue((prev) => {
      const next = Math.min(max, prev + 1);
      onChange(next);
      return next;
    });
  };

  const decrement = () => {
    setLocalValue((prev) => {
      const next = Math.max(min, prev - 1);
      onChange(next);
      return next;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) increment();
    else decrement();
  };

  const getAnimation = () => {
    return {
      initial: { y: 0, opacity: 1 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.15, ease: 'easeOut' as const },
    };
  };

  return (
    <div className="flex items-center select-none w-fit justify-center" onWheel={handleWheel}>
      <Button size="icon" type="button" variant="ghost" className="rounded-full p-0" onClick={increment}>
        <ArrowUpCircleIcon className={cn('text-lime-600')} />
      </Button>

      <motion.div {...getAnimation()} key={localValue} className="min-w-[2rem] py-1 flex justify-center font-semibold text-lg text-center">
        {localValue}
      </motion.div>

      <Button size="icon" type="button" variant="ghost" className="rounded-full p-0" onClick={decrement}>
        <ArrowDownCircleIcon className={cn('text-pink-700')} />
      </Button>
    </div>
  );
};
