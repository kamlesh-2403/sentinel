export interface RecommendationValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateRecommendation(input: { id?: string; title?: string }): RecommendationValidationResult {
  const errors: string[] = [];

  if (!input.id) {
    errors.push('Recommendation id is required');
  }

  if (!input.title) {
    errors.push('Recommendation title is required');
  }

  return { isValid: errors.length === 0, errors };
}
