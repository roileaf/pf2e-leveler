import { CharacterWizard } from '../../../scripts/ui/character-wizard/index.js';
import { loadOptionalClassArchetypes } from '../../../scripts/ui/character-wizard/loaders.js';
import { activateCharacterWizardListeners } from '../../../scripts/ui/character-wizard/listeners.js';
import {
  createCreationData,
  getClassArchetypeGrantedSkills,
  setClass,
  setClassArchetype,
  setDualClass,
} from '../../../scripts/creation/creation-model.js';
import { getRequiredSecondLevelClassFeatForActor } from '../../../scripts/classes/class-archetype-requirements.js';

const WARRIOR_OF_LEGEND = {
  uuid: 'Compendium.pf2e.classfeatures.Item.warrior-of-legend',
  name: 'Warrior of Legend',
  slug: 'warrior-of-legend',
  img: 'icon.webp',
  type: 'feat',
  traits: ['fighter'],
  otherTags: ['class-archetype'],
  rarity: 'common',
};

function classFeatureDoc(overrides) {
  return { ...WARRIOR_OF_LEGEND, ...overrides };
}

describe('optional class archetypes', () => {
  it('offers untagged class archetypes for the class but not subclasses or other classes', async () => {
    const wizard = new CharacterWizard(createMockActor());
    wizard._loadCompendium = jest.fn(async () => [
      classFeatureDoc({}),
      classFeatureDoc({ uuid: 'battle-creed', name: 'Battle Creed', traits: ['cleric'], otherTags: ['class-archetype', 'cleric-doctrine'] }),
      classFeatureDoc({ uuid: 'seneschal', name: 'Seneschal', traits: ['witch'] }),
      classFeatureDoc({ uuid: 'flexible', name: 'Flexible Spell Preparation', traits: [] }),
      classFeatureDoc({ uuid: 'shield-block', name: 'Shield Block', otherTags: [] }),
    ]);
    wizard._getCachedDocument = jest.fn(async (uuid) => (uuid === WARRIOR_OF_LEGEND.uuid
      ? { system: { rules: [], description: { value: '<p>You are trained in both Acrobatics and Athletics, rather than one or the other.</p>' } } }
      : { system: { rules: [], description: { value: '' } } }));

    await expect(loadOptionalClassArchetypes(wizard, { slug: 'fighter' })).resolves.toEqual([
      expect.objectContaining({ uuid: WARRIOR_OF_LEGEND.uuid, name: 'Warrior of Legend', grantedSkills: ['acrobatics', 'athletics'] }),
    ]);
    await expect(loadOptionalClassArchetypes(wizard, { slug: 'witch' })).resolves.toEqual([
      expect.objectContaining({ uuid: 'seneschal', grantedSkills: [] }),
    ]);
    await expect(loadOptionalClassArchetypes(wizard, { slug: 'cleric' })).resolves.toEqual([]);
  });

  it('selects and clears the class archetype from the class step checkbox', async () => {
    const data = createCreationData();
    setClass(data, { slug: 'fighter', name: 'Fighter' });
    const option = { uuid: WARRIOR_OF_LEGEND.uuid, name: 'Warrior of Legend', grantedSkills: ['acrobatics', 'athletics'] };
    const wizard = { data, _saveAndRender: jest.fn(), _loadOptionalClassArchetypes: jest.fn(async () => [option]) };
    const root = document.createElement('div');
    root.innerHTML = `<input type="checkbox" data-action="setClassArchetype" data-target="primary" data-uuid="${option.uuid}">`;
    activateCharacterWizardListeners(wizard, root);
    const checkbox = root.querySelector('input');

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(data.classArchetype).toEqual(expect.objectContaining({ uuid: option.uuid, grantedSkills: ['acrobatics', 'athletics'] }));
    expect(getClassArchetypeGrantedSkills(data)).toEqual(['acrobatics', 'athletics']);

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(data.classArchetype).toBeNull();
  });

  it('resets class archetypes when the class changes', () => {
    const data = createCreationData();
    setClass(data, { slug: 'fighter', name: 'Fighter' });
    setDualClass(data, { slug: 'witch', name: 'Witch' });
    setClassArchetype(data, WARRIOR_OF_LEGEND);
    setClassArchetype(data, { uuid: 'seneschal', name: 'Seneschal' }, 'secondary');

    setDualClass(data, { slug: 'wizard', name: 'Wizard' });
    expect(data.dualClassArchetype).toBeNull();
    expect(data.classArchetype?.uuid).toBe(WARRIOR_OF_LEGEND.uuid);

    setClass(data, { slug: 'rogue', name: 'Rogue' });
    expect(data.classArchetype).toBeNull();
  });

  it('requires the class archetype dedication at level 2 even without a subclass', () => {
    const actor = {
      class: { slug: 'fighter' },
      items: [{
        type: 'feat',
        name: 'Warrior of Legend',
        system: {
          traits: { value: ['fighter'], otherTags: ['class-archetype'] },
          description: { value: '<p>You must select @UUID[Compendium.pf2e.feats-srd.Item.abc]{Warrior of Legend Dedication} as your 2nd-level class feat.</p>' },
        },
      }],
    };

    expect(getRequiredSecondLevelClassFeatForActor(actor)).toEqual(expect.objectContaining({
      name: 'Warrior of Legend Dedication',
      slug: 'warrior-of-legend-dedication',
    }));
  });
});
