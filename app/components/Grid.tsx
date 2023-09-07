import { Row } from "./Row";
import styled from "styled-components";
import { GridProps } from "../utils/types";
import {
  FaChessKing,
  FaChessQueen,
  FaChessBishop,
  FaChessPawn,
  FaChessRook,
  FaChessKnight,
} from "react-icons/fa";

const StyledGrid = styled.div`
  margin-left: 1rem;
  margin-top: 3.3rem;

  @media (max-width: 1140px) {
    margin-top: 2rem;
  }
`;

export const convertToIcon = (move: string) => {
  if (!move) return "";

  if (move[0].toLowerCase() === move[0] && /[a-h]/.test(move[0])) {
    return (
      <>
        <FaChessPawn /> {move}
      </>
    );
  }

  switch (move[0]) {
    case "K":
      return (
        <>
          <FaChessKing /> {move.substr(1)}
        </>
      );
    case "Q":
      return (
        <>
          <FaChessQueen /> {move.substr(1)}
        </>
      );
    case "B":
      return (
        <>
          <FaChessBishop /> {move.substr(1)}
        </>
      );
    case "N":
      return (
        <>
          <FaChessKnight /> {move.substr(1)}
        </>
      );
    case "R":
      return (
        <>
          <FaChessRook /> {move.substr(1)}
        </>
      );
    default:
      return move;
  }
};

export const Grid = ({
  currentGuess,
  guesses,
  turn,
  insufficientMoves,
}: GridProps) => {
  const iconifiedCurrentGuess = currentGuess.map((move) => {
    if (typeof move === "string") {
      return convertToIcon(move);
    }
    return move;
  });

  const iconifiedGuesses = guesses.map((row) => {
    return row.map((move: any) => {
      if (move === null) {
        return null;
      }
      return {
        ...move,
        move:
          typeof move.move === "string" ? convertToIcon(move.move) : move.move,
      };
    });
  });

  return (
    <StyledGrid>
      <p className="sm:text-lg lg:text-2xl mb-1 font-semibold">Your guesses:</p>
      {iconifiedGuesses.map((guess: any, i: number) => {
        if (turn === i) {
          return (
            <Row
              key={i}
              currentGuess={iconifiedCurrentGuess}
              guess={guess}
              insufficientMoves={insufficientMoves}
            />
          );
        }
        return <Row key={i} guess={guess} />;
      })}
    </StyledGrid>
  );
};
