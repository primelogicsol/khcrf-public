export const APPROVED_GOOGLE_MEET_URL = "https://meet.google.com/wyf-gryj-tre?authuser=1";

export function getEventMeetUrl(event?: { meetingUrl?: string; publicMeetingUrl?: string }): string {
  if (event?.publicMeetingUrl && event.publicMeetingUrl.trim().length > 0) {
    return event.publicMeetingUrl.trim();
  }
  if (event?.meetingUrl && event.meetingUrl.trim().length > 0) {
    return event.meetingUrl.trim();
  }
  return APPROVED_GOOGLE_MEET_URL;
}

export function getHearingTimeWindow(event: any) {
  const rawDate = event.date || event.scheduledDate;
  const hearingDate = rawDate ? new Date(rawDate) : null;
  
  // If the date is completely invalid, return nulls so we don't fall through incorrectly
  if (!hearingDate || isNaN(hearingDate.getTime())) {
    return { start: null, end: null, timeZone: event.timezone || 'Asia/Kolkata' };
  }

  // Start time: startAt or default 11:00 AM IST (05:30 UTC)
  let start = event.startAt ? new Date(event.startAt) : null;
  if (!start || isNaN(start.getTime())) {
    start = new Date(Date.UTC(hearingDate.getUTCFullYear(), hearingDate.getUTCMonth(), hearingDate.getUTCDate(), 5, 30, 0));
  }

  // End time: endAt or default 03:00 PM IST (09:30 UTC)
  let end = event.endAt ? new Date(event.endAt) : null;
  if (!end || isNaN(end.getTime())) {
    end = new Date(Date.UTC(hearingDate.getUTCFullYear(), hearingDate.getUTCMonth(), hearingDate.getUTCDate(), 9, 30, 0));
  }

  const timeZone = event.timezone || 'Asia/Kolkata';

  return { start, end, timeZone };
}

export type MeetButtonState = 
  | { status: 'HIDDEN' }
  | { status: 'BEFORE_WINDOW'; title: string; timeSubtitle: string; dateFormatted: string; label: string }
  | { status: 'ACTIVE'; title: string; timeSubtitle: string; url: string; label: string }
  | { status: 'AFTER_WINDOW'; title: string; timeSubtitle: string; label: string };

