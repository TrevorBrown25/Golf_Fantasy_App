'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CalcuttaRoster,
  OwnerId,
  Pick,
  SaveCredit,
  WeekId,
  AuctionBid
} from '@/lib/types';

interface EscalationEntry {
  weekId: WeekId;
  willingOwnerId: OwnerId;
  timestamp: string;
  resolved: boolean;
}

interface LeagueState {
  picks: Pick[];
  saveCredits: SaveCredit[];
  pendingSaveApplications: Record<string, OwnerId>;
  escalationLog: EscalationEntry[];
  calcuttaBids: AuctionBid[];
  calcuttaRosters: CalcuttaRoster[];
  applyPick: (pick: Pick) => void;
  applySaveCredit: (credit: SaveCredit) => void;
  logEscalation: (entry: Omit<EscalationEntry, 'timestamp' | 'resolved'>) => void;
  resolveEscalation: (weekId: WeekId) => void;
  setCalcuttaRoster: (roster: CalcuttaRoster) => void;
  upsertBid: (bid: AuctionBid) => void;
  clearState: () => void;
}

const useLeagueStore = create<LeagueState>()(
  persist(
    (set) => ({
      picks: [],
      saveCredits: [],
      pendingSaveApplications: {},
      escalationLog: [],
      calcuttaBids: [],
      calcuttaRosters: [],
      applyPick: (pick) =>
        set((state) => ({
          picks: state.picks.filter((p) => !(p.weekId === pick.weekId && p.ownerId === pick.ownerId && p.golferId === pick.golferId)).concat(pick)
        })),
      applySaveCredit: (credit) =>
        set((state) => ({
          saveCredits: state.saveCredits
            .filter(
              (existing) =>
                !(
                  existing.ownerId === credit.ownerId &&
                  existing.weekIdEarned === credit.weekIdEarned &&
                  existing.appliedToGolferId === credit.appliedToGolferId
                )
            )
            .concat(credit)
        })),
      logEscalation: ({ weekId, willingOwnerId }) =>
        set((state) => ({
          escalationLog: state.escalationLog.concat({
            weekId,
            willingOwnerId,
            timestamp: new Date().toISOString(),
            resolved: false
          })
        })),
      resolveEscalation: (weekId) =>
        set((state) => ({
          escalationLog: state.escalationLog.map((entry) =>
            entry.weekId === weekId ? { ...entry, resolved: true } : entry
          )
        })),
      setCalcuttaRoster: (roster) =>
        set((state) => {
          const remaining = state.calcuttaRosters.filter((r) => r.ownerId !== roster.ownerId);
          return { calcuttaRosters: remaining.concat(roster) };
        }),
      upsertBid: (bid) =>
        set((state) => {
          const filtered = state.calcuttaBids.filter(
            (entry) => !(entry.ownerId === bid.ownerId && entry.golferId === bid.golferId)
          );
          return { calcuttaBids: filtered.concat(bid) };
        }),
      clearState: () =>
        set({
          picks: [],
          saveCredits: [],
          pendingSaveApplications: {},
          escalationLog: [],
          calcuttaBids: [],
          calcuttaRosters: []
        })
    }),
    {
      name: 'mhs-golf-dayz-state'
    }
  )
);

export default useLeagueStore;
