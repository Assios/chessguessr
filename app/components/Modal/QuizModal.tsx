import { GiTrophyCup } from "react-icons/gi";

export default function QuizModal({ setShowModal, score, games }) {
  const total = games.reduce((acc, game) => acc + game.rounds.length, 0);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-base-200 outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 rounded-t">
              <h3 className="text-3xl font-semibold">
                {score}/{total}
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
