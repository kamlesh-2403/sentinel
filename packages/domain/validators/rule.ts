export interface RuleValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateRule(input: { id?: string; name?: string }): RuleValidationResult {
  const errors: string[] = [];

  if (!input.id) {
    errors.push('Rule id is required');
  }

  if (!input.name) {
    errors.push('Rule name is required');
  }

  return { isValid: errors.length === 0, errors };
}
