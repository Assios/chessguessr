import { json, LoaderFunction } from "@remix-run/node";
import { getUserByUsername } from "~/firebase/utils";
import { useLoaderData } from "@remix-run/react";
import { generateBackground, getGravatarUrlWithDefault } from "~/utils/utils";

export const loader: LoaderFunction = async ({ params }) => {
  const username = params.slug;
  const user = await getUserByUsername(username);

  if (!user) {
    throw new Response("Not Found", {
      status: 404,
      statusText: `User with username ${username} could not be found. Are you sure this is the correct URL?`,
    });
  }

  return json({ user });
};

export default function UserProfile() {
  const data = useLoaderData();
  const user = data.user;

  const profile = user
    ? {
        name: user.username,
        avatar: getGravatarUrlWithDefault(user, 300),
        backgroundImage: generateBackground(user.emailHash),
      }
    : null;

  if (profile) {
    return (
      <div>
        <div>
          <img
            className="h-32 w-full object-cover lg:h-48"
            src={profile.backgroundImage}
            alt=""
          />
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <img
                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                src={profile.avatar}
                alt=""
              />
            </div>
            <div className="mt-6 min-w-0 flex-1 sm:pb-1">
              <h1 className="truncate text-2xl font-bold">
                {profile.name} TEST
              </h1>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 rounded-xl shadow-md w-96 text-center">
          <span>User profile not found.</span>
        </div>
      </div>
    );
  }
}
