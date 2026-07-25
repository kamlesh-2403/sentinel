export interface ReportValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateReport(input: { id?: string; title?: string }): ReportValidationResult {
  const errors: string[] = [];

  if (!input.id) {
    errors.push('Report id is required');
  }

  if (!input.title) {
    errors.push('Report title is required');
  }

  return { isValid: errors.length === 0, errors };
}
