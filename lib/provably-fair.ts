import crypto from 'crypto';

/**
 * Generates a random server seed (64 hex characters)
 */
export function generateServerSeed(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Generates a random client seed (32 hex characters is standard, but can be anything)
 */
export function generateClientSeed(): string {
    // Defaults to 16 bytes -> 32 hex chars
    return crypto.randomBytes(16).toString('hex');
}

/**
 * Hashes the server seed using SHA256. This is what is shown to the user *before* the game.
 */
export function hashSeed(seed: string): string {
    return crypto.createHash('sha256').update(seed).digest('hex');
}

/**
 * Calculates the roll result (0 to 1, or scaled)
 * Using HMAC-SHA256(server_seed, client_seed + "-" + nonce)
 */
export function calculateRollResult(serverSeed: string, clientSeed: string, nonce: number): number {
    const message = `${clientSeed}-${nonce}`;
    const hmac = crypto.createHmac('sha256', serverSeed);
    hmac.update(message);
    const hex = hmac.digest('hex');

    // Take the first 8 characters (4 bytes) -> 32-bit integer
    // This is a standard way (CSGO Roll style or Stake style varies, but this is simple/safe)
    const subHex = hex.substring(0, 8);
    const decimal = parseInt(subHex, 16);

    // Max value of 8 hex chars is 0xFFFFFFFF = 4294967295
    const MAX_VAL = 0xFFFFFFFF;

    // Return a float between 0 and 1
    return decimal / (MAX_VAL + 1);
}

/**
 * Helper to get an item from a list based on weights and the fair roll result
 */
export function getWinningItem<T extends { probability: number }>(items: T[], roll: number): T {
    // roll is 0..1
    // items have probability. Sum should be roughly 100 or 1.
    // We assume probability is a percentage or raw weight. 
    // Let's assume normalizing to sum of weights.

    const totalWeight = items.reduce((sum, item) => sum + (item.probability || 0), 0);
    let currentThreshold = 0;
    const target = roll * totalWeight;

    for (const item of items) {
        currentThreshold += (item.probability || 0);
        if (target < currentThreshold) {
            return item;
        }
    }

    // Fallback
    return items[items.length - 1];
}
