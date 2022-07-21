import { useEffect } from "react";
import { Tile } from "~/styles/styles";
import styled from "styled-components";

const TutorialVariation = styled.div`
  display: flex;

  flex-direction: row;
  margin-top: 0.5rem;
`;

export default function TutorialModal({
  setShowTutorial,
  showTutorial,
  setTutorial,
}) {
  useEffect(() => {
    setTutorial(true);
  }, []);
  return (
    <>
      {showTutorial ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-base-100 outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 rounded-t">
                  <h3 className="text-3xl font-semibold">How to play</h3>
                </div>
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-lg leading-relaxed">
                    You will be shown a position from a chess game. Guess the 5
                    next moves played in the game. After each guess, the color
                    of the tile will show how close you were.
                  </p>
                  <h3 className="text-xl font-semibold mb-2">Examples</h3>
                  <hr />
                  <TutorialVariation>
                    <Tile
                      color="green"
                      flipTile={true}
                      animationIndex={1}
                      tutorial={true}
                    >
                      Nd5
                    </Tile>
                    <Tile tutorial={true}>Nbxd5</Tile>
                    <Tile tutorial={true}>exd5</Tile>
                    <Tile tutorial={true}>Qd6</Tile>
                    <Tile tutorial={true}>Rxd4</Tile>
                  </TutorialVariation>
                  <p className="text-lg mb-6">
                    Nd5 is the correct move in the correct spot.
                  </p>
                  <TutorialVariation>
                    <Tile tutorial={true}>Be6</Tile>
                    <Tile
                      color="yellow"
                      flipTile={true}
                      animationIndex={3}
                      tutorial={true}
                    >
                      Bxb6
                    </Tile>
                    <Tile tutorial={true}>Bxc4+</Tile>
                    <Tile tutorial={true}>Kg1</Tile>
                    <Tile tutorial={true}>Ne2+</Tile>
                  </TutorialVariation>
                  <p className="text-lg mb-6">
                    The move Bxb6 is in the played line, but in the wrong spot.
                  </p>
                  <TutorialVariation>
                    <Tile tutorial={true}>Nxg7</Tile>
                    <Tile tutorial={true}>Kd8</Tile>
                    <Tile tutorial={true}>Qf6+</Tile>
                    <Tile
                      color="grey"
                      pieceColor="red"
                      flipTile={true}
                      animationIndex={2}
                      tutorial={true}
                    >
                      Nxf6
                    </Tile>
                    <Tile tutorial={true}>Be7#</Tile>
                  </TutorialVariation>
                  <p className="text-lg mb-6">
                    The same piece-type was played in this spot, but the move is
                    wrong. In this case, a knight was played, but not
                    necessarily the same knight.
                  </p>
                  <p className="my-4 text-slate-500 text-lg leading-relaxed font-bold">
                    A new position will appear every day.
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 rounded-b">
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
