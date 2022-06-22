import React from "react";

const Correct = ({ game, gameUrlText }) => {
  return (
    <div className="relative p-6 flex-auto">
      <p className="my-4 text-slate-500 text-lg leading-relaxed">
        This game was played between {game.white} and {game.black}. Check out
        the game{" "}
        <a
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          href={game.gameUrl}
          target="_blank"
        >
          {gameUrlText(game)}
        </a>
        .
      </p>
    </div>
  );
};

const Failed = ({ game, gameUrlText }) => {
  return (
    <div className="relative p-6 flex-auto">
      <p className="my-4 text-slate-500 text-lg leading-relaxed">
        You didn't find the 5 moves played in the game. This game was played
        between {game.white} and {game.black}. Check out the game (and the
        solution){" "}
        <a
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          href={game.gameUrl}
          target="_blank"
        >
          {gameUrlText(game)}
        </a>
        .
      </p>
    </div>
  );
};

export default function Modal({ correct, showModal, setShowModal, game }) {
  const gameUrlText = (game) => {
    if (game.gameUrl.includes("lichess.org")) {
      return "on lichess";
    }

    return "here";
  };

  const text = game.gameUrl.includes("lichess.org") ? "on lichess" : "here";

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {correct ? "Congrats!" : "Oops!"}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                {correct ? (
                  <Correct game={game} gameUrlText={gameUrlText} />
                ) : (
                  <Failed game={game} gameUrlText={gameUrlText} />
                )}
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
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
