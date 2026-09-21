/**
 * SKC Hearing Lifecycle Service — Backend
 * Mirrors frontend/src/lib/hearingLifecycle.ts exactly.
 * Keep these two files in sync. Eventually merge into a shared package.
 */

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export const PROGRAMME_REGISTRATION_OPENS_AT = new Date('2026-08-17T00:00:00+05:30');
const CLOSING_SOON_MS = 72 * 60 * 60 * 1000;

function parseDate(v: any): Date | null {
  if (!v) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export type DisplayStatus =
  | 'REGISTRATION_NOT_OPEN' | 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSING_SOON'
  | 'REGISTRATION_CLOSED' | 'LIVE' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED' | 'SCHEDULE_PENDING';

export interface HearingLifecycle {
  displayStatus: DisplayStatus;
  registrationStatus: string;
  registrationOpensAt: Date | null;
  registrationClosesAt: Date | null;
  hearingStatus: string;
  hearingStartsAt: Date | null;
  hearingEndsAt: Date | null;
  testimonyStatus: string;
  testimonyOpensAt: Date | null;
  testimonyClosesAt: Date | null;
  canRegister: boolean;
  canSubmitEvidence: boolean;
  canRequestLateSubmission: boolean;
  canJoin: boolean;
  registrationClosingSoon: boolean;
}

export function getHearingLifecycle(hearing: any, now: Date = new Date()): HearingLifecycle {
  // Overrides
  if (hearing.statusOverride === 'CANCELLED') return makeOverride('CANCELLED', hearing);
  if (hearing.statusOverride === 'POSTPONED') return makeOverride('POSTPONED', hearing);

  // Resolve canonical timestamps — prefer explicit fields, fall back to legacy
  let hearingStartsAt: Date | null = parseDate(hearing.hearingStartsAt);
  if (!hearingStartsAt) hearingStartsAt = parseDate(hearing.startAt);
  if (!hearingStartsAt) hearingStartsAt = parseDate(hearing.date);
  if (!hearingStartsAt && hearing.scheduledDate) {
    hearingStartsAt = new Date(`${hearing.scheduledDate}T11:00:00+05:30`);
  }

  let hearingEndsAt: Date | null = parseDate(hearing.hearingEndsAt);
  if (!hearingEndsAt) hearingEndsAt = parseDate(hearing.endAt);
  if (!hearingEndsAt && hearingStartsAt) {
    hearingEndsAt = new Date(hearingStartsAt.getTime() + 4 * 60 * 60 * 1000); // 11am–3pm default
  }

  const registrationOpensAt: Date =
    parseDate(hearing.registrationOpensAt) ?? PROGRAMME_REGISTRATION_OPENS_AT;

  const registrationClosesAt: Date | null =
    parseDate(hearing.registrationClosesAt) ??
    (hearingStartsAt ? new Date(hearingStartsAt.getTime() - 24 * 60 * 60 * 1000) : null);

  const testimonyOpensAt: Date | null =
    parseDate(hearing.testimonyOpensAt) ?? hearingStartsAt;

  const testimonyClosesAt: Date | null =
    parseDate(hearing.testimonyClosesAt) ??
    (hearingEndsAt ? new Date(hearingEndsAt.getTime() + 72 * 60 * 60 * 1000) : null);

  // No date confirmed
  if (!hearingStartsAt) {
    return {
      displayStatus: 'SCHEDULE_PENDING',
      registrationStatus: 'REGISTRATION_NOT_OPEN',
      registrationOpensAt,
      registrationClosesAt,
      hearingStatus: 'SCHEDULED',
      hearingStartsAt: null,
      hearingEndsAt: null,
      testimonyStatus: 'NOT_OPEN',
      testimonyOpensAt: null,
      testimonyClosesAt: null,
      canRegister: false, canSubmitEvidence: false,
      canRequestLateSubmission: false, canJoin: false, registrationClosingSoon: false,
    };
  }

  const ts = now.getTime();

  // Registration
  let registrationStatus: string;
  let canRegister = false;
  let registrationClosingSoon = false;

  if (ts < registrationOpensAt.getTime()) {
    registrationStatus = 'REGISTRATION_NOT_OPEN';
  } else if (registrationClosesAt && ts >= registrationClosesAt.getTime()) {
    registrationStatus = 'REGISTRATION_CLOSED';
  } else if (registrationClosesAt && ts >= registrationClosesAt.getTime() - CLOSING_SOON_MS) {
    registrationStatus = 'REGISTRATION_CLOSING_SOON';
    canRegister = true;
    registrationClosingSoon = true;
  } else {
    registrationStatus = 'REGISTRATION_OPEN';
    canRegister = true;
  }

  // Hearing
  let hearingStatus: string;
  let canJoin = false;

  if (ts < hearingStartsAt.getTime()) {
    hearingStatus = 'SCHEDULED';
  } else if (hearingEndsAt && ts <= hearingEndsAt.getTime()) {
    hearingStatus = 'LIVE';
    canJoin = true;
  } else {
    hearingStatus = 'COMPLETED';
  }

  // Testimony
  let testimonyStatus = 'NOT_OPEN';
  let canSubmitEvidence = false;
  let canRequestLateSubmission = false;

  if (testimonyOpensAt && testimonyClosesAt) {
    if (ts < testimonyOpensAt.getTime()) {
      // Pre-submission: allowed before hearing if registration is open
      canSubmitEvidence = canRegister;
    } else if (ts <= testimonyClosesAt.getTime()) {
      testimonyStatus = hearingStatus === 'COMPLETED' ? 'OPEN_POST_HEARING' : 'OPEN';
      canSubmitEvidence = true;
    } else {
      testimonyStatus = 'CLOSED';
      canRequestLateSubmission = hearing.allowLateSubmission !== false;
    }
  }

  // Display status
  let displayStatus: DisplayStatus;
  if (hearingStatus === 'COMPLETED') {
    displayStatus = 'COMPLETED';
  } else if (hearingStatus === 'LIVE') {
    displayStatus = 'LIVE';
  } else {
    const map: Record<string, DisplayStatus> = {
      'REGISTRATION_NOT_OPEN': 'REGISTRATION_NOT_OPEN',
      'REGISTRATION_OPEN': 'REGISTRATION_OPEN',
      'REGISTRATION_CLOSING_SOON': 'REGISTRATION_CLOSING_SOON',
      'REGISTRATION_CLOSED': 'REGISTRATION_CLOSED',
    };
    displayStatus = map[registrationStatus] ?? 'REGISTRATION_NOT_OPEN';
  }

  return {
    displayStatus,
    registrationStatus,
    registrationOpensAt,
    registrationClosesAt,
    hearingStatus,
    hearingStartsAt,
    hearingEndsAt,
    testimonyStatus,
    testimonyOpensAt,
    testimonyClosesAt,
    canRegister,
    canSubmitEvidence,
    canRequestLateSubmission,
    canJoin,
    registrationClosingSoon,
  };
}

function makeOverride(type: 'CANCELLED' | 'POSTPONED', hearing: any): HearingLifecycle {
  const hearingStartsAt = parseDate(hearing.hearingStartsAt ?? hearing.startAt ?? hearing.date);
  const hearingEndsAt = parseDate(hearing.hearingEndsAt ?? hearing.endAt);
  return {
    displayStatus: type,
    registrationStatus: 'REGISTRATION_CLOSED',
    hearingStatus: type,
    testimonyStatus: type === 'CANCELLED' ? 'CLOSED' : 'NOT_OPEN',
    registrationOpensAt: parseDate(hearing.registrationOpensAt) ?? PROGRAMME_REGISTRATION_OPENS_AT,
    registrationClosesAt: null,
    hearingStartsAt,
    hearingEndsAt,
    testimonyOpensAt: null,
    testimonyClosesAt: null,
    canRegister: false,
    canSubmitEvidence: false,
    canRequestLateSubmission: false,
    canJoin: false,
    registrationClosingSoon: false,
  };
}

export const DISPLAY_STATUS_LABEL: Record<DisplayStatus, string> = {
  REGISTRATION_NOT_OPEN:    'Registration Not Open',
  REGISTRATION_OPEN:        'Registration Open',
  REGISTRATION_CLOSING_SOON: 'Registration Closing Soon',
  REGISTRATION_CLOSED:      'Registration Closed',
  LIVE:                     'Live · In Session',
  COMPLETED:                'Completed',
  POSTPONED:                'Postponed',
  CANCELLED:                'Cancelled',
  SCHEDULE_PENDING:         'Schedule Pending',
};
