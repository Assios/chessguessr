const ADJECTIVES = [
  'Swift','Calm','Brave','Bright','Quiet','Clever','Fierce','Merry','Sunny',
  'Rapid','Lucky','Chill','Neat','Keen','Wise','Jolly','Zippy','Witty','Daring',
  'Bold','Gentle','Epic','Royal','Solid','Icy','Amber','Aqua','Crimson','Golden',
  'Silver','Azure','Ivory','Misty','Shadow','Nova','Cosmic','Prime','True',
  'Glacial','Ocean','Forest','Desert','Urban','Polar','Lunar','Solar','Terra','Ultra',
  'Arctic','Cobalt','Emerald','Ruby','Onyx','Quartz','Rapid','Turbo','Hyper','Gamma',
  'Delta','Omega','Alpha','Echo','Vivid','Frost','Steel','Stone','Cloud','Flame'
];

const ANIMALS = [
  'Fox','Hawk','Wolf','Lion','Panda','Otter','Eagle','Tiger','Bear','Shark',
  'Whale','Falcon','Raven','Bison','Koala','Moose','Yak','Gecko','Mamba','Marten',
  'Cobra','Puma','Lynx','Kite','Moth','Crane','Swan','Drake','Seal','Trout',
  'Stag','Boar','Ibis','Heron','Wren','Jay','Crow','Viper','Asp','Owl',
  'Duck','Hare','Mole','Toad','Newt','Ant','Bee','Mantis','Skunk','Marten',
  'Badger','Gopher','Shrew','Marten','Yak','Yak','Dingo','Okapi','Tapir','Ibex',
  'Gazelle','Civet','Quoll','Tahr','Orca','Kudu','Eland','Tuna', 'Bishop', 'Queen', 'King', 'Knight', 'Pawn'
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function sanitizeAlphaNum(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, '');
}

function suffixFrom(seed?: string, len = 2): string {
  let n = 0;
  const s = (seed || '') + Date.now().toString(36) + Math.random().toString(36);
  for (let i = 0; i < s.length; i++) n = ((n << 5) - n) + s.charCodeAt(i);
  const out = Math.abs(n).toString(36).toUpperCase();
  return out.slice(0, len).padEnd(len, '0');
}

export function generateRandomUsername(maxLen = 16, seed?: string): string {
  let base = sanitizeAlphaNum(pick(ADJECTIVES) + pick(ANIMALS));
  const suffix = suffixFrom(seed, 2);
  const keep = Math.max(3, maxLen - suffix.length);
  base = base.slice(0, keep);
  let candidate = (base + suffix).slice(0, maxLen);
  if (candidate.length < 3) candidate = (candidate + '000').slice(0, 3);
  return candidate;
}
