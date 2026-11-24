import { getAncestryAttributeSlots } from '../../../scripts/creation/heritage-attributes.js';

const ALL = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const lashunta = {
  system: {
    boosts: { 0: { value: ['cha'] }, 1: { value: [] }, 2: { value: [...ALL] } },
    flaws: { 0: { value: [...ALL] } },
  },
};
const goblin = {
  system: {
    boosts: { 0: { value: ['dex'] }, 1: { value: ['cha'] }, 2: { value: [...ALL] } },
    flaws: { 0: { value: ['wis'] } },
  },
};

describe('heritage attribute overrides', () => {
  it('fills Damaya Lashunta with an Int boost and Con flaw and keeps Int out of the free boost', () => {
    const slots = getAncestryAttributeSlots(lashunta, { slug: 'damaya-lashunta' });

    expect(slots.changed).toBe(true);
    expect(slots.boosts[1].value).toEqual(['int']);
    expect(slots.boosts[2].value).toEqual(['str', 'dex', 'con', 'wis', 'cha']);
    expect(slots.flaws[0].value).toEqual(['con']);
    expect(lashunta.system.boosts[1].value).toEqual([]);
  });

  it('swaps fixed values and finds the heritage by name when it has no slug', () => {
    const slots = getAncestryAttributeSlots(goblin, { name: 'Junker Goblin' });

    expect(slots.boosts[1].value).toEqual(['int']);
    expect(slots.boosts[2].value).not.toContain('int');
    expect(slots.flaws[0].value).toEqual(['wis']);
  });

  it('leaves ancestries alone for heritages without an override', () => {
    const slots = getAncestryAttributeSlots(lashunta, { slug: 'unbound-lashunta' });

    expect(slots.changed).toBe(false);
    expect(slots.boosts).toEqual(lashunta.system.boosts);
    expect(slots.flaws).toEqual(lashunta.system.flaws);
  });
});
