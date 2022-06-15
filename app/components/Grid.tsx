import React from "react";
import { Row } from "./Row";
import styled from "styled-components";

const StyledGrid = styled.div`
  margin-top: 2.8rem;
  margin-left: 1rem;
`;

export const Grid = ({
  currentGuess,
  guesses,
  turn,
  insufficientMoves,
}: any) => {
  return (
    <StyledGrid>
      {guesses.map((guess: any, i: any) => {
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
