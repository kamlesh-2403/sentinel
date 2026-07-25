export interface FindingValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateFinding(input: { id?: string; title?: string }): FindingValidationResult {
  const errors: string[] = [];

  if (!input.id) {
    errors.push('Finding id is required');
  }

  if (!input.title) {
    errors.push('Finding title is required');
  }

  return { isValid: errors.length === 0, errors };
}
