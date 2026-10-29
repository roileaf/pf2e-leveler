import { resolveSpellcastingTradition } from '../data/subclass-spells.js';

const ELEMENTAL_TRADITIONS = new Set(['arcane', 'primal']);

// pf2e gives these class archetypes no class trait and states who may take them only in prose.
const CLASSLESS_ARCHETYPE_RULES = {
  // "You must have a class that casts spells with a spell repertoire."
  'wellspring-magic': (classDef) => classDef?.spellcasting?.type === 'spontaneous',
  // "...a spellcasting class feature that chooses spells from the arcane or primal spell list."
  'elemental-magic': (classDef, subclass) => {
    // Wizards trade their arcane school for an elemental one, which the school step can't offer yet.
    if (!classDef?.spellcasting || classDef.slug === 'wizard') return false;
    const tradition = resolveSpellcastingTradition(classDef.spellcasting.tradition, subclass, null);
    return !tradition || ELEMENTAL_TRADITIONS.has(tradition);
  },
};

export function isClassArchetypeEligible(archetype, classDef, subclass = null) {
  const rule = CLASSLESS_ARCHETYPE_RULES[archetype?.slug];
  if (rule) return rule(classDef, subclass);
  return !!classDef?.slug && (archetype?.traits ?? []).includes(classDef.slug);
}

export function hasWellspringMagic(actor) {
  const items = actor?.items?.contents ?? (Array.isArray(actor?.items) ? actor.items : []);
  return items.some((item) => item?.type === 'feat' && (item.slug ?? item.system?.slug) === 'wellspring-magic');
}

// Wellspring mages keep their repertoire but have one fewer slot of each rank and one fewer cantrip.
export function getWellspringSpellSlots(slots) {
  return Object.fromEntries(Object.entries(slots ?? {}).map(([rank, count]) => [rank, Math.max(0, Number(count) - 1)]));
}
