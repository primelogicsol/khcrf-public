import { describe, it, expect } from '@jest/globals';
import { validateAndNormalizePan } from '../src/validators/panValidator';

describe('PAN Validation', () => {
    it('request without PAN is valid (returns undefined)', () => {
        expect(validateAndNormalizePan(undefined)).toEqual({ isValid: true, normalized: undefined });
        expect(validateAndNormalizePan(null)).toEqual({ isValid: true, normalized: undefined });
    });

    it('valid PAN returns normalized PAN', () => {
        expect(validateAndNormalizePan('ABCDE1234F')).toEqual({ isValid: true, normalized: 'ABCDE1234F' });
    });

    it('lowercase PAN normalized to uppercase', () => {
        expect(validateAndNormalizePan('abcde1234f')).toEqual({ isValid: true, normalized: 'ABCDE1234F' });
    });

    it('PAN containing surrounding spaces is trimmed', () => {
        expect(validateAndNormalizePan('  ABCDE1234F  ')).toEqual({ isValid: true, normalized: 'ABCDE1234F' });
    });

    it('invalid PAN rejected', () => {
        expect(validateAndNormalizePan('ABCDE12345')).toEqual({ isValid: false, error: 'Invalid PAN format' });
        expect(validateAndNormalizePan('ABC1234F')).toEqual({ isValid: false, error: 'Invalid PAN format' });
        expect(validateAndNormalizePan('1234567890')).toEqual({ isValid: false, error: 'Invalid PAN format' });
    });

    it('empty PAN treated as null or omitted', () => {
        expect(validateAndNormalizePan('')).toEqual({ isValid: true, normalized: undefined });
        expect(validateAndNormalizePan('   ')).toEqual({ isValid: true, normalized: undefined });
    });
});
