import React from "react";
import { Row } from "./Row";
import styled from "styled-components";

export const Grid = ({ currentGuess, guesses, turn }: any) => {
  return (
    <div>
      {guesses.map((guess: any, i: any) => {
        if (turn === i) {
          return <Row key={i} currentGuess={currentGuess} guess={guess} />;
        }
        return <Row key={i} guess={guess} />;
      })}
    </div>
  );
};
