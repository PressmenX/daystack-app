import { useEffect, useRef, useState } from 'react';

let modalBackNavigation = false;
let nextModalId = 0;

export function isModalBackNavigation(): boolean {
  return modalBackNavigation;
}

export function useModalHistory(open: boolean, onClose: () => void): void {
  const [modalId] = useState(() => `daystack-modal-${nextModalId++}`);
  const historyEntryActive = useRef(false);
  const openRef = useRef(open);
  const onCloseRef = useRef(onClose);

  openRef.current = open;
  onCloseRef.current = onClose;

  useEffect(() => {
    if (open && !historyEntryActive.current) {
      const state = {
        ...(window.history.state && typeof window.history.state === 'object'
          ? window.history.state
          : {}),
        daystackModalId: modalId,
      };
      window.history.pushState(state, '', window.location.href);
      historyEntryActive.current = true;
    }

    if (!open && historyEntryActive.current) {
      historyEntryActive.current = false;
      window.history.back();
    }
  }, [modalId, open]);

  useEffect(() => {
    function handlePopState(): void {
      if (!openRef.current || !historyEntryActive.current) {
        return;
      }

      historyEntryActive.current = false;
      modalBackNavigation = true;
      onCloseRef.current();
      window.setTimeout(() => {
        modalBackNavigation = false;
      }, 0);
    }

    window.addEventListener('popstate', handlePopState, true);
    return () => window.removeEventListener('popstate', handlePopState, true);
  }, []);

  useEffect(
    () => () => {
      if (historyEntryActive.current) {
        historyEntryActive.current = false;
        window.history.back();
      }
    },
    [],
  );
}
