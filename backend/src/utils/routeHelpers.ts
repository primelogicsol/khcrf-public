import { Request, Response } from 'express';

export function requireString(value: string | string[] | undefined | any): string {
    if (typeof value === 'string') return value;
    throw new Error('Invalid parameter: expected a single string');
}
