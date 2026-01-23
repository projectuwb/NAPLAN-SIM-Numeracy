// Answer normalization and comparison utilities

/**
 * Normalize an answer by removing common formatting
 */
export function normalizeAnswer(answer) {
  if (!answer && answer !== 0) return null;

  const cleaned = String(answer).trim().toLowerCase();

  // Remove currency symbols
  let normalized = cleaned.replace(/[$€£¥¢]/g, '');

  // Remove unit text (dollars, cents, mm, cm, etc.)
  normalized = normalized.replace(/\b(dollars?|cents?|mm|cm|m|km|g|kg|ml|l|litres?|meters?|grams?)\b/gi, '');

  // Remove whitespace
  normalized = normalized.trim();

  // Handle fractions (e.g., "1/2")
  if (normalized.includes('/')) {
    const parts = normalized.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const denom = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
        return num / denom;
      }
    }
  }

  // Convert to number if possible
  const asNumber = parseFloat(normalized);
  if (!isNaN(asNumber) && isFinite(asNumber)) {
    return asNumber;
  }

  return normalized;
}

/**
 * Compare student answer with correct answer
 */
export function compareAnswers(studentAnswer, correctAnswer, tolerance = 0.01) {
  const student = normalizeAnswer(studentAnswer);
  const correct = normalizeAnswer(correctAnswer);

  // Handle null/empty student answer
  if (student === null || student === '') return false;
  if (correct === null) return false;

  // Both are numbers - use tolerance for comparison
  if (typeof student === 'number' && typeof correct === 'number') {
    return Math.abs(student - correct) <= tolerance;
  }

  // String comparison (case-insensitive)
  return String(student).toLowerCase() === String(correct).toLowerCase();
}

/**
 * Format answer for display
 */
export function formatAnswer(answer) {
  if (answer === null || answer === undefined || answer === '') {
    return '(No answer)';
  }

  const normalized = normalizeAnswer(answer);

  if (typeof normalized === 'number') {
    // Round to 2 decimal places if needed
    if (normalized % 1 === 0) {
      return String(normalized);
    }
    return normalized.toFixed(2);
  }

  return String(answer);
}

/**
 * Check if answer is considered "answered" (not empty/null)
 */
export function isAnswered(answer) {
  if (answer === null || answer === undefined) return false;
  const trimmed = String(answer).trim();
  return trimmed.length > 0;
}

/**
 * Validate numeric input
 */
export function validateNumericInput(input) {
  if (!input) return true; // Empty is OK (unanswered)

  const cleaned = input.replace(/[$€£¥,\s]/g, '');

  // Allow numbers, decimals, fractions, and negative numbers
  const numericPattern = /^-?\d*\.?\d+$|^\d+\/\d+$/;
  return numericPattern.test(cleaned);
}
