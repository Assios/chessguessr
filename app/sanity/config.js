import PicoSanity from "picosanity";
import imageUrlBuilder from "@sanity/image-url";

const config = {
	dataset: "production",
	projectId: process.env.SANITY_PROJECT_ID,
	useCdn: false,
};

export const sanityClient = new PicoSanity(config);

const builder = imageUrlBuilder(sanityClient);

export function createSanityImageUrl(source) {
  return builder.image(source);
}
