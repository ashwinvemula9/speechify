import { useEffect, useState } from "react";

/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  console.log(elem);
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
  const firstTextNode = element.childNodes[0];
  if (firstTextNode.nodeType !== Node.TEXT_NODE) return 0;
  const bounds = getElementBounds(firstTextNode as HTMLElement);
  return bounds.height;
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
export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[]
): HoveredElementInfo {
  const [hoveredElementInfo, setHoveredElementInfo] =
    useState<HoveredElementInfo | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      for (const element of parsedElements) {
        const coordinate = { x: event.pageX, y: event.pageY };
        if (isPointInsideElement(coordinate, element)) {
          const bounds = getElementBounds(element);
          const heightOfFirstLine = getLineHeightOfFirstLine(element);
          setHoveredElementInfo({
            element,
            top: bounds.top,
            left: bounds.left,
            heightOfFirstLine,
          });
          return;
        }
      }
      setHoveredElementInfo(null);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [parsedElements]);

  return hoveredElementInfo;
}
