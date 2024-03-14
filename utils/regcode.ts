export function generateRegcode(): string {
  let regcode = '';
  for (let i = 0; i < 6; i++) {
    regcode += Math.floor(Math.random() * 10);
  }
  return regcode;
}