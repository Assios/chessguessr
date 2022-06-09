import React, { useState, useEffect } from "react";
import useChessguessr from "../hooks/useChessguessr";
import { Chessboard } from "react-chessboard";
import Chessground from "@react-chess/chessground";
import { Grid } from "./Grid";
import styled from "styled-components";

const ChessboardWrapper = styled.div`
  display: flex;
  justify-content: center;

  margin-bottom: 2rem;
`;

const Buttons = styled.div`
  display: flex;
  margin-bottom: 2rem;

  justify-content: center;
`;

const Players = styled.div`
  display: flex;

  justify-content: center;
`;

export const Chessguessr = ({ data }: any) => {
  const {
    currentGuess,
    onDrop,
    position,
    takeback,
    submitGuess,
    guesses,
    correct,
    turn,
    insufficientMoves,
  } = useChessguessr(data);

  useEffect(() => {
    console.log(guesses, turn, correct);
  }, [guesses, turn, correct]);

  const { white, black, wRating, bRating } = data;

  return (
    <div>
      <Players>
        <p className="text-2xl mb-4">
          {white} ({wRating}) – {black} ({bRating})
        </p>
      </Players>

      <ChessboardWrapper>
        {position && (
          <Chessboard
            arePiecesDraggable={turn < 5 && !correct}
            position={position.fen()}
            onPieceDrop={onDrop}
            areArrowsAllowed={false}
          />
        )}
      </ChessboardWrapper>
      <Buttons>
        <button
          className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 mr-2"
          onClick={takeback}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
          Undo last move
        </button>
        <button
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ml-2"
          onClick={submitGuess}
        >
          Submit
        </button>
      </Buttons>
      <Grid
        currentGuess={currentGuess}
        guesses={guesses}
        turn={turn}
        insufficientMoves={insufficientMoves}
      />
    </div>
  );
};
