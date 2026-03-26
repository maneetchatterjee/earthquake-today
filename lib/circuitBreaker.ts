const FAILURE_THRESHOLD = 5;
const COOLDOWN_MS = 30_000;

type State = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitOpenError extends Error {
  constructor(domain: string) {
    super(`Circuit breaker OPEN for ${domain}`);
    this.name = 'CircuitOpenError';
  }
}

class CircuitBreaker {
  private state: State = 'CLOSED';
  private failures = 0;
  private openedAt = 0;

  constructor(private readonly domain: string) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt >= COOLDOWN_MS) {
        this.state = 'HALF_OPEN';
      } else {
        throw new CircuitOpenError(this.domain);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    if (this.failures >= FAILURE_THRESHOLD) {
      this.state = 'OPEN';
      this.openedAt = Date.now();
    }
  }
}

const breakers = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(domain: string): CircuitBreaker {
  let breaker = breakers.get(domain);
  if (!breaker) {
    breaker = new CircuitBreaker(domain);
    breakers.set(domain, breaker);
  }
  return breaker;
}
