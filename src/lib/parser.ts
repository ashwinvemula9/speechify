/**
 * List of HTML tags that we want to ignore when finding the top level readable elements
 * These elements should not be chosen while rendering the hover player
 */
const IGNORE_LIST = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BUTTON",
  "LABEL",
  "SPAN",
  "IMG",
  "PRE",
  "SCRIPT",
];

/**
 *  **TBD:** Implement a function that returns all the top level readable elements on the page, keeping in mind the ignore list.
 *  A top level readable element is defined as follows:
 *    - The text node contained in the element should not be empty
 *    - The element should not be in the ignore list
 *    - The element should not be a child of another element that has only one child.
 *      For example: <div><blockquote>Some text here</blockquote></div>. div is the top level readable element and not blockquote
 */

export function getTopLevelReadableElementsOnPage(): HTMLElement[] {
  const topLevelElements: HTMLElement[] = [];

  // Function to check if an element has only one child element
  const hasSingleChild = (element: HTMLElement): boolean => {
    return (
      element.children.length === 1 &&
      element.children[0].nodeType === Node.ELEMENT_NODE
    );
  };

  // Recursive function to traverse the DOM tree and find top level readable elements
  const traverseDOM = (element: HTMLElement) => {
    // Check if the element is not empty, not in ignore list, and not a child of an element with a single child
    if (
      element.textContent?.trim() !== "" &&
      !IGNORE_LIST.includes(element.tagName) &&
      !hasSingleChild(element)
    ) {
      topLevelElements.push(element);
    }

    // Traverse child elements recursively
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i] as HTMLElement;
      traverseDOM(child);
    }
  };

  const rootEle: HTMLElement = document.getElementById(
    "content-1"
  ) as HTMLElement;

  // Start traversing from the body element
  traverseDOM(rootEle);

  return topLevelElements;
}
