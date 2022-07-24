export const getIdFromUrl = (url: string): string | null => {
  if (!url.includes("lichess.org")) {
    return null;
  }

  const parts = url.split("/");

  let lastPart = parts[parts.length - 1];

  if (lastPart.includes("#")) {
    lastPart = lastPart.split("#")[0];
  }

  if (["white", "black"].includes(lastPart)) {
    return parts[parts.length - 2];
  }

  if (lastPart.length === 12) {
    return lastPart.substring(0, 8);
  } else if (lastPart.length === 8) return lastPart;

  return null;
};
