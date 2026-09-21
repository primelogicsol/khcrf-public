// No external tz libraries used

export function getHearingLifecycle(event: any, nowRaw: Date = new Date()) {
  const TIMEZONE = 'Asia/Kolkata';
  
  // Convert current time to a stable Asia/Kolkata date for comparison
  const now = new Date(new Date(nowRaw).toLocaleString('en-US', { timeZone: TIMEZONE }));
  
  // Parse event dates and convert them similarly if they exist
  const parseDate = (d?: string | Date) => {
    if (!d) return null;
    return new Date(new Date(d).toLocaleString('en-US', { timeZone: TIMEZONE }));
  };

  const hearingStartsAt = parseDate(event.hearingStartsAt || event.scheduledDate || event.date);
  const hearingEndsAt = parseDate(event.hearingEndsAt);

  // Registration canonical dates
  const registrationOpensAt = parseDate('2026-08-17T11:00:00'); // canonical
  let registrationClosesAt = null;

  if (hearingStartsAt) {
    // Closes 24 hours before hearing starts
    registrationClosesAt = new Date(hearingStartsAt.getTime() - (24 * 60 * 60 * 1000));
  }

  // Calculate Hearing Status
  let hearingStatus = 'SCHEDULED';
  if (hearingStartsAt) {
    if (event.status === 'CANCELLED') hearingStatus = 'CANCELLED';
    else if (event.status === 'POSTPONED') hearingStatus = 'POSTPONED';
    else if (now >= hearingStartsAt) {
      if (hearingEndsAt && now <= hearingEndsAt) hearingStatus = 'LIVE';
      else if (!hearingEndsAt && now.getTime() <= hearingStartsAt.getTime() + (4 * 60 * 60 * 1000)) hearingStatus = 'LIVE'; // Assume 4 hrs if no end time
      else hearingStatus = 'COMPLETED';
    } else {
      hearingStatus = 'SCHEDULED';
    }
  } else {
    hearingStatus = 'SCHEDULE_PENDING';
  }

  // Calculate Registration Status
  let registrationStatus = 'REGISTRATION_NOT_OPEN';
  if (registrationOpensAt && registrationClosesAt) {
    if (now < registrationOpensAt) {
      registrationStatus = 'REGISTRATION_NOT_OPEN';
    } else if (now >= registrationClosesAt) {
      registrationStatus = 'REGISTRATION_CLOSED';
    } else {
      const msUntilClose = registrationClosesAt.getTime() - now.getTime();
      const hoursUntilClose = msUntilClose / (1000 * 60 * 60);
      if (hoursUntilClose <= 72) {
        registrationStatus = 'CLOSING_SOON';
      } else {
        registrationStatus = 'OPEN';
      }
    }
  }

  // Derived booleans
  const canRegister = registrationStatus === 'OPEN' || registrationStatus === 'CLOSING_SOON';
  
  // Testimony window - evidence continues 72h after hearing (if we want to model it)
  // But let's stick to the prompt.
  let testimonyClosesAt = null;
  if (hearingStartsAt) {
    testimonyClosesAt = new Date(hearingStartsAt.getTime() + (72 * 60 * 60 * 1000));
  }
  let testimonyStatus = 'CLOSED';
  if (registrationOpensAt && testimonyClosesAt) {
    if (now >= registrationOpensAt && now < testimonyClosesAt) {
      testimonyStatus = 'OPEN';
    }
  }
  const canSubmitEvidence = testimonyStatus === 'OPEN';
  const canJoin = hearingStatus === 'LIVE';

  // Display status (a legacy field some UI components might use)
  let displayStatus = hearingStatus;

  return {
    ...event,
    hearingStartsAt,
    hearingEndsAt,
    registrationOpensAt,
    registrationClosesAt,
    testimonyClosesAt,
    hearingStatus,
    registrationStatus,
    testimonyStatus,
    canRegister,
    canSubmitEvidence,
    canJoin,
    displayStatus,
    // Add compatibility properties for previous filter logic
    registrationClosingSoon: registrationStatus === 'CLOSING_SOON'
  };
}
