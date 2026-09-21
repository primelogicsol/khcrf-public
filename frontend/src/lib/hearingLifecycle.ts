/**
 * SKC Hearing Lifecycle Service
 * ─────────────────────────────
 * Single source of truth for all hearing lifecycle state.
 * Used by: backend API, frontend card renderer, participation page,
 *          testimony page, admin dashboard, tests.
 *
 * All timestamps are compared in Asia/Kolkata (IST, UTC+5:30).
 * Never use raw Date comparisons without IST normalization.
 */

export type RegistrationStatus =
  | 'REGISTRATION_NOT_OPEN'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSING_SOON'
  | 'REGISTRATION_CLOSED';

export type HearingStatus =
  | 'SCHEDULED'
  | 'LIVE'
  | 'COMPLETED'
  | 'POSTPONED'
  | 'CANCELLED';

export type TestimonyStatus =
  | 'NOT_OPEN'
  | 'OPEN'
  | 'OPEN_POST_HEARING'
  | 'CLOSED';

export type DisplayStatus =
  | 'REGISTRATION_NOT_OPEN'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSING_SOON'
  | 'REGISTRATION_CLOSED'
  | 'LIVE'
  | 'COMPLETED'
  | 'POSTPONED'
  | 'CANCELLED'
  | 'SCHEDULE_PENDING';

export interface HearingLifecycle {
  /** Primary status shown on cards and badges */
  displayStatus: DisplayStatus;

  /** Registration window */
  registrationStatus: RegistrationStatus;
  registrationOpensAt: Date | null;
  registrationClosesAt: Date | null;

  /** Hearing window */
  hearingStatus: HearingStatus;
  hearingStartsAt: Date | null;
  hearingEndsAt: Date | null;

  /** Testimony / evidence window */
  testimonyStatus: TestimonyStatus;
  testimonyOpensAt: Date | null;
  testimonyClosesAt: Date | null;

  /** CTA capabilities */
  canRegister: boolean;
  canSubmitEvidence: boolean;
  canRequestLateSubmission: boolean;
  canJoin: boolean;
  registrationClosingSoon: boolean;
}

/**
 * IST_OFFSET_MS — Asia/Kolkata is UTC+5:30 fixed offset.
 * Using a fixed offset is safe for this domain (IST does not observe DST).
 */
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/** Return current time shifted to IST for date-string comparison */
export function nowIST(now: Date = new Date()): Date {
  return new Date(now.getTime() + IST_OFFSET_MS);
}

