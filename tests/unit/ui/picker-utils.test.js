import {
  applyExcludedTraitFilter,
  buildTraitAutocompleteMarkup,
  initializeSelectionSet,
  parseTraitQuery,
  normalizeItemCategory,
  toggleSelectableChip,
} from '../../../scripts/ui/shared/picker-utils.js';

describe('picker utils', () => {
  test('selection sets default to all available values when empty', () => {
    const selected = initializeSelectionSet(new Set(), ['a', 'b', 'c']);
    expect([...selected]).toEqual(['a', 'b', 'c']);
  });

  test('toggling a selected chip from all-selected deselects only that chip', () => {
    const next = toggleSelectableChip(new Set(['a', 'b', 'c']), 'b', ['a', 'b', 'c']);
    expect([...next]).toEqual(['a', 'c']);
  });

  test('toggling the last selected value returns an empty set', () => {
    const next = toggleSelectableChip(new Set(['b']), 'b', ['a', 'b', 'c']);
    expect([...next]).toEqual([]);
  });

  test('normalizes item categories for the item picker', () => {
    expect(normalizeItemCategory({ type: 'weapon' })).toBe('weapon');
    expect(normalizeItemCategory({ type: 'armor' })).toBe('armor');
    expect(normalizeItemCategory({ type: 'consumable' })).toBe('consumable');
    expect(normalizeItemCategory({ type: 'backpack' })).toBe('container');
    expect(normalizeItemCategory({ type: 'ammo' })).toBe('ammunition');
    expect(normalizeItemCategory({ type: 'consumable', system: { category: 'ammunition' } })).toBe('ammunition');
    expect(normalizeItemCategory({ type: 'equipment', system: { category: { value: 'ammunition' } } })).toBe('ammunition');
  });

  test.each([
    ['skill', { exclude: false, trait: 'skill' }],
    ['-Skill', { exclude: true, trait: 'skill' }],
    ['!skill', { exclude: true, trait: 'skill' }],
    ['  - skill ', { exclude: true, trait: 'skill' }],
    ['-', { exclude: true, trait: '' }],
  ])('parses trait query %j', (value, expected) => {
    expect(parseTraitQuery(value)).toEqual(expected);
  });

  test('excluded traits drop every entry that has one of them', () => {
    const entries = [
      { name: 'Toughness', traits: ['general'] },
      { name: 'Battle Medicine', traits: ['general', 'Skill'] },
    ];

    expect(applyExcludedTraitFilter(entries, new Set(['skill']), (entry) => entry.traits)).toEqual([entries[0]]);
    expect(applyExcludedTraitFilter(entries, new Set(), (entry) => entry.traits)).toEqual(entries);
  });

  test('autocomplete suggestions keep the exclude prefix so picking one excludes it', () => {
    const markup = buildTraitAutocompleteMarkup(['skill', 'skirmisher'], '-ski');

    expect(markup).toContain('data-trait="-skill"');
    expect(markup).toContain('data-trait="-skirmisher"');
    expect(markup).toContain('<mark>ski</mark>');
    expect(buildTraitAutocompleteMarkup(['skill'], 'ski')).toContain('data-trait="skill"');
  });
});
