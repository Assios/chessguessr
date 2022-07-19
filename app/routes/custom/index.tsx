import { Chessguessr } from "../../components/Chessguessr";
import styled from "styled-components";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getGames } from "~/models/game.server";
import { getDoc, doc } from "firebase/firestore";
import { useOutletContext } from "@remix-run/react";

// eyJkYXRlIjogIjIwMjItMDYtMjUiLCJmZW4iOiAiMmszcnIvMWIzcDFwLzFQMnAxcDEvcHExcFAzLzJwUTQvMlA1LzJCMU5QUFAvUjVLMSB3IC0gLSAzIDI1Iiwic29sdXRpb24iOiBbCiAgICJCYTQiLCJRYjIiLCJRYzUrIiwiS2I4IiwiUmUxIl0sImdhbWVVcmwiOiAiaHR0cHM6Ly9saWNoZXNzLm9yZy9aUDBxeWR5aC93aGl0ZSM0OCIsIndoaXRlIjogIkdNIFJlYmVjY2FIYXJyaXMiLCJibGFjayI6ICJOTSBUd2VsdmVUZWVuIiwid1JhdGluZyI6IDI3MjEsImJSYXRpbmciOiAyNTIwLCJpZCI6IDR9

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const data = url.searchParams.get("data");

  const decoded = atob(data);

  console.log("data", decoded);

  const game = JSON.parse(decoded);

  return json({
    game: game,
  });
};

const StyledIndex = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export default function Index() {
  const { game, stats } = useLoaderData();

  const {
    showModal,
    setShowModal,
    showTutorial,
    setShowTutorial,
    setTutorial,
  }: any = useOutletContext();

  return (
    <StyledIndex>
      <div className="mt-10 mb-20 lg:mb-0">
        {game && (
          <Chessguessr
            showModal={showModal}
            setShowModal={setShowModal}
            showTutorial={showTutorial}
            setShowTutorial={setShowTutorial}
            setTutorial={setTutorial}
            game={game}
            stats={stats}
          />
        )}
      </div>
    </StyledIndex>
  );
}