/** ISO date string YYYY-MM-DD in IST for a UTC Date */
export function toISTDateString(d: Date): string {
  return new Date(d.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** Parse a date that may be a Date object, ISO string, or null */
function parseDate(v: Date | string | null | undefined): Date | null {
  if (!v) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  const d = new Date(v as string);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Canonical registration open time = 17 August 2026 00:00:00 IST
 * This is the programme-wide default when no per-hearing override is stored.
 */
export const PROGRAMME_REGISTRATION_OPENS_AT = new Date('2026-08-17T00:00:00+05:30');

/**
 * Default: registration closes 24 hours before hearing start (IST)
 */
export function defaultRegistrationClosesAt(hearingStartsAt: Date): Date {
  return new Date(hearingStartsAt.getTime() - 24 * 60 * 60 * 1000);
}

/**
 * Default: testimony opens when hearing starts
 */
export function defaultTestimonyOpensAt(hearingStartsAt: Date): Date {
  return hearingStartsAt;
}

/**
 * Default: testimony closes 72 hours after hearing ends (IST)
 */
export function defaultTestimonyClosesAt(hearingEndsAt: Date): Date {
  return new Date(hearingEndsAt.getTime() + 72 * 60 * 60 * 1000);
}

/**
 * REGISTRATION_CLOSING_SOON threshold = 72 hours before close
 */
const CLOSING_SOON_THRESHOLD_MS = 72 * 60 * 60 * 1000;

/**
 * getHearingLifecycle
 * ───────────────────
 * Pure function — deterministic given (hearing, now).
 * All frontend surfaces and API responses must call this, never derive state independently.
 *
 * @param hearing   - Canonical hearing record with timestamp fields
 * @param now       - Current UTC time (defaults to new Date())
 */
export function getHearingLifecycle(
  hearing: {
    hearingStartsAt?: Date | string | null;
    hearingEndsAt?: Date | string | null;
    registrationOpensAt?: Date | string | null;
    registrationClosesAt?: Date | string | null;
    testimonyOpensAt?: Date | string | null;
    testimonyClosesAt?: Date | string | null;
    statusOverride?: string | null;
    allowLateSubmission?: boolean;
    // Legacy field fallbacks
    date?: Date | string | null;
    startAt?: Date | string | null;
    endAt?: Date | string | null;
    scheduledDate?: string | null;
  },
  now: Date = new Date()
): HearingLifecycle {
  // ── Override shortcuts ────────────────────────────────────────────────────
  if (hearing.statusOverride === 'CANCELLED') {
    return cancelled(hearing, now);
  }
  if (hearing.statusOverride === 'POSTPONED') {
    return postponed(hearing, now);
  }

  // ── Resolve canonical timestamps ─────────────────────────────────────────
  // hearingStartsAt: prefer explicit field, fall back to date/startAt/scheduledDate
  let hearingStartsAt = parseDate(hearing.hearingStartsAt);
  if (!hearingStartsAt) hearingStartsAt = parseDate(hearing.startAt);
  if (!hearingStartsAt) hearingStartsAt = parseDate(hearing.date);
  if (!hearingStartsAt && hearing.scheduledDate) {
    // scheduledDate is a YYYY-MM-DD string in IST — treat as 11:00 AM IST
    hearingStartsAt = new Date(`${hearing.scheduledDate}T11:00:00+05:30`);
  }

  // hearingEndsAt: default to hearingStartsAt + 4 hours (11am–3pm IST standard)
  let hearingEndsAt = parseDate(hearing.hearingEndsAt);
  if (!hearingEndsAt && hearingStartsAt) {
    hearingEndsAt = parseDate(hearing.endAt);
  }
  if (!hearingEndsAt && hearingStartsAt) {
    hearingEndsAt = new Date(hearingStartsAt.getTime() + 4 * 60 * 60 * 1000);
  }

  // registrationOpensAt: default to programme-wide Aug 17
  const registrationOpensAt = parseDate(hearing.registrationOpensAt) ?? PROGRAMME_REGISTRATION_OPENS_AT;

  // registrationClosesAt: default to 24h before hearing start
  const registrationClosesAt =
    parseDate(hearing.registrationClosesAt) ??
    (hearingStartsAt ? defaultRegistrationClosesAt(hearingStartsAt) : null);

  // testimonyOpensAt: default to hearing start
  const testimonyOpensAt =
    parseDate(hearing.testimonyOpensAt) ??
    (hearingStartsAt ? defaultTestimonyOpensAt(hearingStartsAt) : null);

  // testimonyClosesAt: default to 72h after hearing end
  const testimonyClosesAt =
    parseDate(hearing.testimonyClosesAt) ??
    (hearingEndsAt ? defaultTestimonyClosesAt(hearingEndsAt) : null);

  // ── Date not confirmed (no hearingStartsAt) ───────────────────────────────
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
      canRegister: false,
      canSubmitEvidence: false,
      canRequestLateSubmission: false,
      canJoin: false,
      registrationClosingSoon: false,
    };
  }

  // ── State computation ─────────────────────────────────────────────────────
  const ts = now.getTime();

  // Registration status
  let registrationStatus: RegistrationStatus;
  let canRegister = false;
  let registrationClosingSoon = false;

  if (ts < registrationOpensAt.getTime()) {
    registrationStatus = 'REGISTRATION_NOT_OPEN';
  } else if (registrationClosesAt && ts >= registrationClosesAt.getTime()) {
    registrationStatus = 'REGISTRATION_CLOSED';
  } else if (registrationClosesAt && ts >= registrationClosesAt.getTime() - CLOSING_SOON_THRESHOLD_MS) {
    registrationStatus = 'REGISTRATION_CLOSING_SOON';
    canRegister = true;
    registrationClosingSoon = true;
  } else {
    registrationStatus = 'REGISTRATION_OPEN';
    canRegister = true;
  }

  // Hearing status
  let hearingStatus: HearingStatus;
  let canJoin = false;

  if (ts < hearingStartsAt.getTime()) {
    hearingStatus = 'SCHEDULED';
  } else if (hearingEndsAt && ts <= hearingEndsAt.getTime()) {
    hearingStatus = 'LIVE';
    canJoin = true;
  } else {
    hearingStatus = 'COMPLETED';
  }

  // Testimony status
  let testimonyStatus: TestimonyStatus = 'NOT_OPEN';
  let canSubmitEvidence = false;
  let canRequestLateSubmission = false;

  if (testimonyOpensAt && testimonyClosesAt) {
    if (ts < testimonyOpensAt.getTime()) {
      // Before hearing — pre-submission still allowed (window opens at hearing start)
      // but formally the testimony window hasn't opened yet
      testimonyStatus = 'NOT_OPEN';
      // Pre-submission allowed: evidence may be submitted before hearing
      canSubmitEvidence = registrationStatus !== 'REGISTRATION_NOT_OPEN';
    } else if (ts <= testimonyClosesAt.getTime()) {
      testimonyStatus = hearingStatus === 'COMPLETED' ? 'OPEN_POST_HEARING' : 'OPEN';
      canSubmitEvidence = true;
    } else {
      testimonyStatus = 'CLOSED';
      canRequestLateSubmission = hearing.allowLateSubmission !== false; // default allow
    }
  }

  // Display status — the single public-facing badge value
  let displayStatus: DisplayStatus;

  if (hearingStatus === 'COMPLETED') {
    displayStatus = 'COMPLETED';
  } else if (hearingStatus === 'LIVE') {
    displayStatus = 'LIVE';
  } else {
    // Hearing is scheduled — derive from registration state
    switch (registrationStatus) {
      case 'REGISTRATION_NOT_OPEN':    displayStatus = 'REGISTRATION_NOT_OPEN'; break;
      case 'REGISTRATION_OPEN':        displayStatus = 'REGISTRATION_OPEN'; break;
      case 'REGISTRATION_CLOSING_SOON': displayStatus = 'REGISTRATION_CLOSING_SOON'; break;
      case 'REGISTRATION_CLOSED':      displayStatus = 'REGISTRATION_CLOSED'; break;
    }
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

// ── Override helpers ─────────────────────────────────────────────────────────

function baseOverride(hearing: any, now: Date) {
  const hearingStartsAt = parseDate(hearing.hearingStartsAt ?? hearing.startAt ?? hearing.date);
  const hearingEndsAt = parseDate(hearing.hearingEndsAt ?? hearing.endAt);
  return {
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

function cancelled(hearing: any, now: Date): HearingLifecycle {
  return {
    displayStatus: 'CANCELLED',
    registrationStatus: 'REGISTRATION_CLOSED',
    hearingStatus: 'CANCELLED',
    testimonyStatus: 'CLOSED',
    ...baseOverride(hearing, now),
  };
}

function postponed(hearing: any, now: Date): HearingLifecycle {
  return {
    displayStatus: 'POSTPONED',
    registrationStatus: 'REGISTRATION_CLOSED',
    hearingStatus: 'POSTPONED',
    testimonyStatus: 'NOT_OPEN',
    ...baseOverride(hearing, now),
  };
}

// ── Display helpers ──────────────────────────────────────────────────────────

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

export const DISPLAY_STATUS_BADGE: Record<DisplayStatus, string> = {
  REGISTRATION_NOT_OPEN:    'bg-gray-50 text-gray-400 border-gray-200',
  REGISTRATION_OPEN:        'bg-green-50 text-green-700 border-green-200',
  REGISTRATION_CLOSING_SOON: 'bg-amber-50 text-amber-700 border-amber-200',
  REGISTRATION_CLOSED:      'bg-gray-100 text-gray-500 border-gray-200',
  LIVE:                     'bg-brand-primary text-white border-brand-primary animate-pulse',
  COMPLETED:                'bg-gray-100 text-gray-500 border-gray-200',
  POSTPONED:                'bg-orange-50 text-orange-700 border-orange-200',
  CANCELLED:                'bg-red-50 text-red-600 border-red-200',
  SCHEDULE_PENDING:         'bg-amber-50 text-amber-700 border-amber-200',
};

/** Format an IST date for display: "19 Sep 2026, 11:00 AM IST" */
export function formatISTDateTime(d: Date | null): string {
  if (!d) return 'To be confirmed';
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).replace(',', '') + ' IST';
}

/** Format IST date only: "19 Sep 2026" */
export function formatISTDate(d: Date | null): string {
  if (!d) return 'To be confirmed';
  return d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
