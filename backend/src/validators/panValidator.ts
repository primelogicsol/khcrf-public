export const validateAndNormalizePan = (pan: unknown): { isValid: boolean; normalized?: string; error?: string } => {
    if (!pan || typeof pan !== 'string' || pan.trim() === '') {
        return { isValid: true, normalized: undefined }; // empty/missing is allowed
    }
    const normalized = pan.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    if (!panRegex.test(normalized)) {
        return { isValid: false, error: 'Invalid PAN format' };
    }
    return { isValid: true, normalized };
};
