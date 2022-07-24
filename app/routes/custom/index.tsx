import React from "react";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import * as ChessJS from "chess.js";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

/*
Test: https://lichess.org/y7KR7XTq
move#: 24
*/

const index = () => {
  return (
    <div>
      <h1>List custom positions?</h1>
    </div>
  );
};

export default index;
