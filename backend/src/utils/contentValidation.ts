export const validatePublicContent = (content: string | null | undefined): { isValid: boolean; flaggedPhrase?: string } => {
    if (!content) return { isValid: true };

    const forbiddenPhrases = [
        "TODO",
        "FIXME",
        "placeholder",
        "check source code",
        "hidden for brevity",
        "lorem ipsum",
        "mock data",
        "sample content"
    ];

    const lowerContent = content.toLowerCase();
    
    for (const phrase of forbiddenPhrases) {
        if (lowerContent.includes(phrase.toLowerCase())) {
            // Check if it's "TODO" or "FIXME", those are typically exact case, but lowercasing here is fine for now
            return { isValid: false, flaggedPhrase: phrase };
        }
    }

    return { isValid: true };
};
