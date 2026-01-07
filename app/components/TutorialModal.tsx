import { useEffect } from 'react';
import { Tile } from './Tile';
import { convertToIcon } from '~/utils/utils';

export default function TutorialModal({
  setShowTutorial,
  showTutorial,
  setTutorial,
}: {
  setShowTutorial: (show: boolean) => void;
  showTutorial: boolean;
  setTutorial: (val: boolean) => void;
}) {
  useEffect(() => {
    setTutorial(true);
  }, []);

  return (
    <>
      {showTutorial ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none px-4 py-8">
            <div className="relative w-auto mx-auto max-w-3xl max-h-[calc(100vh-4rem)] flex flex-col">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-base-100 outline-none focus:outline-none max-h-full">
                <div className="flex items-start justify-between pl-5 pr-4 pt-5 rounded-t flex-shrink-0">
                  <h3 className="text-3xl font-semibold">How to play</h3>
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-base-200 hover:bg-base-300 text-gray-500 hover:text-gray-700 transition-colors"
                    type="button"
                    onClick={() => setShowTutorial(false)}
                    aria-label="Close"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="divider flex-shrink-0" />
                <div className="relative pl-6 pr-6 flex-auto overflow-y-auto">
                  <p className="mb-2 text-lg leading-relaxed">
                    You will be shown a position from a chess game. Guess the 5
                    next moves played in the game. After each guess, the color
                    of the tile will show how close you were. It's like Wordle,
                    or Chessle, but for chess games.
                  </p>
                  <div className="divider" />
                  <h3 className="text-xl font-semibold mb-2">Examples</h3>

                  {/* Example 1: Green tile */}
                  <div className="flex flex-row mt-2">
                    <Tile
                      className="m-[3px]"
                      color="green"
                      flipTile={true}
                      animationIndex={1}
                      tutorial={true}
                    >
                      {convertToIcon('Nd5')}
                    </Tile>
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('Nbxd5')}
                    </Tile>
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('exd5')}
                    </Tile>
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('Qd6')}
                    </Tile>
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('Rxd4')}
                    </Tile>
                  </div>
                  <p className="text-lg mb-6">
                    Nd5 is the correct move in the correct spot.
                  </p>

                  {/* Example 2: Yellow tile */}
                  <div className="flex flex-row mt-2">
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('Be6')}
                    </Tile>
                    <Tile
                      className="m-[3px]"
                      color="yellow"
                      flipTile={true}
                      animationIndex={3}
                      tutorial={true}
                    >
                      {convertToIcon('Bxb6')}
                    </Tile>
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('Bxc4+')}
                    </Tile>
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('Kg1')}
                    </Tile>
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('Ne2+')}
                    </Tile>
                  </div>
                  <p className="text-lg mb-6">
                    The move Bxb6 is in the played line, but in the wrong spot.
                  </p>

                  {/* Example 3: Blue tile */}
                  <div className="flex flex-row mt-2">
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('Nxg7')}
                    </Tile>
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('Kd8')}
                    </Tile>
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('Qf6+')}
                    </Tile>
                    <Tile
                      className="m-[3px]"
                      color="grey"
                      pieceColor="blue"
                      flipTile={true}
                      animationIndex={2}
                      tutorial={true}
                    >
                      {convertToIcon('Nxf6')}
                    </Tile>
                    <Tile className="m-[3px]" tutorial={true}>
                      {convertToIcon('Be7#')}
                    </Tile>
                  </div>
                  <p className="text-lg mb-6">
                    The same piece-type was played in this spot, but the move is
                    wrong. In this case, a knight was played, but not
                    necessarily the same knight.
                  </p>

                  <p className="text-lg mb-6">
                    <span className="font-bold">NB!</span> The notation has to
                    be identical for the moves to be considered the same (
                    <i>Nxf7</i> and <i>Nxf7+</i> aren't considered the same
                    moves).
                  </p>
                  <p className="my-4 text-lg leading-relaxed font-bold pb-2">
                    A new position will appear every day at midnight UTC.
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 rounded-b flex-shrink-0 border-t border-base-300">
                  <button
                    className="text-red-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowTutorial(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
