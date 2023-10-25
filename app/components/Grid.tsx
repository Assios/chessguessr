import { Row } from "./Row";
import styled from "styled-components";
import { GridProps } from "../utils/types";
import { convertToIcon } from "~/utils/utils";

const StyledGrid = styled.div`
  margin-left: 1rem;
  margin-top: 3.3rem;

  @media (max-width: 1140px) {
    margin-top: 2rem;
  }
`;

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
