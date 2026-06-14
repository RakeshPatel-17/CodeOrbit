import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = redisUrl && redisToken
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;

/**
 * Cache Wrapper: Checks Redis for the key first. If found, returns it.
 * If not, runs the fetchFn, stores the result in Redis, and returns it.
 * If Redis is not configured, it silently runs the fetchFn directly.
 */
export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  expireSeconds: number = 3600
): Promise<T> {
  if (!redis) {
    console.warn(`⚠️ Upstash Redis is not configured. Running direct fetch for key: ${key}`);
    return fetchFn();
  }

  try {
    const cachedValue = await redis.get<T>(key);
    if (cachedValue !== null) {
      return cachedValue;
    }

    const freshValue = await fetchFn();
    await redis.set(key, freshValue, { ex: expireSeconds });
    return freshValue;
  } catch (error) {
    console.error(`❌ Redis caching error for key ${key}:`, error);
    return fetchFn(); // Fall back to direct fetch on error
  }
}
