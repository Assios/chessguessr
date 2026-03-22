declare module 'chess.js';

declare namespace JSX {
  interface IntrinsicElements {
    piece: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
