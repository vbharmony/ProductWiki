import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (visible) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }, [visible]);

  if (!visible && opacity === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9999,
        backgroundColor: '#1A1A2E',
        color: '#FFFFFF',
        fontSize: '12px',
        padding: '8px 14px',
        borderRadius: '8px',
        opacity,
        transition: 'opacity 0.15s ease',
        pointerEvents: 'none',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 400,
      }}
    >
      {message}
    </div>
  );
}
