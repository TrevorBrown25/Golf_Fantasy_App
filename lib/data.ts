import divisions from '../data/divisions.json';
import owners from '../data/owners.json';
import golfers from '../data/golfers.json';
import tournaments from '../data/tournaments.json';
import weeks from '../data/weeks.json';
import earnings from '../data/earnings.json';
import rulesMarkdown from '../data/rules.md?raw';
import type {
  Division,
  Owner,
  Golfer,
  Tournament,
  Week,
  Earnings as EarningsRecord
} from './types';

export const divisionsData = divisions as Division[];
export const ownersData = owners as Owner[];
export const golfersData = golfers as Golfer[];
export const tournamentsData = tournaments as Tournament[];
export const weeksData = weeks as Week[];
export const earningsData = earnings as EarningsRecord[];
export const rulesMarkdownData = rulesMarkdown as string;
