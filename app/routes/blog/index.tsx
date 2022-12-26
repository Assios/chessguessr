import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { sanityClient } from "~/sanity/config";
import { createSanityImageUrl } from "~/sanity/config";

export const loader = async () => {
  const posts = await sanityClient.fetch(
    `*[_type == "post"]{ _id, title, description, postImage, slug }`
  );

  return { posts };
};

export default function Posts() {
  const { posts } = useLoaderData();

  return (
    <div className="relative px-4 pt-12 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Blog
          </h2>
          <p className="max-w-prose mx-auto mt-3 max-w-2xl text-xl sm:mt-4">
            Palms are sweaty knees weak arms are heavy, there's vomit on his
            sweater already, mom's spaghetti.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => {
            const imageUrl = createSanityImageUrl(post.postImage).url();

            return (
              <div
                key={post.title}
                className="flex flex-col overflow-hidden rounded-lg shadow-lg"
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={imageUrl}
                    alt=""
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600">
                      {post.date}
                    </p>
                    <a
                      href={"blog/" + post.slug.current}
                      className="mt-2 block"
                    >
                      <p className="text-xl font-semibold text-success-content">
                        {post.title}
                      </p>
                      <p className="mt-3 text-base text-secondary">
                        {post.description}
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
