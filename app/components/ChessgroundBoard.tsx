import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as ChessJS from "chess.js";

type Orientation = "white" | "black";

const Chess: any =
  typeof ChessJS === "function" ? (ChessJS as any) : (ChessJS as any).Chess;

function allSquares(): string[] {
  const files = "abcdefgh".split("");
  const ranks = "12345678".split("");
  const out: string[] = [];
  for (const f of files) for (const r of ranks) out.push(`${f}${r}`);
  return out;
}

export function ChessgroundBoard({
  fen,
  orientation,
  width,
  draggable,
  onDrop,
}: {
  fen: string;
  orientation: Orientation;
  width: number;
  draggable: boolean;
  onDrop: (from: string, to: string, promotion?: 'q'|'r'|'b'|'n') => boolean | void;
}) {
  const chess = useMemo(() => new Chess(fen), [fen]);
  const turnColor: Orientation = chess.turn() === "w" ? "white" : "black";

  const dests = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const sq of allSquares()) {
      const moves = chess.moves({ square: sq, verbose: true }) as Array<{
        to: string;
      }>;
      if (moves && moves.length) map.set(sq, moves.map((m) => m.to));
    }
    return map;
  }, [chess]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<any>(null);
  const userMovedRef = useRef<boolean>(false);
  const lastMoveRef = useRef<[string, string] | null>(null);
  const [promotion, setPromotion] = useState<
    { from: string; to: string; color: Orientation } | null
  >(null);
  const [wrapEl, setWrapEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!containerRef.current || apiRef.current) return;
      const mod = await import("chessground");
      if (!mounted || !containerRef.current) return;
      const { Chessground } = mod as any;
      apiRef.current = Chessground(containerRef.current, {
        fen,
        orientation,
        turnColor,
        coordinates: false,
        blockTouchScroll: true,
        disableContextMenu: true,
        highlight: { lastMove: true, check: true },
        animation: { enabled: true, duration: 200 },
        draggable: { enabled: draggable },
        premovable: { enabled: false },
        movable: {
          free: false,
          color: draggable ? turnColor : null,
          dests,
          rookCastle: true,
          events: {
            after: (orig: string, dest: string) => {
              let isPromo = false;
              let color: Orientation = 'white';
              try {
                const uiPieceAtDest = apiRef.current?.state?.pieces?.get(dest);
                if (uiPieceAtDest) color = uiPieceAtDest.color as Orientation;
                const destRank = dest[1];
                if (
                  uiPieceAtDest &&
                  uiPieceAtDest.role === 'pawn' &&
                  ((uiPieceAtDest.color === 'white' && destRank === '8') ||
                    (uiPieceAtDest.color === 'black' && destRank === '1'))
                ) {
                  isPromo = true;
                } else {
                  const ms = chess.moves({ square: orig, verbose: true }) as Array<any>;
                  const match = ms.find((m) => m.to === dest);
                  if (match && (match.flags?.includes('p') || typeof match.promotion === 'string')) isPromo = true;
                }
              } catch {}

              if (isPromo) {
                try {
                  // Keep current visual position; just block input while choosing.
                  apiRef.current?.set({ draggable: { enabled: false } });
                } catch {}
                setPromotion({ from: orig, to: dest, color });
                return;
              }

              userMovedRef.current = true;
              lastMoveRef.current = [orig, dest];
              try {
                apiRef.current?.set({ lastMove: [orig, dest] });
              } catch {}
              onDrop(orig, dest);
            },
          },
        },
      });
      setWrapEl(containerRef.current);
    })();
    return () => {
      mounted = false;
      try {
        apiRef.current?.destroy?.();
      } catch {}
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!apiRef.current) return;
    // If a promotion choice is pending, freeze input and avoid pushing
    // the parent FEN (which would revert the visual board).
    if (promotion) {
      try {
        apiRef.current.set({ draggable: { enabled: false } });
      } catch {}
      return;
    }
    const nextCfg: any = {
      fen,
      orientation,
      turnColor,
      coordinates: false,
      draggable: { enabled: draggable },
      premovable: { enabled: false },
      movable: { free: false, color: draggable ? turnColor : null, dests, rookCastle: true },
    };
    // Clear lastMove when the position is set externally (undo/reset/submit).
    // Keep lastMove when it originated from a user drag this render cycle.
    if (userMovedRef.current && lastMoveRef.current) {
      nextCfg.lastMove = lastMoveRef.current;
    } else {
      nextCfg.lastMove = undefined;
    }
    apiRef.current.set(nextCfg);
    userMovedRef.current = false;
  }, [fen, orientation, draggable, turnColor, dests, promotion]);

  // Compute absolute position for a board square within cg-wrap
  const squareSize = (() => {
    const rect = wrapEl?.getBoundingClientRect();
    return rect ? rect.width / 8 : width / 8;
  })();

  const fileIndex = (file: string) => 'abcdefgh'.indexOf(file);
  const toTopLeft = (sq: string) => {
    const f = fileIndex(sq[0]);
    const r = parseInt(sq[1]);
    if (orientation === 'white') {
      return { left: f * squareSize, top: (8 - r) * squareSize };
    } else {
      return { left: (7 - f) * squareSize, top: (r - 1) * squareSize };
    }
  };

  const choosePromotion = (role: 'q'|'r'|'b'|'n') => {
    if (!promotion) return;
    const { from, to } = promotion;
    setPromotion(null);
    try {
      apiRef.current?.set({ draggable: { enabled: draggable } });
    } catch {}
    // Commit the move with chosen promotion
    userMovedRef.current = true;
    lastMoveRef.current = [from, to];
    try {
      apiRef.current?.set({ lastMove: [from, to] });
    } catch {}
    onDrop(from, to, role);
  };

  return (
    <div style={{ width, height: width }} className="relative">
      <div ref={containerRef} className="w-full h-full" />
      {promotion && wrapEl && createPortal(
        (() => {
          const to = promotion.to;
          const roles = ['q','n','r','b'] as const; // lichess order
          const bases = promotion.color === 'white' ? ['8','7','6','5'] : ['1','2','3','4'];
          const { left } = toTopLeft(to);
          return (
            <div className="absolute inset-0 z-20" onClick={(e) => e.stopPropagation()}>
              {roles.map((role, i) => {
                const sq = `${to[0]}${bases[i]}`;
                const pos = toTopLeft(sq);
                const disc = squareSize * 0.98;
                const offsetX = left + (squareSize - disc) / 2;
                const offsetY = pos.top + (squareSize - disc) / 2;
                return (
                  <div
                    key={role}
                    onClick={() => choosePromotion(role)}
                    style={{ left: offsetX, top: offsetY, width: disc, height: disc }}
                    className="absolute rounded-full flex items-center justify-center pointer-events-auto overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.7),_inset_0_0_0_1px_rgba(0,0,0,0.4)] bg-[radial-gradient(circle_at_45%_35%,_#d0d0d0_35%,_#b8b8b8_60%,_#8c8c8c_100%)]"
                  >
                    <piece
                      className={`${promotion.color} ${role === 'n' ? 'knight' : role === 'q' ? 'queen' : role === 'r' ? 'rook' : 'bishop'}`}
                      style={{ position: 'static', width: disc * 0.72, height: disc * 0.72, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })(),
        wrapEl
      )}
    </div>
  );
}

export default ChessgroundBoard;
