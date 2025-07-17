import { calculateFeeWithTax, isKnownSnitch, yearsExperienceCategory } from './hireHelpers';

describe('calculateFeeWithTax', () => {
  it('adds 10% markup to fee', () => {
    const goon = { fee: 1000 };
    expect(calculateFeeWithTax(goon)).toBe(1100);
  });
});

describe('isKnownSnitch', () => {
  it('returns true if snitch is true', () => {
    const goon = { snitch: true };
    expect(isKnownSnitch(goon)).toBe(true);
  });

  it('returns false if snitch is false', () => {
    const goon = { snitch: false };
    expect(isKnownSnitch(goon)).toBe(false);
  });
});

describe('yearsExperienceCategory', () => {
  it('returns Veteran for 12 years', () => {
    const goon = { years: 12 };
    expect(yearsExperienceCategory(goon)).toBe('Veteran');
  });

  it('returns Experienced for 7 years', () => {
    const goon = { years: 7 };
    expect(yearsExperienceCategory(goon)).toBe('Experienced');
  });

  it('returns Rookie for 2 years', () => {
    const goon = { years: 2 };
    expect(yearsExperienceCategory(goon)).toBe('Rookie');
  });
});
