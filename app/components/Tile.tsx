import type { ReactNode } from 'react';

interface TileProps {
  children?: ReactNode;
  color?: 'green' | 'yellow' | 'grey' | string;
  pieceColor?: 'blue' | 'regular' | string;
  current?: boolean;
  animationIndex?: number;
  tutorial?: boolean;
  flipTile?: boolean;
  className?: string;
}

function getFlipAnimationClass(
  color?: string,
  pieceColor?: string
): string {
  if (color === 'green') return 'animate-flip-green';
  if (color === 'yellow' && pieceColor === 'blue') return 'animate-flip-yellow-blue';
  if (color === 'yellow') return 'animate-flip-yellow';
  if (pieceColor === 'blue') return 'animate-flip-blue';
  return 'animate-flip-grey';
}

// Spelled out for screen readers and as a hover tooltip, so the feedback
// doesn't rely on colour alone.
export function feedbackLabel(color?: string, pieceColor?: string): string {
  if (color === 'green') return 'Correct';
  if (color === 'yellow' && pieceColor === 'blue')
    return 'In the line, wrong spot. Right piece type here';
  if (color === 'yellow') return 'In the line, wrong spot';
  if (pieceColor === 'blue') return 'Right piece type, wrong move';
  return 'Not in the line';
}

export const Tile = ({
  children,
  color,
  pieceColor,
  current,
  animationIndex = 0,
  tutorial,
  flipTile,
  className = '',
}: TileProps) => {
  const baseClasses = tutorial ? 'tile tile-tutorial' : 'tile';

  const animationClass = flipTile
    ? getFlipAnimationClass(color, pieceColor)
    : current
    ? 'animate-bounce-tile'
    : '';

  const animationDelay = animationIndex * 0.2;
  const label = flipTile ? feedbackLabel(color, pieceColor) : undefined;

  return (
    <div
      className={`${baseClasses} ${animationClass} ${className}`}
      style={animationDelay > 0 ? { animationDelay: `${animationDelay}s` } : undefined}
      title={label}
    >
      {children}
      {label && <span className="sr-only">: {label}</span>}
    </div>
  );
};

export default Tile;