export function getMeetButtonState(event: any, nowOverride?: Date): MeetButtonState {
  if (!event) return { status: 'HIDDEN' };

  const type = (event.eventType || '').toUpperCase();
  if (type === 'SUBMISSION_DEADLINE') return { status: 'HIDDEN' };

  const status = (event.status || '').toUpperCase();
  const isPast = status === 'COMPLETED' || status === 'CANCELLED' || status === 'POSTPONED';
  
  let labelTitle = 'Online Session';
  let openLabel = 'Online Session Opens';
  let activeLabel = 'Join Online Session';
  let completedTitle = 'Session Completed';
  let timeStr = '11 AM–3 PM IST';

  if (type === 'PUBLIC_HEARING' || type === 'THEMATIC_CONSULTATION') {
    labelTitle = 'Online Hearing';
    openLabel = 'Online Hearing opens';
    activeLabel = 'Join Online Hearing';
    completedTitle = 'Hearing Completed';
  } else if (type === 'ORIENTATION') {
    labelTitle = 'Online Orientation';
    openLabel = 'Online Orientation opens';
    activeLabel = 'Join Online Orientation';
    completedTitle = 'Orientation Completed';
  } else if (type === 'DRAFT_REVIEW') {
    labelTitle = 'Online Review';
    openLabel = 'Online Review opens';
    activeLabel = 'Access Draft Review';
    completedTitle = 'Review Completed';
    timeStr = '';
  } else if (type === 'VALIDATION') {
    labelTitle = 'Validation Portal';
    openLabel = 'Validation Portal opens';
    activeLabel = 'Enter Validation Portal';
    completedTitle = 'Validation Closed';
    timeStr = '';
  } else if (type === 'EXPERT_REVIEW') {
    labelTitle = 'Expert Review Session';
    openLabel = 'Expert Review Session opens';
    activeLabel = 'Join Expert Review';
    completedTitle = 'Expert Review Completed';
  } else if (type === 'FINAL_PUBLICATION') {
    labelTitle = 'Report Published Online';
    openLabel = 'Report publishes';
    activeLabel = 'View Published Report';
    completedTitle = 'Report Published';
    timeStr = '';
  } else if (type === 'REGISTRATION' || type === 'PUBLIC_PARTICIPATION') {
    labelTitle = type === 'REGISTRATION' ? 'Online Registration' : 'Online Participation';
    openLabel = type === 'REGISTRATION' ? 'Registration opens' : 'Participation opens';
    activeLabel = type === 'REGISTRATION' ? 'Register Online' : 'Participate Online';
    completedTitle = type === 'REGISTRATION' ? 'Registration Closed' : 'Participation Closed';
    timeStr = '';
  }

  if (isPast) {
    return { 
      status: 'AFTER_WINDOW', 
      title: completedTitle, 
      timeSubtitle: type === 'REGISTRATION' || type === 'PUBLIC_PARTICIPATION' ? 'Window Closed' : 'Meeting Closed', 
      label: completedTitle
    };
  }

  const mode = (event.mode || '').toUpperCase();
  const venue = (event.venue || '').toLowerCase();

  const isOnlineOrHybrid = 
    mode === 'ONLINE' || mode === 'HYBRID' || mode === 'VIRTUAL' ||
    (mode !== 'IN PERSON' && mode !== 'IN_PERSON' && (venue.includes('online') || venue.includes('virtual')));

  if (!isOnlineOrHybrid && type !== 'REGISTRATION' && type !== 'PUBLIC_PARTICIPATION' && type !== 'DRAFT_REVIEW' && type !== 'VALIDATION' && type !== 'FINAL_PUBLICATION') {
    return { status: 'HIDDEN' };
  }

  const now = nowOverride || new Date();
  const { start, end } = getHearingTimeWindow(event);

  if (!start || !end) {
    return { status: 'HIDDEN' };
  }

  const rawDate = event.date || event.scheduledDate;
  const eventDateObj = new Date(rawDate);
  const isSameDay = 
    now.getUTCFullYear() === start.getUTCFullYear() &&
    now.getUTCMonth() === start.getUTCMonth() &&
    now.getUTCDate() === start.getUTCDate();

  const shortDate = eventDateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
  const fullDate = eventDateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

  // For long windows, check end date
  const isWindowType = type === 'REGISTRATION' || type === 'PUBLIC_PARTICIPATION' || type === 'DRAFT_REVIEW';
  let effectiveEnd = end;
  if (isWindowType && event.endDate) {
     effectiveEnd = new Date(event.endDate);
     effectiveEnd.setHours(23, 59, 59, 999);
  } else if (isWindowType) {
     effectiveEnd = new Date(eventDateObj);
     effectiveEnd.setMonth(effectiveEnd.getMonth() + 3); // Fallback long window
  }

  if (now < start) {
    if (isSameDay) {
      return {
        status: 'BEFORE_WINDOW',
        title: labelTitle,
        timeSubtitle: timeStr ? `Join Today • ${timeStr}` : 'Opens Today',
        dateFormatted: fullDate,
        label: `${openLabel} today`
      };
    }
    return {
      status: 'BEFORE_WINDOW',
      title: labelTitle,
      timeSubtitle: timeStr ? `Available on ${shortDate} • ${timeStr}` : `Opens on ${shortDate}`,
      dateFormatted: fullDate,
      label: `${openLabel} on ${fullDate}`
    };
  }

  if (now > effectiveEnd) {
    return { 
      status: 'AFTER_WINDOW', 
      title: completedTitle, 
      timeSubtitle: isWindowType ? 'Window Closed' : 'Meeting Closed', 
      label: completedTitle
    };
  }

  return {
    status: 'ACTIVE',
    title: isWindowType ? labelTitle : '🔴 LIVE NOW',
    timeSubtitle: timeStr || 'Currently Open',
    label: activeLabel,
    url: getEventMeetUrl(event)
  };
}

export function shouldShowMeetAction(event: any) {
  const buttonState = getMeetButtonState(event);
  return buttonState.status !== 'HIDDEN';
}


