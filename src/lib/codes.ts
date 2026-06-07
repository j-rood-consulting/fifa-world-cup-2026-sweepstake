const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeJoinCode(length = 6) {
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export function makeAdminCode() {
  return `${makeJoinCode(4)}-${makeJoinCode(4)}-${makeJoinCode(4)}`;
}

export function makePlayerCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}
