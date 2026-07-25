export interface ProjectValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateProject(input: { id?: string; name?: string }): ProjectValidationResult {
  const errors: string[] = [];

  if (!input.id) {
    errors.push('Project id is required');
  }

  if (!input.name) {
    errors.push('Project name is required');
  }

  return { isValid: errors.length === 0, errors };
}
