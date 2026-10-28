import { BOUNDED_SPELL_SLOTS } from './bounded-spell-slots.js';

export const MAGUS = {
  slug: 'magus',
  nameKey: 'PF2E_LEVELER.MAGUS.NAME',
  compendiumUuid: 'Compendium.pf2e.classes.Item.Magus',
  keyAbility: ['str', 'dex'],
  hp: 8,

  featSchedule: {
    class: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    skill: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    general: [3, 7, 11, 15, 19],
    ancestry: [5, 9, 13, 17],
  },
  skillIncreaseSchedule: [3, 5, 7, 9, 11, 13, 15, 17, 19],
  abilityBoostSchedule: [5, 10, 15, 20],

  classFeatures: [
    { level: 1, name: 'Spellstrike', key: 'spellstrike' },
    { level: 5, name: 'Lightning Reflexes', key: 'lightning-reflexes' },
    { level: 5, name: 'Weapon Expertise', key: 'weapon-expertise' },
    { level: 7, name: 'Studious Spells', key: 'studious-spells' },
    { level: 7, name: 'Weapon Specialization', key: 'weapon-specialization' },
    { level: 9, name: 'Alertness', key: 'alertness' },
    { level: 9, name: 'Expert Spellcaster', key: 'expert-spellcaster' },
    { level: 9, name: 'Resolve', key: 'resolve' },
    { level: 11, name: 'Medium Armor Expertise', key: 'medium-armor-expertise' },
    { level: 13, name: 'Weapon Mastery', key: 'weapon-mastery' },
    { level: 15, name: 'Greater Weapon Specialization', key: 'greater-weapon-specialization' },
    { level: 15, name: 'Juggernaut', key: 'juggernaut' },
    { level: 17, name: 'Master Spellcaster', key: 'master-spellcaster' },
    { level: 17, name: 'Medium Armor Mastery', key: 'medium-armor-mastery' },
    { level: 19, name: 'Double Spellstrike', key: 'double-spellstrike' },
  ],

  spellcasting: {
    tradition: 'arcane',
    type: 'prepared',
    bounded: true,
    slots: BOUNDED_SPELL_SLOTS,
  },
};
