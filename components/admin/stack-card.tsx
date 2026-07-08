"use client";

import { ReactNode } from "react";

interface StackCardProps {
  index: number;
  children: ReactNode;
}

export function StackCard({ index, children }: StackCardProps) {
  // Calculate sticky position - each card slightly lower than previous
  const topPosition = 20 + (index * 4); // 20px, 24px, 28px, 32px...
  const zIndex = 10 + index;

  return (
    <div
      className="sticky bg-white rounded-t-3xl shadow-2xl -mx-6 px-6 pt-6 pb-6"
      style={{
        top: `${topPosition}px`,
        zIndex: zIndex,
      }}
    >
      {children}
    </div>
  );
}
