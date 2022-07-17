import { Row } from "./Row";
import styled from "styled-components";

type Guess = string[];

interface Props {
  currentGuess: Guess;
  guesses: Guess[];
  turn: number;
  insufficientMoves: boolean;
}

const StyledGrid = styled.div`
  margin-left: 1rem;
  margin-top: 5.5rem;

  @media (max-width: 1140px) {
    margin-top: 2rem;
  }
`;

export const Grid = ({
  currentGuess,
  guesses,
  turn,
  insufficientMoves,
}: Props) => {
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
