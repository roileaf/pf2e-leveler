import { ATTRIBUTES } from '../constants.js';
import { slugify } from '../utils/pf2e-api.js';

// SF2e heritages that change their ancestry's boosts and flaws only in description text.
// `swap` replaces a fixed value, `fill` sets the ancestry's open slot (an empty boost slot or a
// pick-one flaw), and `freeExcludes` removes an attribute from the free ancestry boost.
const HERITAGE_ATTRIBUTE_OVERRIDES = {
  'damaya-lashunta': { boosts: { fill: 'int' }, flaws: { fill: 'con' }, freeExcludes: 'int' },
  'korasha-lashunta': { boosts: { fill: 'str' }, flaws: { fill: 'wis' }, freeExcludes: 'str' },
  'junker-goblin': { boosts: { swap: { cha: 'int' } }, freeExcludes: 'int' },
  'fierce-ysoki': { boosts: { swap: { dex: 'str' } }, flaws: { swap: { str: 'dex' } } },
  'electronica-android': { boosts: { swap: { int: 'cha' } }, flaws: { swap: { cha: 'wis' } } },
  'biotech-android': { flaws: { swap: { cha: 'con' } } },
  'hellforged-android': { boosts: { swap: { dex: 'str' } } },
  'deep-space-hryngar': { boosts: { swap: { wis: 'cha' } }, flaws: { swap: { cha: 'wis' } } },
  squentu: { boosts: { swap: { con: 'dex' } } },
  yeulentu: { boosts: { swap: { wis: 'int' } } },
};

export function getHeritageSlug(heritage) {
  return heritage?.slug ?? heritage?.system?.slug ?? (heritage?.name ? slugify(heritage.name) : null);
}

// Returns the ancestry's boost and flaw slots as the chosen heritage leaves them.
export function getAncestryAttributeSlots(ancestry, heritage) {
  const boosts = cloneSlots(ancestry?.system?.boosts);
  const flaws = cloneSlots(ancestry?.system?.flaws);
  const override = HERITAGE_ATTRIBUTE_OVERRIDES[getHeritageSlug(heritage)];
  if (!override) return { boosts, flaws, changed: false };

  applySlotEdits(boosts, override.boosts, (values) => values.length === 0);
  applySlotEdits(flaws, override.flaws, (values) => values.length !== 1);
  if (override.freeExcludes) {
    const free = Object.values(boosts).find((slot) => slot.value.length === ATTRIBUTES.length);
    if (free) free.value = free.value.filter((attribute) => attribute !== override.freeExcludes);
  }
  return { boosts, flaws, changed: true };
}

function cloneSlots(slots) {
  return Object.fromEntries(
    Object.entries(slots ?? {}).map(([key, slot]) => [key, { ...slot, value: [...(slot?.value ?? [])] }]),
  );
}

function applySlotEdits(slots, edits, isOpenSlot) {
  if (!edits) return;
  for (const slot of Object.values(slots)) {
    if (slot.value.length === 1 && edits.swap?.[slot.value[0]]) slot.value = [edits.swap[slot.value[0]]];
  }
  if (edits.fill) {
    const open = Object.values(slots).find((slot) => isOpenSlot(slot.value));
    if (open) open.value = [edits.fill];
  }
}
