"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GooeyFilter from "@/components/gooey-filter";

type Metrics = { docH: number; viewH: number; scrollTop: number };

interface DynamicScrollbarProps {
  minThumbPx?: number;
  rightOffsetPx?: number;
  trackWidthPx?: number;
  className?: string;
  children?: React.ReactNode;
}

export function DynamicScrollbar({
  minThumbPx = 36,
  rightOffsetPx = 6,
  trackWidthPx = 8,
  className,
  children,
}: DynamicScrollbarProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  // ⭐ SAFE INITIAL VALUES FOR SSR
  const [metrics, setMetrics] = useState<Metrics>({
    docH: 1,
    viewH: 1,
    scrollTop: 0,
  });

  // ⭐ Update metrics ONLY on client
  useEffect(() => {
    const update = () => {
      setMetrics({
        docH: document.documentElement.scrollHeight,
        viewH: window.innerHeight,
        scrollTop: window.scrollY,
      });
    };

    update();

    let raf = 0;
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          update();
          raf = 0;
        });
    };

    const onResize = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          update();
          raf = 0;
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const [hoveredThumb, setHoveredThumb] = useState(false);
  const [clickThumb, setClickThumb] = useState(false);
  const [hoveredPopup, setHoveredPopup] = useState(false);
  const [dragging, setDragging] = useState(false);

  const showPopup = clickThumb || hoveredPopup || dragging;

  // ⭐ Outside click to close popup
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        thumbRef.current &&
        !thumbRef.current.contains(e.target as Node)
      ) {
        setClickThumb(false);
        setHoveredThumb(false);
        setHoveredPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⭐ Scrollbar calc
  const { show, trackH, thumbH, thumbTop } = useMemo(() => {
    const docH = metrics.docH;
    const viewH = metrics.viewH;
    const scrollTop = metrics.scrollTop;

    const canScroll = docH > viewH + 1;
    if (!canScroll) return { show: false, trackH: 0, thumbH: 0, thumbTop: 0 };

    const trackH = viewH;
    const rawThumb = (viewH / docH) * trackH;

    const thumbH = Math.max(minThumbPx, rawThumb);
    const maxThumbTop = trackH - thumbH;
    const maxScrollTop = docH - viewH;

    const ratio = Math.min(scrollTop / maxScrollTop, 1);
    const thumbTop = ratio * maxThumbTop;

    return { show: true, trackH, thumbH, thumbTop };
  }, [metrics, minThumbPx]);

  if (!show) return null;

  // ⭐ Drag logic
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(true);

    dragStartY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragStartScrollTop.current = window.scrollY;

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", stopDrag);
  };

  const onDrag = (e: MouseEvent | TouchEvent) => {
    if (!dragging) return;

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const delta = clientY - dragStartY.current;

    const maxScrollTop = metrics.docH - metrics.viewH;
    const maxThumbTop = trackH - thumbH;
    const scrollDelta = (delta / maxThumbTop) * maxScrollTop;

    window.scrollTo({
      top: dragStartScrollTop.current + scrollDelta,
      behavior: "auto",
    });
  };

  const stopDrag = () => {
    setDragging(false);
    setHoveredThumb(false);
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("touchend", stopDrag);
  };

  // ⭐ Popup position
  const getPopupPosition = () => {
    const popupHeight = popupRef.current?.offsetHeight ?? 150;
    let top = Math.round(thumbTop);

    if (top + popupHeight > trackH) top = trackH - popupHeight;
    if (top < 0) top = 0;

    return { top };
  };

  return (
    <div
      className={`fixed inset-y-0 flex items-start justify-end pointer-events-none z-[999] ${className}`}
      style={{ right: rightOffsetPx }}
    >
      <GooeyFilter />

      <motion.div
        ref={trackRef}
        className="relative h-screen pointer-events-auto"
        style={{
          width: trackWidthPx * 6,
          filter: "url(#gooey)",
        }}
      >
        {/* ⭐ THUMB */}
        <motion.div
          ref={thumbRef}
          className="absolute right-0 z-50 flex items-center justify-center cursor-pointer rounded-full shadow-lg 
                     bg-black dark:bg-white text-white dark:text-black"
          style={{
            top: thumbTop,
            height: thumbH,
            width: trackWidthPx * 2,
          }}
          onMouseEnter={() => !clickThumb && setHoveredThumb(true)}
          onMouseLeave={() => setHoveredThumb(false)}
          onMouseDown={(e) => {
            setClickThumb(true);
            startDrag(e);
          }}
          onTouchStart={(e) => {
            setClickThumb(true);
            startDrag(e);
          }}
          animate={{
            width: hoveredThumb || clickThumb ? trackWidthPx * 3 : trackWidthPx * 2,
            scale: hoveredThumb || clickThumb ? 1.05 : 1,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        />

        {/* ⭐ DYNAMIC ISLAND POPUP */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              ref={popupRef}
              initial={{ opacity: 0, scale: 0.5, x: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, x: 10, filter: "blur(6px)" }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              className="absolute pointer-events-auto 
                         rounded-3xl shadow-2xl p-4 
                         bg-black text-white 
                         dark:bg-white dark:text-black"
              style={{
                ...getPopupPosition(),
                right: trackWidthPx + 6,
                transformOrigin: "top right",
              }}
              onMouseEnter={() => setHoveredPopup(true)}
              onMouseLeave={() => {
                setHoveredPopup(false);
                setClickThumb(false);
                setHoveredThumb(false);
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default DynamicScrollbar;
