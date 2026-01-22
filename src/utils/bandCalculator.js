import { BAND_SCORES } from './constants';

export function calculateBandScore(percentage, yearLevel) {
  const bands = BAND_SCORES[yearLevel];
  if (!bands) return null;

  for (const { min, max, band } of bands) {
    if (percentage >= min && percentage < max) {
      return band;
    }
  }

  // If 100%, return highest band
  if (percentage === 100) {
    return bands[bands.length - 1].band;
  }

  return null;
}

export function getPerformanceColor(percentage) {
  if (percentage >= 80) return 'text-green-600 bg-green-100';
  if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
  if (percentage >= 40) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
}

export function getPerformanceLabel(percentage) {
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 60) return 'Good';
  if (percentage >= 40) return 'Fair';
  return 'Needs Improvement';
}
