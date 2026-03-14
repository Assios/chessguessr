declare module 'chess.js';
declare module '@bity/oauth2-auth-code-pkce';
declare module '@remix-run/react/routeModules' {
  import { ComponentType } from 'react';
  export type CatchBoundaryComponent = ComponentType;
}

declare namespace JSX {
  interface IntrinsicElements {
    piece: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
