"use client";

import type { PointerEvent, ReactNode } from "react";
import { useRef, useState } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const INTERACTIVE_SELECTOR =
  "button, a, input, textarea, select, option, [role='button'], [data-no-drag-scroll='true']";

export default function HorizontalDragScroll({
  children,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const [dragging, setDragging] = useState(false);

  const isInteractiveTarget = (target: EventTarget | null) => {
    return (
      target instanceof HTMLElement &&
      Boolean(target.closest(INTERACTIVE_SELECTOR))
    );
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (isInteractiveTarget(event.target)) return;

    const container = containerRef.current;
    if (!container) return;

    isPointerDown.current = true;
    setDragging(true);
    startX.current = event.clientX;
    startScrollLeft.current = container.scrollLeft;

    container.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;

    const container = containerRef.current;
    if (!container) return;

    const distance = event.clientX - startX.current;

    if (Math.abs(distance) > 2) {
      event.preventDefault();
    }

    container.scrollLeft = startScrollLeft.current - distance;
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    isPointerDown.current = false;
    setDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={containerRef}
      className={[
        "overflow-x-auto overscroll-x-contain pb-2",
        dragging ? "cursor-grabbing select-none" : "cursor-grab",
        className,
      ].join(" ")}
      style={{
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-y",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onDragStart={(event) => event.preventDefault()}
    >
      {children}
    </div>
  );
}