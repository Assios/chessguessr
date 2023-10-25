import { Row } from "./Row";
import styled from "styled-components";
import { GridProps } from "../utils/types";

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
  return (
    <StyledGrid>
      <p className="sm:text-lg lg:text-2xl mb-1 font-semibold">Your guesses:</p>
      {guesses.map((guess: any, i: number) => {
        if (turn === i) {
          return (
            <Row
              key={i}
              currentGuess={currentGuess}
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
