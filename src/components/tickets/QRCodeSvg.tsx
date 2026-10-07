import React from 'react';

interface QRCodeSvgProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeSvg: React.FC<QRCodeSvgProps> = ({
  value,
  size = 140,
  className = '',
}) => {
  // Deterministic matrix generator based on seed string
  const generateMatrix = (str: string) => {
    const matrixSize = 25;
    const grid: boolean[][] = Array.from({ length: matrixSize }, () =>
      Array(matrixSize).fill(false)
    );

    // Standard Finder Patterns (Corner boxes)
    const drawFinderPattern = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuterBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInnerBox = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[startY + r][startX + c] = isOuterBorder || isInnerBox;
        }
      }
    };

    drawFinderPattern(0, 0); // Top-left
    drawFinderPattern(matrixSize - 7, 0); // Top-right
    drawFinderPattern(0, matrixSize - 7); // Bottom-left

    // Seed hash filling the center and edges
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip finder pattern zones
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= matrixSize - 8;
        const inBL = r >= matrixSize - 8 && c < 8;
        if (!inTL && !inTR && !inBL) {
          const bit = Math.abs(Math.sin((r * 31 + c * 17 + hash) * 0.1));
          grid[r][c] = bit > 0.48;
        }
      }
    }

    return grid;
  };

  const matrix = generateMatrix(value);
  const matrixSize = matrix.length;
  const cellSize = size / matrixSize;

  return (
    <div className={`inline-block p-2 bg-[#F9F5EC] rounded-lg border border-[#D4A857] shadow-md ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {matrix.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.1}
                height={cellSize + 0.1}
                fill="#3D030B"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
