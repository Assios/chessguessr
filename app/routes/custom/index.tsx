import React from "react";
import { Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";

/*
Test: https://lichess.org/y7KR7XTq
move#: 24
*/

export async function action({ request }) {
  const body = await request.formData();
  const lichessId = body.get("lichess-game");

  console.log("body", lichessId);

  const res = await fetch("https://lichess.org/game/export/y7KR7XTq", {
    headers: new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
  });

  const data = await res.json();

  return json({ game: data });
}

const index = () => {
  const data = useActionData();

  console.log("d", data);
  return (
    <div>
      <Form method="post">
        <input
          className="block border-2 mb-2"
          type="text"
          name="lichess-game"
        />
        <input className="block border-2" type="text" name="start-from" />
        <button type="submit">Submit game</button>
      </Form>
    </div>
  );
};

export default index;
