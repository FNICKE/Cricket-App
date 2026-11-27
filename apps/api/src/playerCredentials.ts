const passwordHashes = new Map<number, string>();

export function setPlayerPasswordHash(playerId: number, passwordHash: string) {
  passwordHashes.set(playerId, passwordHash);
}

export function getPlayerPasswordHash(playerId: number): string | undefined {
  return passwordHashes.get(playerId);
}
