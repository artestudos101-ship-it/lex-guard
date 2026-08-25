export function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function jitter(base: number, spread = 200): number {
  return base + Math.floor(Math.random() * spread)
}
