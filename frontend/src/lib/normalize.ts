export function normalizeArray<T>(
  payload: unknown,
  candidateKeys: string[] = []
): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  const root =
    (payload as any)?.data?.data ??
    (payload as any)?.data ??
    payload;

  if (Array.isArray(root)) {
    return root as T[];
  }

  for (const key of candidateKeys) {
    const value = root?.[key];
    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return [];
}
