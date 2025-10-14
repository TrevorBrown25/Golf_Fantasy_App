import {
  applySave,
  applyTiebreakers,
  computeStandings,
  computeWeeklyResult,
  escalateAndResolveAbsent,
  fallbackFieldAutoplays,
  grantPlayoffSaves,
  isProhibited,
  runCalcuttaAuction,
  seedPlayoffs
} from '@/lib/rules';
import type { Pick, StandingsRow, AuctionBid } from '@/lib/types';

const demoPicks: Pick[] = [
  { weekId: 'week-01', ownerId: 'bryce', golferId: 'g001', usageNumber: 1 },
  { weekId: 'week-01', ownerId: 'tl', golferId: 'g002', usageNumber: 1 },
  { weekId: 'week-02', ownerId: 'bryce', golferId: 'g001', usageNumber: 2 },
  { weekId: 'week-03', ownerId: 'bryce', golferId: 'g001', usageNumber: 3 }
];

describe('usage caps and saves', () => {
  it('flags prohibited picks once limit reached', () => {
    expect(isProhibited('bryce', 'g001', demoPicks)).toBe(true);
    expect(isProhibited('tl', 'g002', demoPicks)).toBe(false);
  });

  it('applies save only when usage maxed', () => {
    expect(() => applySave('tl', 'g002', demoPicks)).toThrow('Save can only be applied once a golfer is capped');
    expect(applySave('bryce', 'g001', demoPicks, 0)).toBe(1);
  });
});

describe('absent owner escalation', () => {
  it('produces forfeits with field fallbacks', () => {
    const result = escalateAndResolveAbsent('week-01', 'bryce', demoPicks);
    expect(result.status).toBe('FORFEIT');
    expect(result.fallbackGolferIds.length).toBeGreaterThan(0);
  });
});

describe('standings and tiebreakers', () => {
  it('ranks owners with head-to-head preference', () => {
    const standings: StandingsRow[] = [
      { ownerId: 'bryce', divisionId: 'RIGHT_SHARKS', wins: 3, losses: 1, seasonEarnings: 1200000 },
      { ownerId: 'tl', divisionId: 'RIGHT_SHARKS', wins: 3, losses: 1, seasonEarnings: 900000 }
    ];
    const ordered = applyTiebreakers(standings, demoPicks);
    expect(ordered[0].ownerId).toBe('bryce');
  });
});

describe('playoff seeding', () => {
  it('assigns seeds with save grants', () => {
    const standings: StandingsRow[] = [
      { ownerId: 'bryce', divisionId: 'RIGHT_SHARKS', wins: 8, losses: 2, seasonEarnings: 5000000 },
      { ownerId: 'tl', divisionId: 'RIGHT_SHARKS', wins: 6, losses: 4, seasonEarnings: 4200000 },
      { ownerId: 'nick', divisionId: 'LEFT_SHARKS', wins: 7, losses: 3, seasonEarnings: 4300000 },
      { ownerId: 'travis', divisionId: 'LEFT_SHARKS', wins: 5, losses: 5, seasonEarnings: 4100000 }
    ];
    const seeds = grantPlayoffSaves(seedPlayoffs(standings, demoPicks));
    expect(seeds.length).toBe(4);
    expect(seeds[0].seed).toBe(1);
    expect(seeds[0].savedPlaysGranted).toBe(4);
  });
});

describe('calcutta auction', () => {
  it('respects budgets and resolves ties with marble race', () => {
    const bids: AuctionBid[] = [
      { ownerId: 'bryce', golferId: 'g001', amount: 100 },
      { ownerId: 'tl', golferId: 'g001', amount: 100 },
      { ownerId: 'nick', golferId: 'g002', amount: 80 }
    ];
    const winners = runCalcuttaAuction({
      bids,
      budgets: { bryce: 100, tl: 100, nick: 100 },
      rosters: { bryce: [], tl: [], nick: [] },
      maxRoster: 8
    });
    const totalRostered = winners.reduce((acc, roster) => acc + roster.golferIds.length, 0);
    expect(totalRostered).toBeGreaterThan(0);
  });
});

it('computes weekly result totals', () => {
  const result = computeWeeklyResult('week-01', demoPicks);
  expect(result.week.id).toBe('week-01');
  expect(result.homeScore).toBeGreaterThanOrEqual(0);
});

it('fallbacks select highest ranked golfers', () => {
  const fallbacks = fallbackFieldAutoplays('week-01', 'tl', demoPicks);
  expect(fallbacks.length).toBeGreaterThan(0);
});
