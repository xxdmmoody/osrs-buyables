import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function Tooltip({ children, content }) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 12, // 12px gap
      });
    }
  }, [show]);

  return (
    <span
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
    >
      {children}
      {show && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{ top: `${coords.top}px`, left: `${coords.left}px`, transform: 'translateY(-50%)' }}
        >
          <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl border border-gray-700 min-w-max relative">
            {content}
            {/* Arrow pointing left */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-px">
              <div className="border-[6px] border-transparent border-r-gray-900 dark:border-r-gray-800"></div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </span>
  );
}
