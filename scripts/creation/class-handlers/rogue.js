import { BaseClassHandler } from './base.js';
import { ClassRegistry } from '../../classes/registry.js';

const ROGUE_RACKET_KEY_ABILITIES = {
  mastermind: ['int'],
  ruffian: ['str'],
  scoundrel: ['cha'],
};

export class RogueHandler extends BaseClassHandler {
  async getKeyAbilityOptions(data, classDef) {
    const baseOptions = classDef?.keyAbility ?? ['dex'];
    const subclassSlug = data.subclass?.slug ?? '';

    if (ROGUE_RACKET_KEY_ABILITIES[subclassSlug]) {
      return [...new Set([...baseOptions, ...ROGUE_RACKET_KEY_ABILITIES[subclassSlug]])];
    }

    const racketKeyOptions = await this._getRacketKeyOptions(data.subclass);
    if (racketKeyOptions.length > 0) return [...new Set([...baseOptions, ...racketKeyOptions])];

    if (subclassSlug === 'eldritch-trickster') {
      const dedicationOptions = await this._getEldritchTricksterDedicationKeyAbilities(data);
      if (dedicationOptions.length > 0) return [...new Set([...baseOptions, ...dedicationOptions])];
      return baseOptions;
    }

    return baseOptions;
  }

  // Class-archetype rackets (e.g. Avenger) declare extra key attributes on the item itself.
  async _getRacketKeyOptions(subclass) {
    if (!subclass?.uuid) return [];
    const item = await fromUuid(subclass.uuid).catch(() => null);
    const keyOptions = item?.system?.subfeatures?.keyOptions;
    return Array.isArray(keyOptions) ? keyOptions : [];
  }

  async _getEldritchTricksterDedicationKeyAbilities(data) {
    const selectedValues = Object.values(data.subclass?.choices ?? {})
      .filter((value) => typeof value === 'string' && value.length > 0);

    for (const selectedValue of selectedValues) {
      const slug = await this._resolveSelectedChoiceSlug(selectedValue);
      if (!slug?.endsWith('-dedication')) continue;

      const classSlug = slug.replace(/-dedication$/, '');
      const classDef = ClassRegistry.get(classSlug);
      if (classDef?.keyAbility?.length) {
        return classDef.keyAbility;
      }
    }

    return [];
  }

  async _resolveSelectedChoiceSlug(selectedValue) {
    if (selectedValue.startsWith('Compendium.')) {
      const item = await fromUuid(selectedValue).catch(() => null);
      return item?.slug ?? null;
    }

    return selectedValue;
  }
}
