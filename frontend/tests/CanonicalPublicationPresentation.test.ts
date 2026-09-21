import { toCanonicalPublicationPresentation } from '../src/types/CanonicalPublicationPresentation';

describe('CanonicalPublicationPresentation Mapper', () => {
  it('publication code is not auto-generated when canonical metadata exists', () => {
    const pub = {
      title: "Test",
      metadata: { publicationCode: "HCRF-MI-2026-9999" },
    };
    const result = toCanonicalPublicationPresentation(pub);
    expect(result.publicationCode).toBe("HCRF-MI-2026-9999");
  });

  it('publishing series never maps into the publication-code field', () => {
    const pub = {
      title: "Test",
      isbn: null,
      metadata: { publicationCode: "HCRF-MI-2026-9999" },
    };
    const result = toCanonicalPublicationPresentation(pub);
    expect(result.publicationCode).toBe("HCRF-MI-2026-9999");
    expect(result.publishingSeries).toBe(null);
    expect(result.isbn).toBeNull(); // It should move to publishingSeries, and isbn should be null
  });

  it('unknown ISBN values remain hidden', () => {
    const pub = {
      title: "Test",
      isbn: null,
      features: { isbn: null },
      metadata: { isbn: null }
    };
    const result = toCanonicalPublicationPresentation(pub);
    expect(result.isbn).toBeNull();
  });

  it('page count is never hardcoded', () => {
    const pubWith0 = { title: "Test", pages: 0 };
    const pubWith100 = { title: "Test", pages: 100 };
    
    expect(toCanonicalPublicationPresentation(pubWith0).pageCount).toBe(0);
    expect(toCanonicalPublicationPresentation(pubWith100).pageCount).toBe(100);
  });

  it('the approved TOC renders in the correct order', () => {
    const pub = {
      title: "Test",
      chapters: [
        { title: "Methodology", order: 3 },
        { title: "Executive Summary", order: 2 },
        { title: "FRONT MATTER", type: "PART", order: 1 }
      ]
    };
    const result = toCanonicalPublicationPresentation(pub);
    expect(result.chapters[0].title).toBe("FRONT MATTER");
    expect(result.chapters[1].title).toBe("Executive Summary");
    expect(result.chapters[2].title).toBe("Methodology");
  });
});
