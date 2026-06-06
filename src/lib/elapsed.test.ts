import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Timestamp } from 'firebase/firestore'
import { formatElapsed } from './elapsed'

const NOW = 1_700_000_000_000

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('formatElapsed', () => {
  it('returns Never for undefined', () => {
    expect(formatElapsed(undefined)).toBe('Never')
  })

  it('returns just now when elapsed < 60s', () => {
    const ts = Timestamp.fromMillis(NOW - 30_000)
    expect(formatElapsed(ts)).toBe('just now')
  })

  it('returns just now at exactly 0ms elapsed', () => {
    const ts = Timestamp.fromMillis(NOW)
    expect(formatElapsed(ts)).toBe('just now')
  })

  it('returns just now at 59_999ms elapsed', () => {
    const ts = Timestamp.fromMillis(NOW - 59_999)
    expect(formatElapsed(ts)).toBe('just now')
  })

  it('returns 0h 1m ago at exactly 60s', () => {
    const ts = Timestamp.fromMillis(NOW - 60_000)
    expect(formatElapsed(ts)).toBe('0h 1m ago')
  })

  it('returns 0h 45m ago for 45min elapsed', () => {
    const ts = Timestamp.fromMillis(NOW - 2_700_000)
    expect(formatElapsed(ts)).toBe('0h 45m ago')
  })

  it('returns 2h 30m ago for 2h30min elapsed', () => {
    const ts = Timestamp.fromMillis(NOW - 9_000_000)
    expect(formatElapsed(ts)).toBe('2h 30m ago')
  })

  it('returns 14h 0m ago for exactly 14h elapsed', () => {
    const ts = Timestamp.fromMillis(NOW - 50_400_000)
    expect(formatElapsed(ts)).toBe('14h 0m ago')
  })

  it('returns 27h 0m ago for 27h elapsed (no day conversion)', () => {
    const ts = Timestamp.fromMillis(NOW - 97_200_000)
    expect(formatElapsed(ts)).toBe('27h 0m ago')
  })
})
