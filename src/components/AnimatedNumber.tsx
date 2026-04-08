'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

interface Props {
  value: number;
  duration?: number;
  decimalPlaces?: number;
  suffix?: string;
}

export default function AnimatedNumber({ value, duration = 2, decimalPlaces = 0, suffix = "" }: Props) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // 0에서 목표값까지 애니메이션
    const controls = animate(0, value, {
      duration: duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(latest);
      }
    });

    return () => controls.stop();
  }, [value, duration]);

  return (
    <span className="font-outfit">
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })}
      {suffix}
    </span>
  );
}
