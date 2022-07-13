import React, { useEffect } from "react";

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
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-base-100 outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 rounded-t">
                <h3 className="text-3xl font-semibold">Chessguessr</h3>
              </div>
              <div className="relative p-6 flex-auto">
                <p className="my-4 text-slate-500 text-lg leading-relaxed">
                  You will be shown a position from a chess game.
                </p>
                <p className="my-4 text-slate-500 text-lg leading-relaxed">
                  Guess the 5 next moves played in the game.
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
      ) : null}
    </>
  );
}
