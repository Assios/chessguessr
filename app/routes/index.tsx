import React, { useState, useEffect } from "react";
import { Chessguessr } from "../components/Chessguessr";
import styled from "styled-components";

const StyledIndex = styled.div`
  margin-top: 5rem;

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export default function Index() {
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/data")
      .then((res) => res.json())
      .then((json) => {
        setGame(json[1]);
      });
  }, [setGame]);

  return <StyledIndex>{game && <Chessguessr data={game} />}</StyledIndex>;
}
