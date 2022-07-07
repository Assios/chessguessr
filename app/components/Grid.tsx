import React from "react";
import { Row } from "./Row";
import styled from "styled-components";

const StyledGrid = styled.div`
  margin-left: 1rem;
  margin-top: 5.5rem;
`;

export const Grid = ({
  currentGuess,
  guesses,
  turn,
  insufficientMoves,
}: any) => {
  return (
    <StyledGrid>
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
