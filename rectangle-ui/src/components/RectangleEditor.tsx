import React, { useState, useEffect, useRef, useMemo } from 'react';
import api from '../api';
import { debounce } from 'lodash';

interface Dimensions {
  Width: number;
  Height: number;
}

const RectangleEditor = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({ Width: 150, Height: 200 });
  const [error, setError] = useState<string | null>(null);
  const [, setIsResizing] = useState(false);
  const latestDimensions = useRef(dimensions);

  // Fetch initial dimensions
  useEffect(() => {
    api.get('/Rectangle')
      .then(response => {
        setDimensions(response.data);
        latestDimensions.current = response.data;
      })
      .catch(() => setError('Failed to load dimensions.'));
  }, []);

  // Debounced function to send API request (wrapped in useMemo)
  const saveDimensions = useMemo(
    () =>
      debounce(async (updatedDimensions: Dimensions) => {
        try {
          await api.post('/Rectangle', updatedDimensions);
          setError(null);
        } catch (err: any) {
          setError(err.response?.data || 'Error saving dimensions.');
        }
      }, 1000), // 1-second debounce
    []
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.Width;
    const startHeight = dimensions.Height;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newWidth = Math.max(10, startWidth + deltaX);
      const newHeight = Math.max(10, startHeight + deltaY);

      setDimensions({ Width: newWidth, Height: newHeight });
      latestDimensions.current = { Width: newWidth, Height: newHeight };

      // Call the debounced function to update API
      saveDimensions(latestDimensions.current);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const perimeter = 2 * (dimensions.Width + dimensions.Height);

  return (
    <div style={{ padding: '20px' }}>
      <svg width="800" height="600" style={{ border: '1px solid #ccc' }}>
        <rect
          x="100"
          y="100"
          width={dimensions.Width}
          height={dimensions.Height}
          fill="#add8e6"
          stroke="#000"
        />
        <circle
          cx={100 + dimensions.Width}
          cy={100 + dimensions.Height}
          r="8"
          fill="red"
          onMouseDown={handleMouseDown}
          style={{ cursor: 'nwse-resize' }}
        />
      </svg>
      <div style={{ marginTop: '10px' }}>
        Perimeter: {perimeter}px
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      </div>
    </div>
  );
};

export default RectangleEditor;
