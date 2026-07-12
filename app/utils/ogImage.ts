export const boardOgImage = (fen: string) =>
  "https://images.weserv.nl/?url=" +
  encodeURIComponent(
    `lichess1.org/export/fen.gif?fen=${
      fen.split(" ")[0]
    }&theme=brown&piece=cburnett`
  ) +
  "&w=1200&h=630&fit=contain&cbg=262421&output=png";
