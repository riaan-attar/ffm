import React, { useRef, useState, useCallback } from 'react';

/**
 * A horizontally scrollable row that can be dragged with mouse/touch, with
 * scroll-snap for a clean settle point per item. Used for "all of them
 * together" listing pages instead of another vertical card grid.
 */
export function DragScroll({ children, className = '' }) {
  const trackRef = useRef(null);
  const dragState = useRef({ down: false, startX: 0, scrollLeft: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback((e) => {
    const track = trackRef.current;
    if (!track) return;
    // Images and links are natively draggable, which otherwise hijacks the
    // gesture into a native HTML5 drag-and-drop instead of a scroll.
    e.preventDefault();
    dragState.current = {
      down: true,
      startX: e.clientX,
      scrollLeft: track.scrollLeft,
      moved: false
    };
    setIsDragging(true);
  }, []);

  const onPointerMove = useCallback((e) => {
    const track = trackRef.current;
    const state = dragState.current;
    if (!state.down || !track) return;
    const dx = e.clientX - state.startX;
    if (Math.abs(dx) > 4) state.moved = true;
    track.scrollLeft = state.scrollLeft - dx;
  }, []);

  const endDrag = useCallback(() => {
    dragState.current.down = false;
    setIsDragging(false);
  }, []);

  // Swallow the click that follows a real drag so dragging a card doesn't
  // also trigger its link navigation.
  const onClickCapture = useCallback((e) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return (
    <div
      ref={trackRef}
      className={`drag-scroll ${isDragging ? 'is-dragging' : ''} ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onClickCapture={onClickCapture}
    >
      {children}
    </div>
  );
}
