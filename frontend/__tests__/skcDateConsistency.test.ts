import { SKC_2026_SCHEDULE, SkcEventType } from '../src/config/skcSchedule';
import { getProgrammeBoundary } from '../src/lib/skc/timeline';

describe('SKC 2026 Date Consistency Validation', () => {

  it('1. Cannot render 21 December for final report', () => {
    expect(SKC_2026_SCHEDULE.finalPublication.date).not.toBe('2026-12-21');
  });

  it('2. Cannot render 31 October for public hearing conclusion', () => {
    expect(SKC_2026_SCHEDULE.publicHearings.end).not.toBe('2026-10-31');
  });

  it('3. Cannot render generic "December 2026" fallback without specific day', () => {
    expect(SKC_2026_SCHEDULE.finalPublication.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(SKC_2026_SCHEDULE.finalPublication.date).toBe('2026-12-29');
  });

  it('4. Cannot render 1 September for consultation opening', () => {
    expect(SKC_2026_SCHEDULE.publicParticipation.start).not.toBe('2026-09-01');
  });

  it('5. Must use 29 December for final report', () => {
    expect(SKC_2026_SCHEDULE.finalPublication.date).toBe('2026-12-29');
  });

  it('6. Public hearings must explicitly end on 21 November', () => {
    expect(SKC_2026_SCHEDULE.publicHearings.end).toBe('2026-11-21');
  });

  it('7. Written testimony closes on 28 November', () => {
    expect(SKC_2026_SCHEDULE.closingThematicConsultation.date).toBe('2026-11-28');
  });

  it('8. Registration logic must use boundaries, not hardcoded strings', () => {
    expect(SKC_2026_SCHEDULE.stakeholderRegistration.start).toBe('2026-08-17');
    expect(SKC_2026_SCHEDULE.stakeholderRegistration.end).toBe('2026-11-28');
  });

  it('9. 16 December (Expert review) must be respected', () => {
    expect(SKC_2026_SCHEDULE.expertReview.date).toBe('2026-12-16');
  });

  it('10. 28 November is an THEMATIC_CONSULTATION', () => {
    expect(SKC_2026_SCHEDULE.closingThematicConsultation.type).toBe('THEMATIC_CONSULTATION');
  });

  it('11. 17 August is the single source of truth for public availability', () => {
    expect(SKC_2026_SCHEDULE.publicParticipation.start).toBe('2026-08-17');
    expect(SKC_2026_SCHEDULE.stakeholderRegistration.start).toBe('2026-08-17');
  });

  it('12. Submissions remain open through 23:59:59 IST on 28 November', () => {
    const endBoundary = getProgrammeBoundary(SKC_2026_SCHEDULE.closingThematicConsultation.date, true);
    
    expect(endBoundary.toISOString()).toBe(new Date('2026-11-28T23:59:59+05:30').toISOString());

    const justBefore = new Date('2026-11-28T23:59:58+05:30');
    const justAfter = new Date('2026-11-29T00:00:00+05:30');

    expect(justBefore.getTime()).toBeLessThan(endBoundary.getTime());
    expect(justAfter.getTime()).toBeGreaterThan(endBoundary.getTime());
  });
});
