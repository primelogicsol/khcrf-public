export class PublicationDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PublicationNotVisibleError extends PublicationDomainError {
  constructor(publicationId: string) {
    super(`Publication ${publicationId} is not visible to the requested audience.`);
  }
}

export class EditionConflictError extends PublicationDomainError {
  constructor(publicationId: string) {
    super(`Multiple active published editions found for publication ${publicationId}.`);
  }
}

export class EditionNotFoundError extends PublicationDomainError {
  constructor(publicationId: string, criteria: string) {
    super(`Edition matching ${criteria} not found for publication ${publicationId}.`);
  }
}

export class MappingInvariantError extends PublicationDomainError {
  constructor(message: string) {
    super(`Mapping invariant violated: ${message}`);
  }
}

export class CanonicalResolutionError extends PublicationDomainError {
  constructor(field: string, reason: string) {
    super(`Failed to resolve canonical field ${field}: ${reason}`);
  }
}
