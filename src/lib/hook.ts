/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement
): boolean {
  const bounds = getElementBounds(element);
  return (
    coordinate.x >= bounds.left &&
    coordinate.x <= bounds.left + bounds.width &&
    coordinate.y >= bounds.top &&
    coordinate.y <= bounds.top + bounds.height
  );
}


/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  const clone = element.cloneNode() as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.visibility = 'hidden';
  clone.style.height = 'auto';
  clone.style.width = element.offsetWidth + 'px';
  document.body.appendChild(clone);

  const range = document.createRange();
  range.selectNodeContents(clone);
  const rects = range.getClientRects();
  const lineHeight = rects.length > 0 ? rects[0].height : 0;

  document.body.removeChild(clone);
  return lineHeight;
}


export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
import { useState, useEffect } from 'react';

export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[]
): HoveredElementInfo | null {
  const [hoveredInfo, setHoveredInfo] = useState<HoveredElementInfo | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      for (const element of parsedElements) {
        if (isPointInsideElement({ x: clientX, y: clientY }, element)) {
          const bounds = getElementBounds(element);
          setHoveredInfo({
            element,
            top: bounds.top,
            left: bounds.left,
            heightOfFirstLine: getLineHeightOfFirstLine(element),
          });
          return;
        }
      }

      setHoveredInfo(null);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [parsedElements]);

  return hoveredInfo;
}

