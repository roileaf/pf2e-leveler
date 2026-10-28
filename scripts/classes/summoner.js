import { BOUNDED_SPELL_SLOTS } from './bounded-spell-slots.js';

export const SUMMONER = {
  slug: 'summoner',
  nameKey: 'PF2E_LEVELER.SUMMONER.NAME',
  compendiumUuid: 'Compendium.pf2e.classes.Item.Summoner',
  keyAbility: ['cha'],
  hp: 10,

  featSchedule: {
    class: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    skill: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    general: [3, 7, 11, 15, 19],
    ancestry: [5, 9, 13, 17],
  },
  skillIncreaseSchedule: [3, 5, 7, 9, 11, 13, 15, 17, 19],
  abilityBoostSchedule: [5, 10, 15, 20],

  classFeatures: [
    { level: 3, name: 'Shared Vigilance', key: 'shared-vigilance' },
    { level: 3, name: 'Unlimited Signature Spells', key: 'unlimited-signature-spells' },
    { level: 5, name: 'Eidolon Unarmed Expertise', key: 'eidolon-unarmed-expertise' },
    { level: 7, name: 'Eidolon Symbiosis', key: 'eidolon-symbiosis' },
    { level: 7, name: 'Eidolon Weapon Specialization', key: 'eidolon-weapon-specialization' },
    { level: 9, name: 'Expert Spellcaster', key: 'expert-spellcaster' },
    { level: 9, name: 'Shared Reflexes', key: 'shared-reflexes' },
    { level: 11, name: 'Eidolon Defensive Expertise', key: 'eidolon-defensive-expertise' },
    { level: 11, name: 'Simple Weapon Expertise', key: 'simple-weapon-expertise' },
    { level: 11, name: 'Twin Juggernauts', key: 'twin-juggernauts' },
    { level: 13, name: 'Defensive Robes', key: 'defensive-robes' },
    { level: 13, name: 'Eidolon Unarmed Mastery', key: 'eidolon-unarmed-mastery' },
    { level: 13, name: 'Weapon Specialization', key: 'weapon-specialization' },
    { level: 15, name: 'Greater Eidolon Specialization', key: 'greater-eidolon-specialization' },
    { level: 15, name: 'Shared Resolve', key: 'shared-resolve' },
    { level: 17, name: 'Eidolon Transcendence', key: 'eidolon-transcendence' },
    { level: 17, name: 'Master Spellcaster', key: 'master-spellcaster' },
    { level: 19, name: 'Eidolon Defensive Mastery', key: 'eidolon-defensive-mastery' },
    { level: 19, name: 'Instant Manifestation', key: 'instant-manifestation' },
  ],

  spellcasting: {
    tradition: 'patron',
    type: 'spontaneous',
    bounded: true,
    slots: BOUNDED_SPELL_SLOTS,
  },
};
