import { RowProps } from "~/utils/types";
import { StyledRow, Tile } from "../styles/styles";

export const Row = ({ guess, currentGuess, insufficientMoves }: RowProps) => {
  if (currentGuess) {
    return (
      <StyledRow insufficientMoves={insufficientMoves}>
        {currentGuess.map((g: any, i: any) => {
          return (
            <Tile className="m-[3px]" key={i} current={true}>
              {g}
            </Tile>
          );
        })}
        {[...Array(5 - currentGuess.length)].map((_, i) => (
          <Tile className="m-[3px]" key={i}></Tile>
        ))}
      </StyledRow>
    );
  }

  if (guess) {
    return (
      <StyledRow>
        {guess.map((move: any, i: any) => {
          if (move) {
            return (
              <Tile
                key={i}
                className="m-[3px]"
                color={move.color}
                pieceColor={move.pieceColor}
                flipTile={true}
                animationIndex={i * 0.2}
              >
                {move.move}
              </Tile>
            );
          } else {
            return <Tile key={i} className="m-[3px]" />;
          }
        })}
      </StyledRow>
    );
  }

  return (
    <StyledRow>
      <Tile className="bg-primary m-[3px]"></Tile>
      <Tile className="bg-primary m-[3px]"></Tile>
      <Tile className="bg-primary m-[3px]"></Tile>
      <Tile className="bg-primary m-[3px]"></Tile>
      <Tile className="bg-primary m-[3px]"></Tile>
    </StyledRow>
  );
};
