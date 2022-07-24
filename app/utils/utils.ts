export const arraysEqual = (a: any, b: any) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const numberToLetters = (number: number): string => {
  const letters = "abcdefghijklmnopqrstuvwxyz";

  let res = "";
  let a = number - 1;
  while (true) {
    const remainder = a % letters.length;
    res = letters[remainder] + res;
    if (a < letters.length) {
      break;
    }
    a = Math.floor(a / letters.length) - 1;
  }

  return res;
};
