import { SWASHBUCKLER } from '../../../scripts/classes/swashbuckler.js';
import { getChoicesForLevel, getSkillFeatRestriction } from '../../../scripts/classes/progression.js';

describe('Swashbuckler class definition', () => {
  test('has correct basic properties', () => {
    expect(SWASHBUCKLER.slug).toBe('swashbuckler');
    expect(SWASHBUCKLER.keyAbility).toEqual(['dex']);
    expect(SWASHBUCKLER.hp).toBe(10);
  });

  test('class feats start at level 2', () => {
    expect(SWASHBUCKLER.featSchedule.class[0]).toBe(2);
  });

  test('ability boosts exclude level 1', () => {
    expect(SWASHBUCKLER.abilityBoostSchedule).toEqual([5, 10, 15, 20]);
  });

  test('no spellcasting', () => {
    expect(SWASHBUCKLER.spellcasting).toBeNull();
  });

  test('level 2 choices include class feat and skill feat', () => {
    const types = getChoicesForLevel(SWASHBUCKLER, 2).map((c) => c.type);
    expect(types).toContain('classFeat');
    expect(types).toContain('skillFeat');
  });

  test('Precise Strike is a level 1 class feature', () => {
    const preciseStrike = SWASHBUCKLER.classFeatures.find((f) => f.key === 'precise-strike');
    expect(preciseStrike).toBeDefined();
    expect(preciseStrike.level).toBe(1);
  });

  test('class features include entries starting at level 1', () => {
    expect(SWASHBUCKLER.classFeatures[0].level).toBe(1);
  });

  describe('Stylish Tricks', () => {
    const actorWithStyle = (slug) => ({
      class: { slug: 'swashbuckler' },
      items: [{ type: 'classfeature', slug, name: slug, system: { traits: { otherTags: ['swashbuckler-style'] } } }],
    });

    test.each([3, 7, 15])('adds a bonus skill feat at level %i', (level) => {
      const types = getChoicesForLevel(SWASHBUCKLER, level).map((c) => c.type);
      expect(types).toContain('skillFeat');
    });

    test('does not add a skill feat at other odd levels', () => {
      expect(getChoicesForLevel(SWASHBUCKLER, 5).some((c) => c.type === 'skillFeat')).toBe(false);
    });

    test('limits the bonus feat to Acrobatics or the style skill', () => {
      expect(getSkillFeatRestriction(SWASHBUCKLER, 3, actorWithStyle('braggart')).skills).toEqual(['acrobatics', 'intimidation']);
      expect(getSkillFeatRestriction(SWASHBUCKLER, 7, actorWithStyle('battledancer')).skills).toEqual(['acrobatics', 'performance']);
    });

    test('allows any style skill when the style is unknown', () => {
      expect(getSkillFeatRestriction(SWASHBUCKLER, 15).skills).toEqual(
        ['acrobatics', 'performance', 'intimidation', 'deception', 'athletics', 'thievery', 'diplomacy'],
      );
    });

    test('regular skill feats stay unrestricted', () => {
      expect(getSkillFeatRestriction(SWASHBUCKLER, 4, actorWithStyle('fencer'))).toBeNull();
    });
  });
});
