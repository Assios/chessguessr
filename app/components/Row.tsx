import React from "react";
import styled, { keyframes, css } from "styled-components";
import { StyledRow, Tile } from "../styles/styles";

export const Row = ({ guess, currentGuess, insufficientMoves }: any) => {
  if (currentGuess) {
    return (
      <StyledRow insufficientMoves={insufficientMoves}>
        {currentGuess.map((g: any, i: any) => {
          return (
            <Tile key={i} current={true}>
              {g}
            </Tile>
          );
        })}
        {[...Array(5 - currentGuess.length)].map((_, i) => (
          <Tile key={i}></Tile>
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
              <Tile color={move.color} flipTile={true} animationIndex={i}>
                {move.move}
              </Tile>
            );
          } else {
            return <Tile />;
          }
        })}
      </StyledRow>
    );
  }

  return (
    <StyledRow>
      <Tile></Tile>
      <Tile></Tile>
      <Tile></Tile>
      <Tile></Tile>
      <Tile></Tile>
    </StyledRow>
  );
};
