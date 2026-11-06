import { useEffect } from "react";

const MUI_POPUP_SELECTORS = [
  ".date-input-picker-popper",
  ".MuiPickersPopper-root",
  ".MuiPopover-root",
  ".MuiDialog-root",
  ".MuiModal-root",
  ".MuiMenu-root",
  ".MuiAutocomplete-popper",
];

export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;

      if (!element) return;

      const target = event.target;

      // Click inside the filter card
      if (target instanceof Node && element.contains(target)) {
        return;
      }

      const path = event.composedPath();

      // Click inside MUI popup / DatePicker / Menu
      const isMuiPopup = path.some((node) => {
        if (!(node instanceof Element)) {
          return false;
        }

        return MUI_POPUP_SELECTORS.some((selector) => node.matches(selector));
      });

      if (isMuiPopup) {
        return;
      }

      // Also check closest() in case the clicked element
      // is deeply nested inside the popup
      if (
        target instanceof Element &&
        MUI_POPUP_SELECTORS.some((selector) => target.closest(selector))
      ) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
