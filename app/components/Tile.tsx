import { ReactNode } from 'react';

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

  return (
    <div
      className={`${baseClasses} ${animationClass} ${className}`}
      style={animationDelay > 0 ? { animationDelay: `${animationDelay}s` } : undefined}
    >
      {children}
    </div>
  );
};

export default Tile;
