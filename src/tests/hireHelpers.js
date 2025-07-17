export function calculateFeeWithTax(goon) {
  return Math.round(goon.fee * 1.1);
}

export function isKnownSnitch(goon) {
  return goon.snitch === true;
}

export function yearsExperienceCategory(goon) {
  if (goon.years >= 10) return 'Veteran';
  if (goon.years >= 5) return 'Experienced';
  return 'Rookie';
}
